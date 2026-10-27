#!/usr/bin/env node

/**
 * Script to verify i18n key completeness across all supported languages.
 * Compares ta, fr, and hi locale files against en as the authoritative source.
 * Fails (exit code 1) if any key is missing in any language.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCALES_DIR = path.resolve(__dirname, '../src/locales');

const SOURCE_LANG = 'en';
const TARGET_LANGS = ['ta', 'fr', 'hi'];

function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function loadLocaleFile(lang, filename) {
  const filePath = path.join(LOCALES_DIR, lang, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error parsing JSON in ${filePath}:`, err.message);
    return null;
  }
}

function runCheck() {
  console.log('🌐 Starting i18n key consistency check...\n');
  const sourceDir = path.join(LOCALES_DIR, SOURCE_LANG);

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source locale directory not found: ${sourceDir}`);
    process.exit(1);
  }

  const localeFiles = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.json'));
  console.log(`Authoritative Language: [${SOURCE_LANG}] (${localeFiles.length} namespaces found)`);
  console.log(`Target Languages: [${TARGET_LANGS.join(', ')}]\n`);

  let totalErrors = 0;
  let totalKeysCount = 0;

  for (const file of localeFiles) {
    const ns = path.basename(file, '.json');
    const sourceData = loadLocaleFile(SOURCE_LANG, file);

    if (!sourceData) {
      console.error(`❌ Could not load source file: ${SOURCE_LANG}/${file}`);
      totalErrors++;
      continue;
    }

    const sourceKeys = flattenKeys(sourceData);
    totalKeysCount += sourceKeys.length;

    console.log(`📁 Namespace: [${ns}] (${sourceKeys.length} keys in ${SOURCE_LANG})`);

    for (const targetLang of TARGET_LANGS) {
      const targetData = loadLocaleFile(targetLang, file);

      if (!targetData) {
        console.error(`   ❌ [${targetLang}] MISSING FILE: ${targetLang}/${file}`);
        totalErrors += sourceKeys.length;
        continue;
      }

      const targetKeys = new Set(flattenKeys(targetData));
      const missingKeys = sourceKeys.filter((k) => !targetKeys.has(k));

      if (missingKeys.length > 0) {
        console.error(`   ❌ [${targetLang}] Missing ${missingKeys.length} key(s):`);
        missingKeys.forEach((k) => console.error(`      - ${ns}:${k}`));
        totalErrors += missingKeys.length;
      } else {
        console.log(`   ✅ [${targetLang}] 100% matched (${targetKeys.size} keys)`);
      }
    }
    console.log('');
  }

  console.log('--------------------------------------------------');
  if (totalErrors > 0) {
    console.error(`\n❌ i18n check FAILED with ${totalErrors} missing or broken key(s).`);
    process.exit(1);
  } else {
    console.log(`\n🎉 i18n check PASSED! All ${totalKeysCount} keys are translated across all 4 languages (en, ta, fr, hi).`);
    process.exit(0);
  }
}

runCheck();
