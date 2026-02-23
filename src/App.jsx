import React, { useMemo, useState } from 'react';
import Gallery from './components/Gallery';
import AdminBar from './components/AdminBar';
import { exportContent, importContent, loadContent, saveContent } from './lib/contentStore';

function getPathGallerySlug() {
  const path = (window.location.pathname || '/').replace(/\/+$/, '');
  const segments = path.split('/').filter(Boolean);

  if (!segments.length) {
    return '';
  }

  if (segments.length >= 2 && segments[0] === 'crmo-site') {
    return segments[1] || '';
  }

  return segments[0] || '';
}

function moveItem(items, from, to) {
  const list = [...items];
  const [removed] = list.splice(from, 1);
  list.splice(to, 0, removed);
  return list;
}

export default function App() {
  const [mode, setMode] = useState('view');
  const [content, setContent] = useState(() => loadContent());
  const [importText, setImportText] = useState('');
  const [notice, setNotice] = useState('');

  const gallerySlug = getPathGallerySlug();

  const selectedGallery = useMemo(
    () => content.galleries.find((gallery) => gallery.slug === gallerySlug),
    [content.galleries, gallerySlug]
  );

  const isExpandedRoute = Boolean(selectedGallery?.expandPageEnabled && gallerySlug);

  const galleriesToRender = useMemo(() => {
    if (isExpandedRoute && selectedGallery) {
      return [selectedGallery];
    }

    const isMobile = typeof window !== 'undefined' ? (window.innerWidth || 0) <= 640 : false;
    return content.galleries.filter((gallery) => {
      if (!gallery.visible) return false;
      if (isMobile && gallery.hideOnMobile) return false;
      return true;
    });
  }, [content.galleries, isExpandedRoute, selectedGallery]);

  function updateContent(updater) {
    setContent((current) => {
      const next = updater(current);
      const saved = saveContent(next);
      return saved;
    });
  }

  function updateGalleryField(galleryKey, field, value) {
    updateContent((current) => ({
      ...current,
      galleries: current.galleries.map((gallery) =>
        gallery.key === galleryKey ? { ...gallery, [field]: value } : gallery
      )
    }));
  }

  function updateGalleryText(galleryKey, field, viewport, value) {
    updateContent((current) => ({
      ...current,
      galleries: current.galleries.map((gallery) =>
        gallery.key === galleryKey
          ? {
              ...gallery,
              [field]: {
                ...gallery[field],
                [viewport]: value
              }
            }
          : gallery
      )
    }));
  }

  function updateTile(galleryKey, tileIndex, field, value) {
    updateContent((current) => ({
      ...current,
      galleries: current.galleries.map((gallery) => {
        if (gallery.key !== galleryKey) {
          return gallery;
        }

        return {
          ...gallery,
          tiles: gallery.tiles.map((tile, index) => {
            if (index !== tileIndex) {
              return tile;
            }

            if (field === 'images') {
              return {
                ...tile,
                images: String(value)
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean)
              };
            }

            return {
              ...tile,
              [field]: value
            };
          })
        };
      })
    }));
  }

  function moveTile(galleryKey, tileIndex, direction) {
    updateContent((current) => ({
      ...current,
      galleries: current.galleries.map((gallery) => {
        if (gallery.key !== galleryKey) {
          return gallery;
        }

        const targetIndex = tileIndex + direction;
        if (targetIndex < 0 || targetIndex >= gallery.tiles.length) {
          return gallery;
        }

        return {
          ...gallery,
          tiles: moveItem(gallery.tiles, tileIndex, targetIndex)
        };
      })
    }));
  }

  function handleExport() {
    const jsonText = exportContent(content);
    setImportText(jsonText);

    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crmo-content-management.json';
    a.click();
    URL.revokeObjectURL(url);
    setNotice('קובץ ניהול נוצר והורד.');
  }

  function handleImport() {
    try {
      const next = importContent(importText);
      setContent(next);
      setNotice('קובץ ניהול נטען בהצלחה.');
    } catch (error) {
      setNotice(error.message);
    }
  }

  return (
    <main className={mode === 'admin' ? 'is-admin-mode' : ''}>
      <AdminBar
        mode={mode}
        onModeToggle={() => setMode((current) => (current === 'admin' ? 'view' : 'admin'))}
      />

      <header>
        <h1>CRMO — Content Managed React</h1>
        <p>
          הממשק שומר קובץ ניהול תוכן (JSON) עם כל הגלריות, סדר האריחים, טקסטים לפי מובייל/דסקטופ/מורחב,
          דגלי תצוגה ונתיבי נכסים.
        </p>
        {isExpandedRoute && selectedGallery ? (
          <p className="expanded-badge">תצוגת לינק ייעודי: /{selectedGallery.slug}</p>
        ) : null}
      </header>

      {mode === 'admin' ? (
        <section className="management-panel" aria-label="ניהול תוכן">
          <h2>ניהול תוכן</h2>
          <p>כל שינוי נשמר מקומית תחת מפתח ניהול וניתן לייצא/לייבא לגרסאות HTML עתידיות.</p>
          <div className="asset-grid">
            <label>
              לוגו
              <input
                value={content.assets.logoPath}
                onChange={(event) =>
                  updateContent((current) => ({
                    ...current,
                    assets: { ...current.assets, logoPath: event.target.value }
                  }))
                }
              />
            </label>
            <label>
              Favicon
              <input
                value={content.assets.faviconPath}
                onChange={(event) =>
                  updateContent((current) => ({
                    ...current,
                    assets: { ...current.assets, faviconPath: event.target.value }
                  }))
                }
              />
            </label>
            <label>
              Hero Image
              <input
                value={content.assets.heroImagePath}
                onChange={(event) =>
                  updateContent((current) => ({
                    ...current,
                    assets: { ...current.assets, heroImagePath: event.target.value }
                  }))
                }
              />
            </label>
          </div>

          {content.galleries.map((gallery) => (
            <article key={gallery.key} className="editor-gallery">
              <h3>{gallery.key}</h3>
              <div className="toggles">
                <label>
                  <input
                    type="checkbox"
                    checked={gallery.visible}
                    onChange={(event) => updateGalleryField(gallery.key, 'visible', event.target.checked)}
                  />
                  להציג גלריה
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={gallery.hideOnMobile}
                    onChange={(event) =>
                      updateGalleryField(gallery.key, 'hideOnMobile', event.target.checked)
                    }
                  />
                  להסתיר במובייל
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={gallery.expandPageEnabled}
                    onChange={(event) =>
                      updateGalleryField(gallery.key, 'expandPageEnabled', event.target.checked)
                    }
                  />
                  לאפשר לינק מורחב (/slug)
                </label>
              </div>

              <div className="text-grid">
                {['mobile', 'desktop', 'expanded'].map((viewport) => (
                  <div key={viewport}>
                    <strong>{viewport}</strong>
                    <input
                      value={gallery.title[viewport]}
                      onChange={(event) =>
                        updateGalleryText(gallery.key, 'title', viewport, event.target.value)
                      }
                      placeholder="כותרת"
                    />
                    <textarea
                      value={gallery.description[viewport]}
                      onChange={(event) =>
                        updateGalleryText(gallery.key, 'description', viewport, event.target.value)
                      }
                      placeholder="תיאור"
                    />
                  </div>
                ))}
              </div>

              <div className="tile-editor-list">
                {gallery.tiles.map((tile, index) => (
                  <div key={tile.id} className="tile-editor-item">
                    <div className="tile-editor-head">
                      <strong>{tile.id}</strong>
                      <div>
                        <button type="button" onClick={() => moveTile(gallery.key, index, -1)}>
                          ↑
                        </button>
                        <button type="button" onClick={() => moveTile(gallery.key, index, 1)}>
                          ↓
                        </button>
                      </div>
                    </div>

                    <input
                      value={tile.title}
                      onChange={(event) => updateTile(gallery.key, index, 'title', event.target.value)}
                      placeholder="כותרת אריח"
                    />
                    <input
                      value={tile.desc}
                      onChange={(event) => updateTile(gallery.key, index, 'desc', event.target.value)}
                      placeholder="תיאור אריח"
                    />
                    <input
                      value={tile.images.join(', ')}
                      onChange={(event) => updateTile(gallery.key, index, 'images', event.target.value)}
                      placeholder="תמונות מופרדות בפסיק"
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}

          <div className="import-export">
            <button type="button" onClick={handleExport}>
              יצוא קובץ ניהול
            </button>
            <button type="button" onClick={handleImport}>
              יבוא קובץ ניהול
            </button>
            <textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder="הדבק כאן JSON לייבוא"
            />
            {notice ? <p className="notice">{notice}</p> : null}
          </div>
        </section>
      ) : null}

      {isExpandedRoute ? (
        <section className="route-note">תצוגה ייעודית: מוצגות רק כותרת עליונה + גלריה נבחרת + צור קשר.</section>
      ) : null}

      {galleriesToRender.map((gallery) => (
        <Gallery
          key={gallery.key}
          gallery={gallery}
          isExpandedView={isExpandedRoute}
          isAdminMode={mode === 'admin'}
        />
      ))}

      <section className="contact-section" id="contact">
        <h2>צור קשר</h2>
        <p>לשיתוף לינק גלריה מורחבת: https://www.crmo.co.il/{selectedGallery?.slug || 'exhibitions'}</p>
      </section>
    </main>
  );
}
