function getTextByViewport(project) {
  if (window.matchMedia('(min-width: 1024px)').matches) {
    return project.descriptionDesktop || project.caption
  }
  if (window.matchMedia('(max-width: 640px)').matches) {
    return project.descriptionMobile || project.caption
  }
  return project.descriptionExtended || project.caption
}

export default function ProjectTile({ project, onEdit }) {
  const description = getTextByViewport(project)

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-tile">
      <div className="relative aspect-[16/9] bg-black/5">
        {project.image ? (
          <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-black/40">No image</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-bold">{project.title}</h3>
        <p className="line-clamp-3 text-sm text-black/70">{description}</p>
        <button onClick={() => onEdit(project)} className="text-xs font-semibold uppercase tracking-wide text-black/70 hover:text-black">
          Edit
        </button>
      </div>
    </article>
  )
}
