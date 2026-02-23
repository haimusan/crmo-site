import { createContext, useContext, useMemo, useState } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [forceAdminMode, setForceAdminMode] = useState(() => {
    return localStorage.getItem('crmo_force_admin') === '1'
  })

  const toggleForceAdminMode = () => {
    setForceAdminMode((prev) => {
      const next = !prev
      localStorage.setItem('crmo_force_admin', next ? '1' : '0')
      return next
    })
  }

  const value = useMemo(
    () => ({ forceAdminMode, toggleForceAdminMode }),
    [forceAdminMode],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)

  if (!context) {
    throw new Error('useAdmin must be used inside AdminProvider')
  }

  return context
}
