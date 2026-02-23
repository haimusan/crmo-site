import ProjectTile from './ProjectTile'

export default function ProjectGallery({ projects, onEdit }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-36">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectTile key={project.id} project={project} onEdit={onEdit} />
        ))}
      </div>
    </section>
  )
}
