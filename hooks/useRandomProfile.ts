"use client"

import { useState, useCallback } from "react"
import type { Project } from "@/lib/data"

interface UseRandomProfileReturn {
  profile: Project | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRandomProfile(): UseRandomProfileReturn {
  const [profile, setProfile] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/random-profile")

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No profiles found")
        }
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching random profile:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { profile, isLoading, error, refetch }
}
