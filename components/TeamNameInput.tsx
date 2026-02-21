"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface TeamNameInputProps {
  onTeamEnter: (teamName: string) => void
  isLoading?: boolean
}

export function TeamNameInput({
  onTeamEnter,
  isLoading = false,
}: TeamNameInputProps) {
  const [teamName, setTeamName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) {
      setError("Please enter your team name")
      return
    }

    try {
      setError("")
      onTeamEnter(teamName.trim())
    } catch (err) {
      setError("Failed to register team. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">AD-RENALINE</h1>
        <p className="text-center text-gray-600 mb-8">
          Round 1: Team Registration
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  )
}
