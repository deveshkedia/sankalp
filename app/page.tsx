"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { TeamNameInput } from "@/components/TeamNameInput"
import { Round1 } from "@/components/Round1"
import { Round2 } from "@/components/Round2"
import { Round3 } from "@/components/Round3"
import { Lock } from "lucide-react"

type AppState =
  | "teamName"
  | "round1Password"
  | "round1"
  | "round2Password"
  | "round2"
  | "round3Password"
  | "round3"
  | "complete"

// Round Password Screen Component
interface RoundPasswordScreenProps {
  round: 1 | 2 | 3
  teamName: string
  onPasswordCorrect: () => void
}

function RoundPasswordScreen({
  round,
  teamName,
  onPasswordCorrect,
}: RoundPasswordScreenProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const roundPasswords: Record<1 | 2 | 3, string> = {
    1: "^&9W9Aq$V4",
    2: "Lt5TcJi^@h",
    3: "NcM7dCZG##",
  }

  const correctPassword = roundPasswords[round]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password === correctPassword) {
      setSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      onPasswordCorrect()
    } else {
      setError("Incorrect password. Please try again.")
      setPassword("")
    }
  }

  const colors: Record<1 | 2 | 3, string> = {
    1: "from-blue-600 to-purple-600",
    2: "from-green-600 to-emerald-600",
    3: "from-orange-600 to-red-600",
  }

  const titleColors: Record<1 | 2 | 3, string> = {
    1: "text-blue-600",
    2: "text-green-600",
    3: "text-orange-600",
  }

  const buttonColors: Record<1 | 2 | 3, string> = {
    1: "bg-blue-600 hover:bg-blue-700",
    2: "bg-green-600 hover:bg-green-700",
    3: "bg-orange-600 hover:bg-orange-700",
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${colors[round]} p-4 flex items-center justify-center`}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Lock className={`w-12 h-12 ${titleColors[round]} mx-auto mb-4`} />
          <h1 className={`text-3xl font-bold mb-2 ${titleColors[round]}`}>
            Round {round}
          </h1>
          <p className="text-gray-600">Enter the password to proceed</p>
          <p className="text-gray-500 text-sm mt-2">Team: {teamName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Round {round} Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={submitting}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2 rounded-lg font-medium text-white transition ${buttonColors[round]} disabled:opacity-50`}
          >
            {submitting ? "Verifying..." : "Unlock Round"}
          </button>
        </form>
      </div>
    </div>
  )
}

interface TeamSession {
  team_name: string
  current_round: number
  round1_sector?: string
  round1_company?: string
  round2_image_link?: string
  round3_allocations?: Record<string, number>
  round3_sector?: string
  round3_choice?: string
}

export default function Home() {
  const [state, setState] = useState<AppState>("teamName")
  const [teamName, setTeamName] = useState("")
  const [teamSession, setTeamSession] = useState<TeamSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there's a saved session from localStorage
    const savedTeamName = localStorage.getItem("sanklap_team_name")
    const savedCurrentRound = localStorage.getItem("sanklap_current_round")

    if (savedTeamName) {
      setTeamName(savedTeamName)
      loadTeamSession(savedTeamName)
    } else {
      setLoading(false)
    }
  }, [])

  const loadTeamSession = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from("team_sessions")
        .select("*")
        .eq("team_name", name)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error loading session:", error)
      }

      if (data) {
        setTeamSession(data)
        const roundMap: Record<number, AppState> = {
          1: "round1Password",
          2: "round2Password",
          3: "round3Password",
          4: "complete",
        }
        setState(roundMap[data.current_round] || "teamName")
      } else {
        setState("round1Password")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTeamEnter = async (name: string) => {
    setTeamName(name)
    localStorage.setItem("sanklap_team_name", name)

    // Create or get team session
    const { data, error } = await supabase
      .from("team_sessions")
      .select("*")
      .eq("team_name", name)
      .single()

    if (!data) {
      // Create new session
      await supabase.from("team_sessions").insert({
        team_name: name,
        current_round: 1,
      })
    } else {
      setTeamSession(data)
    }

    setState("round1Password")
  }

  const handleRound1Complete = async (
    sectorId: string,
    sectorName: string,
    situation: string,
    constraint: string,
    companyName: string,
  ) => {
    try {
      // Save submission
      await supabase.from("submissions").insert({
        team_name: teamName,
        round: 1,
        data: {
          sector: sectorName,
          situation,
          constraint,
          company_name: companyName,
        },
      })

      // Update session
      await supabase
        .from("team_sessions")
        .update({
          current_round: 2,
          round1_sector: sectorId,
          round1_company: companyName,
          updated_at: new Date().toISOString(),
        })
        .eq("team_name", teamName)

      setState("round2Password")
    } catch (err) {
      console.error("Error completing round 1:", err)
      alert("Error saving submission. Please try again.")
    }
  }

  const handleRound2Complete = async (imageLink: string) => {
    try {
      // Save submission
      await supabase.from("submissions").insert({
        team_name: teamName,
        round: 2,
        data: { image_link: imageLink },
      })

      // Update session
      await supabase
        .from("team_sessions")
        .update({
          current_round: 3,
          round2_image_link: imageLink,
          updated_at: new Date().toISOString(),
        })
        .eq("team_name", teamName)

      setState("round3Password")
    } catch (err) {
      console.error("Error completing round 2:", err)
      alert("Error saving submission. Please try again.")
    }
  }

  const handleRound3Complete = async (sectorId: string, choice: string) => {
    try {
      // Get allocations from the current state
      const { data: allocData } = await supabase
        .from("team_sessions")
        .select("round3_allocations")
        .eq("team_name", teamName)
        .single()

      // Save submission
      await supabase.from("submissions").insert({
        team_name: teamName,
        round: 3,
        data: {
          allocations: allocData?.round3_allocations || {},
          sector: sectorId,
          choice: choice,
        },
      })

      // Update session
      await supabase
        .from("team_sessions")
        .update({
          current_round: 4,
          round3_sector: sectorId,
          round3_choice: choice,
          updated_at: new Date().toISOString(),
        })
        .eq("team_name", teamName)

      setState("complete")
    } catch (err) {
      console.error("Error completing round 3:", err)
      alert("Error saving submission. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {state === "teamName" && <TeamNameInput onTeamEnter={handleTeamEnter} />}
      {state === "round1Password" && (
        <RoundPasswordScreen
          round={1}
          teamName={teamName}
          onPasswordCorrect={() => setState("round1")}
        />
      )}
      {state === "round1" && (
        <Round1 teamName={teamName} onComplete={handleRound1Complete} />
      )}
      {state === "round2Password" && (
        <RoundPasswordScreen
          round={2}
          teamName={teamName}
          onPasswordCorrect={() => setState("round2")}
        />
      )}
      {state === "round2" && (
        <Round2 teamName={teamName} onComplete={handleRound2Complete} />
      )}
      {state === "round3Password" && (
        <RoundPasswordScreen
          round={3}
          teamName={teamName}
          onPasswordCorrect={() => setState("round3")}
        />
      )}
      {state === "round3" && (
        <Round3
          teamName={teamName}
          initialSectorId={teamSession?.round1_sector || undefined}
          onComplete={handleRound3Complete}
        />
      )}
      {state === "complete" && (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-purple-600 mb-4">
              Thank You!
            </h1>
            <p className="text-gray-700 mb-6">
              Thank you for participating in Adrenaline event, {teamName}!
            </p>
            <p className="text-gray-600">
              Your submissions have been recorded. We will be in touch soon with
              the results.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
