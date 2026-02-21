"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Lock, Check } from "lucide-react"

interface Round1Props {
  teamName: string
  onComplete: (
    sectorId: string,
    sectorName: string,
    situation: string,
    constraint: string,
    companyName: string,
  ) => void
}

interface Sector {
  id: string
  name: string
  situation: string
  constraint: string
  password: string
}

export function Round1({ teamName, onComplete }: Round1Props) {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [passwordAttempted, setPasswordAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadSectors()
  }, [])

  const loadSectors = async () => {
    try {
      const { data, error } = await supabase.from("sectors").select("*")
      if (error) throw error
      setSectors(data || [])
    } catch (err) {
      console.error("Error loading sectors:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(sector)
    setPasswordInput("")
    setPasswordError("")
    setPasswordAttempted(false)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordAttempted(true)

    if (passwordInput === selectedSector?.password) {
      setPasswordError("")
    } else {
      setPasswordError("Incorrect password for this sector")
    }
  }

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSector || !companyName.trim()) {
      return
    }

    if (passwordInput !== selectedSector.password) {
      setPasswordError("Incorrect password")
      return
    }

    try {
      setSubmitting(true)
      onComplete(
        selectedSector.id,
        selectedSector.name,
        selectedSector.situation,
        selectedSector.constraint,
        companyName.trim(),
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading sectors...
      </div>
    )
  }

  if (!selectedSector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              AD-RENALINE - Round 1
            </h1>
            <p className="text-blue-100">Welcome, {teamName}!</p>
            <p className="text-blue-100">Select your sector</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => handleSectorClick(sector)}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {sector.name}
                  </h3>
                  <Lock className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
                </div>
                <p className="text-sm text-gray-600">
                  Click to unlock with password
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const passwordCorrect =
    passwordAttempted && passwordInput === selectedSector.password

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <button
            onClick={() => setSelectedSector(null)}
            className="text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Back to sectors
          </button>

          <h2 className="text-2xl font-bold mb-6">
            Sector: {selectedSector.name}
          </h2>

          {!passwordCorrect ? (
            <form onSubmit={handlePasswordSubmit} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Sector Password
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Unlock
                </button>
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm mt-2">{passwordError}</p>
              )}
            </form>
          ) : (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">
                Sector unlocked
              </span>
            </div>
          )}

          {passwordCorrect && (
            <>
              <div className="mb-6 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Situation:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedSector.situation}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Constraint:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedSector.constraint}
                  </p>
                </div>
              </div>

              <form onSubmit={handleComplete} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name (to be filled by your team)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!companyName.trim() || submitting}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Done"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
