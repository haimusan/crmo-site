import { CONTENT_SCHEMA_VERSION, CONTENT_STORAGE_KEY, defaultContent } from '../data/defaultContent';

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return null;
  }
}

function normalizeTile(tile, fallbackId) {
  const imageList = Array.isArray(tile?.images) ? tile.images.filter(Boolean) : [];
  const firstImage = tile?.imageSrc ? [tile.imageSrc] : [];

  return {
    id: String(tile?.id || fallbackId),
    projectId: String(tile?.projectId || fallbackId),
    client: String(tile?.client || ''),
    title: String(tile?.title || 'שם הפרויקט'),
    desc: String(tile?.desc || ''),
    href: String(tile?.href || '#'),
    images: imageList.length ? imageList : firstImage
  };
}

function normalizeGallery(gallery, fallbackKey) {
  const key = String(gallery?.key || fallbackKey);
  const tiles = Array.isArray(gallery?.tiles) ? gallery.tiles : [];

  return {
    key,
    slug: String(gallery?.slug || key),
    visible: gallery?.visible !== false,
    hideOnMobile: Boolean(gallery?.hideOnMobile),
    expandPageEnabled: Boolean(gallery?.expandPageEnabled),
    title: {
      mobile: String(gallery?.title?.mobile || gallery?.title || ''),
      desktop: String(gallery?.title?.desktop || gallery?.title || ''),
      expanded: String(gallery?.title?.expanded || gallery?.title || '')
    },
    description: {
      mobile: String(gallery?.description?.mobile || gallery?.description || ''),
      desktop: String(gallery?.description?.desktop || gallery?.description || ''),
      expanded: String(gallery?.description?.expanded || gallery?.description || '')
    },
    tiles: tiles.map((tile, index) => normalizeTile(tile, `${key}__${index + 1}`))
  };
}

function normalizeContent(payload) {
  const galleries = Array.isArray(payload?.galleries) ? payload.galleries : [];

  return {
    version: CONTENT_SCHEMA_VERSION,
    updatedAt: payload?.updatedAt || null,
    assets: {
      logoPath: String(payload?.assets?.logoPath || defaultContent.assets.logoPath),
      faviconPath: String(payload?.assets?.faviconPath || defaultContent.assets.faviconPath),
      heroImagePath: String(payload?.assets?.heroImagePath || defaultContent.assets.heroImagePath)
    },
    galleries: galleries.length
      ? galleries.map((gallery, index) => normalizeGallery(gallery, `gallery-${index + 1}`))
      : defaultContent.galleries.map((gallery) => normalizeGallery(gallery, gallery.key))
  };
}

function migrateLegacyPayload(raw) {
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  if (Array.isArray(parsed.galleries)) {
    return parsed;
  }

  if (Array.isArray(parsed.projects) || Array.isArray(parsed.tiles)) {
    return {
      version: CONTENT_SCHEMA_VERSION,
      galleries: [
        {
          ...defaultContent.galleries[0],
          tiles: Array.isArray(parsed.tiles) ? parsed.tiles : defaultContent.galleries[0].tiles
        }
      ]
    };
  }

  return null;
}

export function loadContent() {
  try {
    const currentRaw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    const currentParsed = safeParse(currentRaw || '');

    if (currentParsed && typeof currentParsed === 'object') {
      return normalizeContent(currentParsed);
    }

    const fallbackKeys = ['CRMO_CONTENT_MANAGEMENT', 'CRMO_DATA'];
    for (const key of fallbackKeys) {
      const migrated = migrateLegacyPayload(window.localStorage.getItem(key) || '');
      if (migrated) {
        return normalizeContent(migrated);
      }
    }
  } catch (_error) {
    // fall through to defaults
  }

  return normalizeContent(defaultContent);
}

export function saveContent(payload) {
  const normalized = normalizeContent({
    ...payload,
    updatedAt: new Date().toISOString()
  });

  window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function exportContent(payload) {
  return JSON.stringify(normalizeContent(payload), null, 2);
}

export function importContent(rawText) {
  const parsed = safeParse(rawText);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('קובץ הניהול אינו JSON תקין.');
  }

  return saveContent(parsed);
}
