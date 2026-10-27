import { Language, Persona, Pathway, Challenge } from '../types';

/**
 * Returns single localized title for any item with title and optional titleTamil.
 * Never outputs dual languages simultaneously.
 */
export function getLocalizedTitle(
  item: { title: string; titleTamil?: string } | null | undefined,
  lang: string
): string {
  if (!item) return '';
  if (lang === 'ta' && item.titleTamil) {
    return item.titleTamil;
  }
  return item.title;
}

/**
 * Returns single localized name for any entity with name and optional nameTamil.
 * Never outputs dual languages simultaneously.
 */
export function getLocalizedName(
  item: { name: string; nameTamil?: string } | null | undefined,
  lang: string
): string {
  if (!item) return '';
  if (lang === 'ta' && item.nameTamil) {
    return item.nameTamil;
  }
  return item.name;
}

/**
 * Returns single localized persona details (name, tag, location, bio, education).
 */
export function getLocalizedPersona(persona: Persona, lang: string) {
  const isTa = lang === 'ta';
  return {
    ...persona,
    displayName: isTa ? persona.nameTamil : persona.name,
    displayTag: isTa && persona.tagTamil ? persona.tagTamil : persona.tag,
    displayLocation: isTa && persona.locationTamil ? persona.locationTamil : persona.location,
    displayBio: isTa && persona.bioTamil ? persona.bioTamil : persona.bio,
    displayEducation: isTa && persona.educationOrBackgroundTamil
      ? persona.educationOrBackgroundTamil
      : persona.educationOrBackground
  };
}
