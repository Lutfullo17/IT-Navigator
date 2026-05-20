export const DIRECTION_LABELS = {
  frontend: 'Sayt ko\'rinishi',
  backend: 'Ichki tizim',
  'data-analyst': 'Ma\'lumotlar tahlili',
  'ui-ux': 'Qulay dizayn',
  mobile: 'Mobil ilovalar',
  cybersecurity: 'Kiber xavfsizlik',
};

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

export function getDirectionLabel(slug, fallback = '') {
  return DIRECTION_LABELS[slug] || fallback || slug;
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

export function localizeDirection(direction) {
  if (!direction) return direction;
  return {
    ...direction,
    name: getDirectionLabel(direction.slug, direction.name),
  };
}

export function localizeDirections(directions) {
  if (!Array.isArray(directions)) return directions;
  return directions.map(localizeDirection);
}

export function localizeResult(result) {
  if (!result) return result;
  const slug = resolveSlug(result);
  return {
    ...result,
    slug: slug || result.slug,
    name: getDirectionLabel(slug, result.name),
  };
}

export function localizeResults(results) {
  if (!Array.isArray(results)) return results;
  return results.map(localizeResult);
}
