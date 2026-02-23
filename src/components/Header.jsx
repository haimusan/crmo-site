export default function Header({ tabs, activeTab, onTabChange }) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f7f5]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold tracking-[0.2em]">CRMO</h1>
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition ${
                tab === activeTab
                  ? 'border-black bg-black text-white'
                  : 'border-black/20 bg-white hover:border-black'
              }`}
            >
              {tab.replaceAll('-', ' ')}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
