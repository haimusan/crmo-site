import { useMemo, useState } from 'react';

const DEFAULT_ADMIN_EMAILS = ['boochin@gmail.com', 'boochin@walla.co.il'];

function isAdminEmail(email, adminEmails = DEFAULT_ADMIN_EMAILS) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return false;

  return adminEmails.map((item) => String(item || '').trim().toLowerCase()).includes(normalizedEmail);
}

export function ProjectTile({ title, isAdmin }) {
  return (
    <div className="project-tile" style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>{title}</strong>

        {/* Pencil icon depends only on isAdmin */}
        {isAdmin ? (
          <button type="button" aria-label="Edit project" title="Edit" style={{ cursor: 'pointer' }}>
            ✏️
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminControl({ currentUserEmail = '' }) {
  const emailLooksAdmin = useMemo(() => isAdminEmail(currentUserEmail), [currentUserEmail]);
  const [isAdmin, setIsAdmin] = useState(emailLooksAdmin);

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" onClick={() => setIsAdmin(true)}>
          Force Admin
        </button>

        <span>Editing mode: {isAdmin ? 'ON' : 'OFF'}</span>
      </div>

      <ProjectTile title="Demo Project" isAdmin={isAdmin} />
    </section>
  );
}

export { isAdminEmail, DEFAULT_ADMIN_EMAILS };
