"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { TeamNameInput } from "@/components/TeamNameInput"
import { Round1 } from "@/components/Round1"
import { Round2 } from "@/components/Round2"
import { Round3 } from "@/components/Round3"

type AppState = "teamName" | "round1" | "round2" | "round3" | "complete"

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
          1: "round1",
          2: "round2",
          3: "round3",
          4: "complete",
        }
        setState(roundMap[data.current_round] || "teamName")
      } else {
        setState("round1")
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

    setState("round1")
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

      setState("round2")
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

      setState("round3")
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
      {state === "round1" && (
        <Round1 teamName={teamName} onComplete={handleRound1Complete} />
      )}
      {state === "round2" && (
        <Round2 teamName={teamName} onComplete={handleRound2Complete} />
      )}
      {state === "round3" && (
        <Round3 teamName={teamName} onComplete={handleRound3Complete} />
      )}
      {state === "complete" && (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">All Done!</h1>
            <p className="text-gray-700 mb-6">
              Thank you for participating in Sanklap Event, {teamName}!
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
