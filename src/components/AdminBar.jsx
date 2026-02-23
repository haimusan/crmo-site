import React, { useMemo } from 'react';

const ADMIN_EMAIL_KEYS = [
  'crmo:admin:email',
  'crmo:admin:ownerEmail',
  'crmo_admin_email',
  'crmo_owner_email'
];

function pickAdminEmail(storage) {
  for (const key of ADMIN_EMAIL_KEYS) {
    const value = storage.getItem(key);
    if (value && String(value).trim()) {
      return String(value).trim().toLowerCase();
    }
  }

  return '';
}

export default function AdminBar({ mode, onModeToggle }) {
  const adminEmail = useMemo(() => {
    try {
      return pickAdminEmail(window.localStorage);
    } catch (_error) {
      return '';
    }
  }, []);

  const isAdmin = Boolean(adminEmail);

  if (!isAdmin) {
    return null;
  }

  return (
    <aside id="crmo-admin-bar" className="admin-bar" aria-label="CRMO admin bar">
      <div className="admin-bar__left">
        <strong>Admin</strong>
        <span className="admin-bar__email">{adminEmail}</span>
      </div>

      <div className="admin-bar__right">
        <button
          type="button"
          className="admin-bar__btn"
          onClick={onModeToggle}
          aria-pressed={mode === 'admin'}
        >
          {mode === 'admin' ? 'צא ממצב ניהול' : 'מצב ניהול'}
        </button>
      </div>
    </aside>
  );
}
