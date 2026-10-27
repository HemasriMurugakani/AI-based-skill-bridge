import { z } from 'zod';
import type { JdExtractPayload, InterviewScoreResponse } from './api';
import { Language, Persona } from '../types';

const configuredModels = (import.meta.env.VITE_GEMINI_MODELS as string | undefined)
  ?.split(',')
  .map(model => model.trim())
  .filter(Boolean);
const GEMINI_MODELS = configuredModels?.length
  ? configuredModels
  : ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite', 'gemini-3.8-flash'];
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_OUTPUT_TOKENS = 8192;
const RETRYABLE_STATUS_CODES = new Set([429, 503]);

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const languageNames: Record<Language, string> = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  hi: 'Hindi (हिन्दी)',
  fr: 'French'
};

export function normalizeLanguage(value: string | undefined): Language {
  const baseLanguage = value?.toLowerCase().split('-')[0];
  return baseLanguage === 'ta' || baseLanguage === 'hi' || baseLanguage === 'fr'
    ? baseLanguage
    : 'en';
}

function getLanguageInstruction(language: Language): string {
  switch (language) {
    case 'ta':
      return 'Write every explanation, heading, label, list item, recommendation, and question in natural Tamil script (தமிழ்). Keep only unavoidable proper nouns and technical identifiers such as React, JavaScript, HTML, CSS, API, GitHub, Node.js, and MongoDB in English. Translate common technical phrases into Tamil where possible.';
    case 'hi':
      return 'Write every explanation, heading, label, list item, recommendation, and question in natural Hindi using Devanagari script (हिन्दी). Keep only unavoidable proper nouns, code, and technical product names in English.';
    case 'fr':
      return 'Write every explanation, heading, label, list item, recommendation, and question in natural French. Keep only unavoidable proper nouns, code, and technical product names in English.';
    default:
      return 'Write every explanation, heading, label, list item, recommendation, and question in clear natural English.';
  }
}

export const isGeminiConfigured = Boolean(apiKey);

const jdExtractSchema = z.object({
  role: z.string(),
  company: z.string().optional(),
  requiredSkills: z.array(z.object({
    name: z.string(),
    importance: z.enum(['must', 'nice']),
    category: z.string(),
    why: z.string()
  })),
  softSkills: z.array(z.string()),
  eligibility: z.array(z.string())
});

const interviewScoreSchema = z.object({
  clarity: z.number(),
  confidence: z.number(),
  relevance: z.number(),
  overallScore: z.number().default(85),
  paceWpm: z.number(),
  fillerWordCount: z.number(),
  matchedFillers: z.array(z.string()).optional(),
  tips: z.array(z.string()),
  disclaimer: z.string().optional()
});

function parseJsonResponse<T>(text: string, schema: z.ZodType<T>): T {
  const withoutFence = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return schema.parse(JSON.parse(withoutFence));
}

async function generateText(prompt: string): Promise<string> {
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured.');
  }

  let lastError = 'Gemini request failed.';
  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.25,
            topP: 0.85,
            maxOutputTokens: MAX_OUTPUT_TOKENS
          }
        })
      });

      if (response.ok) {
        const json = await response.json() as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error(`Gemini returned an empty response from ${model}.`);
        }
        return text;
      }

      let detail = '';
      try {
        const errorBody = await response.json() as { error?: { message?: string } };
        detail = errorBody.error?.message ? ` ${errorBody.error.message}` : '';
      } catch {
        detail = '';
      }
      lastError = `Gemini request failed (${response.status}) using ${model}.${detail}`;

      if (!RETRYABLE_STATUS_CODES.has(response.status)) {
        break;
      }
      if (attempt === 0) {
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    }
  }

  throw new Error(`${lastError} Gemini is temporarily busy across the configured models. Please try again in a moment.`);
}

export async function getGeminiCoachAnswer(
  query: string,
  persona: Persona,
  language: Language
): Promise<string> {
  const responseLanguage = languageNames[language] || languageNames.en;
  const languageInstruction = getLanguageInstruction(language);
  return generateText(`You are SkillBridge, a practical career and technical coach.
Answer the learner entirely in ${responseLanguage}.
${languageInstruction}
Do not translate the learner's name, company names, code snippets, or technical product names.
Answer the learner directly, accurately, and encouragingly.
Use as much detail as needed, up to about 1800 words. Organize long answers with Tamil headings, unique sequential numbered steps, and bullet lists. Do not restart numbering accidentally.
Do not invent learner achievements. Give concrete next steps.
Learner: ${persona.name}, ${persona.tag}, target pathway ${persona.pathwayId}, location ${persona.location}.
Question: ${query}`);
}

export async function extractJobDescriptionWithGemini(
  jdText: string,
  language: Language
): Promise<JdExtractPayload> {
  const responseLanguage = languageNames[language] || languageNames.en;
  const languageInstruction = getLanguageInstruction(language);
  const text = await generateText(`Extract a job description into JSON only. Do not use markdown.
Use this exact shape:
{"role":"string","company":"string","requiredSkills":[{"name":"string","importance":"must","category":"string","why":"string"}],"softSkills":["string"],"eligibility":["string"]}
Set importance to only "must" or "nice". Keep 4-10 relevant skills. Write all explanatory values in ${responseLanguage}. ${languageInstruction}
Job description:
${jdText}`);
  return parseJsonResponse(text, jdExtractSchema);
}

export async function scoreInterviewWithGemini(
  params: {
    roleTitle: string;
    question: string;
    transcript: string;
    language: Language;
    durationSeconds: number;
  }
): Promise<InterviewScoreResponse> {
  const responseLanguage = languageNames[params.language] || languageNames.en;
  const languageInstruction = getLanguageInstruction(params.language);
  const text = await generateText(`Evaluate this mock interview answer as JSON only. Do not use markdown.
Use this exact shape:
{"clarity":number,"confidence":number,"relevance":number,"overallScore":number,"paceWpm":number,"fillerWordCount":number,"matchedFillers":["string"],"tips":["string"],"disclaimer":"string"}
All scores must be 0-100. Write tips and disclaimer entirely in ${responseLanguage}. ${languageInstruction}
Role: ${params.roleTitle}
Question: ${params.question}
Answer transcript: ${params.transcript}
Duration seconds: ${params.durationSeconds}`);
  return parseJsonResponse(text, interviewScoreSchema);
}
