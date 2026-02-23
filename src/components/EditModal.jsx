import { useEffect, useState } from 'react'

export default function EditModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project)

  useEffect(() => {
    setForm(project)
  }, [project])

  if (!project) return null

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    await onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <form onSubmit={submit} className="w-full max-w-xl space-y-3 rounded-2xl bg-white p-5">
        <h4 className="text-lg font-bold">Edit project</h4>
        <input value={form.title || ''} onChange={(e) => updateField('title', e.target.value)} placeholder="Title" className="w-full rounded-xl border px-3 py-2" />
        <textarea
          value={form.descriptionDesktop || ''}
          onChange={(e) => updateField('descriptionDesktop', e.target.value)}
          placeholder="Desktop description"
          className="h-24 w-full rounded-xl border px-3 py-2"
        />
        <textarea
          value={form.descriptionMobile || ''}
          onChange={(e) => updateField('descriptionMobile', e.target.value)}
          placeholder="Mobile description"
          className="h-24 w-full rounded-xl border px-3 py-2"
        />
        <textarea
          value={form.descriptionExtended || ''}
          onChange={(e) => updateField('descriptionExtended', e.target.value)}
          placeholder="Extended description"
          className="h-24 w-full rounded-xl border px-3 py-2"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2">
            Cancel
          </button>
          <button type="submit" className="rounded-xl bg-black px-4 py-2 text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
