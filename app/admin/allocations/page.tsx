"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { RefreshCw, Download, Home } from "lucide-react"
import Link from "next/link"

interface TeamAllocation {
  team_name: string
  allocations: Record<string, number>
  sector: string
  choice: string
}

export default function AllocationsView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [allocations, setAllocations] = useState<TeamAllocation[]>([])
  const [channels, setChannels] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadAllocations()
      loadChannels()
      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        loadAllocations()
        loadChannels()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "ADRen@2026!Sec") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password")
    }
  }

  const loadChannels = async () => {
    try {
      const { data } = await supabase.from("channels").select("name")
      const channelNames = (data || []).map((c) => c.name).sort()
      setChannels(channelNames)
    } catch (err) {
      console.error("Error loading channels:", err)
    }
  }

  const loadAllocations = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("team_sessions")
        .select("team_name, round3_allocations, round3_sector, round3_choice")
        .not("round3_allocations", "is", null)
        .order("team_name", { ascending: true })

      const allocs: TeamAllocation[] = (data || []).map((item: any) => ({
        team_name: item.team_name,
        allocations: item.round3_allocations || {},
        sector: item.round3_sector || "N/A",
        choice: item.round3_choice || "N/A",
      }))

      setAllocations(allocs)
    } catch (err) {
      console.error("Error loading allocations:", err)
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    const headers = ["Team Name", "Choice", "Sector", ...channels]
    const rows = allocations.map((a) => [
      a.team_name,
      a.choice,
      a.sector,
      ...channels.map((ch) => a.allocations[ch] || 0),
    ])

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    )

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `terra_coins_allocations_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Terra Coins Allocations
          </h1>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Terra Coins Allocations
            </h1>
            <p className="text-slate-300">
              View how teams allocated their coins across channels
            </p>
          </div>
          <Link href="/admin">
            <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition">
              <Home className="w-5 h-5" />
              Back
            </button>
          </Link>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              loadAllocations()
              loadChannels()
            }}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {allocations.length > 0 && (
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <p className="text-2xl font-bold text-gray-900">
            {allocations.length}{" "}
            <span className="text-lg text-gray-600">
              teams have allocated coins
            </span>
          </p>
        </div>

        {/* Allocations Table */}
        {allocations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No allocations yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Choice
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Sector
                    </th>
                    {channels.map((channel) => (
                      <th
                        key={channel}
                        className="px-6 py-3 text-center text-sm font-semibold text-gray-900 min-w-max"
                      >
                        {channel}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((alloc, idx) => {
                    const total = Object.values(alloc.allocations).reduce(
                      (a, b) => a + b,
                      0,
                    )
                    return (
                      <tr
                        key={alloc.team_name}
                        className={idx % 2 === 0 ? "bg-gray-50" : ""}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {alloc.team_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                            {alloc.choice}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {alloc.sector}
                        </td>
                        {channels.map((channel) => (
                          <td
                            key={channel}
                            className="px-6 py-4 text-sm text-center text-gray-700"
                          >
                            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
                              {alloc.allocations[channel] || 0}
                            </span>
                          </td>
                        ))}
                        <td
                          className={`px-6 py-4 text-sm font-bold text-center ${total === 100 ? "text-green-600" : "text-red-600"}`}
                        >
                          {total}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
