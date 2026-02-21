"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { RefreshCw, Download } from "lucide-react"

interface Submission {
  id: string
  team_name: string
  round: number
  data: Record<string, any>
  created_at: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [round, setRound] = useState<1 | 2 | 3>(1)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [teamStats, setTeamStats] = useState({
    total: 0,
    round1: 0,
    round2: 0,
    round3: 0,
    completed: 0,
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions()
      loadTeamStats()
      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        loadSubmissions()
        loadTeamStats()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, round])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password")
    }
  }

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("submissions")
        .select("*")
        .eq("round", round)
        .order("created_at", { ascending: false })

      setSubmissions(data || [])
    } catch (err) {
      console.error("Error loading submissions:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadTeamStats = async () => {
    try {
      const { data } = await supabase.from("team_sessions").select("*")

      if (data) {
        const stats = {
          total: data.length,
          round1: data.filter((t) => t.current_round >= 1).length,
          round2: data.filter((t) => t.current_round >= 2).length,
          round3: data.filter((t) => t.current_round >= 3).length,
          completed: data.filter((t) => t.current_round >= 4).length,
        }
        setTeamStats(stats)
      }
    } catch (err) {
      console.error("Error loading stats:", err)
    }
  }

  const downloadCSV = () => {
    const headers = ["Team Name", ...Object.keys(submissions[0]?.data || {})]
    const rows = submissions.map((s) => [s.team_name, ...Object.values(s.data)])

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === "object" ? JSON.stringify(cell) : cell,
          )
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `round${round}_submissions_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Admin Dashboard
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
              <p className="text-xs text-gray-500 mt-2">
                Demo password: admin123
              </p>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-300">Live event submissions tracking</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Total Teams</p>
            <p className="text-3xl font-bold">{teamStats.total}</p>
          </div>
          <div className="bg-green-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Round 1</p>
            <p className="text-3xl font-bold">{teamStats.round1}</p>
          </div>
          <div className="bg-amber-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Round 2</p>
            <p className="text-3xl font-bold">{teamStats.round2}</p>
          </div>
          <div className="bg-orange-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Round 3</p>
            <p className="text-3xl font-bold">{teamStats.round3}</p>
          </div>
          <div className="bg-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Completed</p>
            <p className="text-3xl font-bold">{teamStats.completed}</p>
          </div>
        </div>

        {/* Round Selector */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((r) => (
            <button
              key={r}
              onClick={() => setRound(r as 1 | 2 | 3)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                round === r
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              }`}
            >
              Round {r}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              loadSubmissions()
              loadTeamStats()
            }}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {submissions.length > 0 && (
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          )}
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No submissions yet for Round {round}
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission, idx) => (
                    <tr
                      key={submission.id}
                      className={idx % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {submission.team_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="max-w-md break-words">
                          {round === 1 && (
                            <>
                              <p>
                                <strong>Sector:</strong>{" "}
                                {submission.data.sector}
                              </p>
                              <p>
                                <strong>Company:</strong>{" "}
                                {submission.data.company_name}
                              </p>
                            </>
                          )}
                          {round === 2 && (
                            <a
                              href={submission.data.image_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Link →
                            </a>
                          )}
                          {round === 3 && (
                            <>
                              <p>
                                <strong>Choice:</strong>{" "}
                                {submission.data.choice}
                              </p>
                              <details className="mt-2">
                                <summary className="cursor-pointer text-blue-600">
                                  Allocations
                                </summary>
                                <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                                  {Object.entries(
                                    submission.data.allocations || {},
                                  ).map(([channel, amount]) => (
                                    <div key={channel}>
                                      {channel}: {amount}
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(submission.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
