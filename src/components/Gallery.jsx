import React from 'react';

function pickByViewport(value, isExpanded) {
  if (!value) return '';
  if (isExpanded) return value.expanded || value.desktop || value.mobile || '';

  if (typeof window !== 'undefined') {
    const width = window.innerWidth || 0;
    if (width <= 640) return value.mobile || value.desktop || '';
  }

  return value.desktop || value.mobile || '';
}

export default function Gallery({ gallery, isExpandedView, isAdminMode }) {
  const title = pickByViewport(gallery.title, isExpandedView);
  const description = pickByViewport(gallery.description, isExpandedView);

  return (
    <section className="gallery" id={gallery.key} data-gallery-key={gallery.key}>
      <header className="gallery-header">
        <h2>{title || gallery.key}</h2>
        <p>{description}</p>
      </header>

      <div className={`gallery-grid ${isExpandedView ? 'is-expanded-grid' : ''}`}>
        {gallery.tiles.map((tile, index) => (
          <article
            key={tile.id}
            className="tile"
            data-project-id={tile.projectId}
            data-project-name={tile.title}
            data-slot={index + 1}
          >
            <img src={tile.images?.[0] || ''} alt={tile.title} loading="lazy" />
            <div className="tile-content">
              <p className="client">{tile.client}</p>
              <h3>{tile.title}</h3>
              <p>{tile.desc}</p>
              {tile.images?.length > 1 ? (
                <small className="tile-extra-images">+{tile.images.length - 1} תמונות נוספות</small>
              ) : null}
              <a href={tile.href || '#'}>לפרויקט</a>
              {isAdminMode ? <code className="tile-code">{tile.id}</code> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
