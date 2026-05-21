import { DIRECTION_LABELS_I18N } from '../i18n/translations';
import { getPreferredLanguage } from '../api/auth';

export const DIRECTION_LABELS = DIRECTION_LABELS_I18N.uz;

const LEGACY_NAME_TO_SLUG = {
  'frontend developer': 'frontend',
  frontend: 'frontend',
  'backend developer': 'backend',
  backend: 'backend',
  'data analyst': 'data-analyst',
  'ui/ux designer': 'ui-ux',
  'ui/ux': 'ui-ux',
  'mobile developer': 'mobile',
  mobile: 'mobile',
  cybersecurity: 'cybersecurity',
};

export function getDirectionLabel(slug, fallback = '', language = null) {
  const lang = language || getPreferredLanguage();
  const labels = DIRECTION_LABELS_I18N[lang] || DIRECTION_LABELS_I18N.uz;
  return labels[slug] || DIRECTION_LABELS_I18N.uz[slug] || fallback || slug;
}

function resolveSlug(entry) {
  const slug = entry?.slug || '';
  if (DIRECTION_LABELS[slug]) return slug;

  const name = (entry?.name || '').trim().toLowerCase();
  for (const [legacy, resolved] of Object.entries(LEGACY_NAME_TO_SLUG)) {
    if (name.includes(legacy) || name === legacy) return resolved;
  }
  return slug;
}

export function localizeDirection(direction, language = null) {
  if (!direction) return direction;
  return {
    ...direction,
    name: getDirectionLabel(direction.slug, direction.name, language),
  };
}

export function localizeDirections(directions, language = null) {
  if (!Array.isArray(directions)) return directions;
  return directions.map((d) => localizeDirection(d, language));
}

export function localizeResult(result, language = null) {
  if (!result) return result;
  const slug = resolveSlug(result);
  const lang = language || getPreferredLanguage();
  const labels = DIRECTION_LABELS_I18N[lang] || DIRECTION_LABELS_I18N.uz;
  return {
    ...result,
    slug: slug || result.slug,
    name: labels[slug] || getDirectionLabel(slug, result.name, lang),
  };
}

export function localizeResults(results, language = null) {
  if (!Array.isArray(results)) return results;
  return results.map((r) => localizeResult(r, language));
}
