"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Check } from "lucide-react"
import { MarketEventCards } from "./MarketEventCards"

interface Round3Props {
  teamName: string
  onComplete: (sectorId: string, choice: string) => void
  initialSectorId?: string
}

interface Channel {
  id: string
  name: string
}

interface Sector {
  id: string
  name: string
  situation: string
  constraint: string
  password: string
  password_round3?: string
}

type Round3Stage =
  | "allocation"
  | "sector"
  | "choice"
  | "marketEvent"
  | "complete"

export function Round3({ teamName, onComplete, initialSectorId }: Round3Props) {
  const [stage, setStage] = useState<Round3Stage>("allocation")
  const [channels, setChannels] = useState<Channel[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [allocations, setAllocations] = useState<Record<string, number>>({})
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordAttempted, setPasswordAttempted] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  // if we have an initialSectorId (from round1) and the sectors have been loaded,
  // pre-select it so user doesn't need to click again.
  useEffect(() => {
    if (initialSectorId && sectors.length > 0) {
      const found = sectors.find((s) => s.id === initialSectorId)
      if (found) {
        setSelectedSector(found)
      }
    }
  }, [initialSectorId, sectors])

  const loadData = async () => {
    try {
      const [{ data: channelsData }, { data: sectorsData }] = await Promise.all(
        [
          supabase.from("channels").select("*"),
          supabase
            .from("sectors")
            .select("id,name,situation,constraint,password,password_round3"),
        ],
      )

      setChannels(channelsData || [])
      setSectors(sectorsData || [])

      // Initialize allocations
      const initialAllocations: Record<string, number> = {}
      ;(channelsData || []).forEach((channel) => {
        initialAllocations[channel.id] = 0
      })
      setAllocations(initialAllocations)
    } catch (err) {
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const totalAllocated = Object.values(allocations).reduce((a, b) => a + b, 0)
  const canProceed = totalAllocated === 100

  const handleAllocationChange = async (channelId: string, value: number) => {
    const newAllocations = { ...allocations, [channelId]: Math.max(0, value) }
    const total = Object.values(newAllocations).reduce((a, b) => a + b, 0)
    if (total <= 100) {
      setAllocations(newAllocations)
      // Save allocations to database as user enters them
      try {
        await supabase
          .from("team_sessions")
          .update({ round3_allocations: newAllocations })
          .eq("team_name", teamName)
      } catch (err) {
        console.error("Error saving allocations:", err)
      }
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordAttempted(true)
  }

  const passwordCorrect =
    passwordAttempted &&
    passwordInput ===
      (selectedSector?.password_round3 || selectedSector?.password)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  // Stage 1: Allocation
  if (stage === "allocation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 to-red-600 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-2 text-green-600">
              AD-RENALINE - Round 3
            </h1>
            <p className="text-lg text-green-500 font-semibold mb-8">
              Final Decision Challenge
            </p>
            <p className="text-gray-600 mb-4">
              Team: <span className="font-semibold">{teamName}</span>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900 font-semibold">
                You have 100 Terra Coins to allocate across {channels.length}{" "}
                channels
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {channels.map((channel) => (
                <div key={channel.id}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium text-gray-900">
                      {channel.name}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={allocations[channel.id]}
                        onChange={(e) =>
                          handleAllocationChange(
                            channel.id,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <span className="text-gray-600 font-semibold">coins</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(allocations[channel.id] / 100) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Total Allocated:
                </span>
                <span
                  className={`text-2xl font-bold ${canProceed ? "text-green-600" : "text-orange-600"}`}
                >
                  {totalAllocated}/100
                </span>
              </div>
            </div>

            <button
              onClick={() => setStage("sector")}
              disabled={!canProceed || submitting}
              className={`w-full py-3 rounded-lg font-medium transition ${
                canProceed
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {submitting ? "Processing..." : "Next: Select Sector"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Stage 2: Sector Selection
  if (stage === "sector" && !selectedSector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 to-red-600 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Select Your Sector
            </h1>
            <p className="text-orange-100">Team: {teamName}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector)}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {sector.name}
                </h3>
                <p className="text-sm text-gray-600">Click to unlock</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Stage 3: Sector Password & Choice
  if (stage === "sector" && selectedSector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 to-red-600 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <button
              onClick={() => setSelectedSector(null)}
              className="text-orange-600 hover:text-orange-800 mb-6"
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
                    placeholder="Enter round‑3 password"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
                  >
                    Unlock
                  </button>
                </div>
                {passwordAttempted &&
                  passwordInput !== selectedSector.password && (
                    <p className="text-red-600 text-sm mt-2">
                      Incorrect password
                    </p>
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
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Situation:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedSector.situation}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Constraint:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedSector.constraint}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">
                    Select Your Choice:
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["A", "B", "C"].map((choice) => (
                      <button
                        key={choice}
                        onClick={() => {
                          setSelectedChoice(choice)
                          setStage("choice")
                        }}
                        className={`py-4 px-6 rounded-lg font-bold text-xl transition ${
                          selectedChoice === choice
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Stage 4: Confirmation
  if (stage === "choice") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 to-red-600 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Confirm Your Choice
            </h2>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-gray-600 text-sm mb-1">Your Choice:</p>
            <p className="text-4xl font-bold text-orange-600">
              {selectedChoice}
            </p>
          </div>

          <p className="text-gray-700 mb-8">
            Once you submit, you cannot change your choice. This decision is
            final.
          </p>

          <button
            onClick={async () => {
              setSubmitting(true)
              try {
                // Show market events before completing
                setStage("marketEvent")
              } finally {
                setSubmitting(false)
              }
            }}
            disabled={submitting}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit & View Market Events"}
          </button>

          <button
            onClick={() => setStage("sector")}
            disabled={submitting}
            className="w-full mt-3 bg-gray-200 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-300 transition disabled:opacity-50"
          >
            Change Choice
          </button>
        </div>
      </div>
    )
  }

  // Stage 5: Market Events
  if (stage === "marketEvent" && selectedChoice) {
    return (
      <MarketEventCards
        choice={selectedChoice}
        onContinue={async () => {
          setSubmitting(true)
          try {
            await onComplete(selectedSector!.id, selectedChoice!)
          } finally {
            setSubmitting(false)
          }
        }}
      />
    )
  }

  return null
}
