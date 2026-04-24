import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'foundations2-completed'

export function useCompletion() {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]))
  }, [completed])

  const toggle = useCallback((id: string) => {
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const isCompleted = useCallback((id: string) => completed.has(id), [completed])

  return { completed, toggle, isCompleted }
}
