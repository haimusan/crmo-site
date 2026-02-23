import { useEffect, useMemo, useState } from 'react'
import AdminBar from './components/AdminBar'
import EditModal from './components/EditModal'
import Header from './components/Header'
import Hero from './components/Hero'
import ProjectGallery from './components/ProjectGallery'
import { useProjects } from './hooks/useProjects'

export default function App() {
  const { projects, categories, loading, upsertProject } = useProjects()
  const [activeTab, setActiveTab] = useState('all')
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const deepLinkedProjectId = params.get('project')

    if (!deepLinkedProjectId) return

    const linkedProject = projects.find((project) => project.id === deepLinkedProjectId)
    if (linkedProject) {
      setActiveTab(linkedProject.category || 'all')
      setEditingProject(linkedProject)
    }
  }, [projects])

  const tabs = useMemo(() => ['all', ...categories], [categories])

  const visibleProjects = useMemo(() => {
    if (activeTab === 'all') return projects
    return projects.filter((project) => project.category === activeTab)
  }, [activeTab, projects])

  const handleEdit = (project) => {
    const params = new URLSearchParams(window.location.search)
    params.set('project', project.id)
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
    setEditingProject(project)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    const params = new URLSearchParams(window.location.search)
    params.delete('project')
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] pb-28">
      <Header tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      <Hero />
      {loading ? (
        <div className="mx-auto max-w-6xl px-4 text-sm text-black/50">Loading projects…</div>
      ) : (
        <ProjectGallery projects={visibleProjects} onEdit={handleEdit} />
      )}

      <AdminBar />
      <EditModal project={editingProject} onClose={() => setEditingProject(null)} onSave={upsertProject} />
    </main>
  )
}
