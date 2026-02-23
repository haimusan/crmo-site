import { useEffect, useMemo, useState } from 'react'
import seedData from '../data/seedData.json'
import { supabase } from '../lib/supabase'

const TABLE_NAME = 'crmo_projects'

function normalizeProjects(rawProjects = []) {
  return rawProjects.map((project) => {
    const thumb = project.assets?.[0]
    return {
      ...project,
      category: project.galleries?.[0]?.galleryId ?? 'intro',
      image: thumb?.file ?? '',
      caption: thumb?.caption ?? project.shortDescription ?? '',
      descriptionMobile: thumb?.caption ?? project.shortDescription ?? '',
      descriptionDesktop: thumb?.caption ?? project.shortDescription ?? '',
      descriptionExtended: project.shortDescription ?? thumb?.caption ?? '',
    }
  })
}

export function useProjects() {
  const [projects, setProjects] = useState(() => normalizeProjects(seedData.projects))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchProjects() {
      const { data, error } = await supabase.from(TABLE_NAME).select('*').order('created_at')
      if (!active) return

      if (!error && Array.isArray(data) && data.length > 0) {
        setProjects(normalizeProjects(data))
      }

      setLoading(false)
    }

    fetchProjects()

    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(() => {
    const seedCategories = seedData.galleries.map((gallery) => gallery.slug)
    const projectCategories = projects.map((project) => project.category)
    return Array.from(new Set([...seedCategories, ...projectCategories]))
  }, [projects])

  const upsertProject = async (draft) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(draft, { onConflict: 'id' })
      .select('*')
      .single()

    if (error) {
      throw error
    }

    const normalized = normalizeProjects([data])[0]
    setProjects((prev) => {
      const exists = prev.some((project) => project.id === normalized.id)
      if (exists) {
        return prev.map((project) => (project.id === normalized.id ? normalized : project))
      }
      return [normalized, ...prev]
    })

    return normalized
  }

  return {
    projects,
    categories,
    loading,
    upsertProject,
  }
}
