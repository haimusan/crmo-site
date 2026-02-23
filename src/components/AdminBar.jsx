import { useAdmin } from '../contexts/AdminContext'

export default function AdminBar() {
  const { forceAdminMode, toggleForceAdminMode } = useAdmin()

  return (
    <aside className="fixed bottom-4 left-1/2 z-40 w-[min(95vw,700px)] -translate-x-1/2 rounded-2xl border border-black/15 bg-white/95 px-4 py-3 shadow-tile backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Admin Bar (Alex Shekel approach)</p>
          <p className="text-xs text-black/60">Persistent force-mode for frictionless editing</p>
        </div>
        <button
          onClick={toggleForceAdminMode}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
            forceAdminMode ? 'bg-black text-white' : 'bg-black/10 text-black'
          }`}
        >
          {forceAdminMode ? 'Force Admin: ON' : 'Force Admin: OFF'}
        </button>
      </div>
    </aside>
  )
}
