"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Trash2, Plus } from "lucide-react"

export default function AdminSetup() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [sections, setSections] = useState<"sectors" | "channels">("sectors")

  // Sectors state
  const [sectors, setSectors] = useState<any[]>([])
  const [newSector, setNewSector] = useState({
    name: "",
    situation: "",
    constraint: "",
    password: "",
  })

  // Channels state
  const [channels, setChannels] = useState<any[]>([])
  const [newChannel, setNewChannel] = useState("")

  useEffect(() => {
    // Load existing data if authenticated
    if (isAuthenticated) {
      loadSectors()
      loadChannels()
    }
  }, [isAuthenticated])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - in production use proper auth
    if (password === "ADRen@2026!Sec") {
      setIsAuthenticated(true)
      setAdminPassword("ADRen@2026!Sec")
    } else {
      alert("Incorrect password")
    }
  }

  const loadSectors = async () => {
    try {
      const { data } = await supabase.from("sectors").select("*")
      setSectors(data || [])
    } catch (err) {
      console.error("Error loading sectors:", err)
    }
  }

  const loadChannels = async () => {
    try {
      const { data } = await supabase.from("channels").select("*")
      setChannels(data || [])
    } catch (err) {
      console.error("Error loading channels:", err)
    }
  }

  const handleAddSector = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !newSector.name ||
      !newSector.situation ||
      !newSector.constraint ||
      !newSector.password
    ) {
      alert("Please fill all fields")
      return
    }

    try {
      await supabase.from("sectors").insert([newSector])
      loadSectors()
      setNewSector({ name: "", situation: "", constraint: "", password: "" })
      alert("Sector added successfully!")
    } catch (err) {
      console.error("Error adding sector:", err)
      alert("Error adding sector")
    }
  }

  const handleDeleteSector = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await supabase.from("sectors").delete().eq("id", id)
      loadSectors()
    } catch (err) {
      console.error("Error deleting sector:", err)
    }
  }

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannel.trim()) {
      alert("Please enter channel name")
      return
    }

    try {
      await supabase.from("channels").insert([{ name: newChannel }])
      loadChannels()
      setNewChannel("")
      alert("Channel added successfully!")
    } catch (err) {
      console.error("Error adding channel:", err)
      alert("Error adding channel")
    }
  }

  const handleDeleteChannel = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await supabase.from("channels").delete().eq("id", id)
      loadChannels()
    } catch (err) {
      console.error("Error deleting channel:", err)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Admin Login
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
                Secure admin password required
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Setup</h1>
          <p className="text-slate-300">Configure event sectors and channels</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSections("sectors")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              sections === "sectors"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-200 hover:bg-slate-600"
            }`}
          >
            Sectors ({sectors.length})
          </button>
          <button
            onClick={() => setSections("channels")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              sections === "channels"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-200 hover:bg-slate-600"
            }`}
          >
            Channels ({channels.length})
          </button>
        </div>

        {sections === "sectors" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Add New Sector
              </h2>

              <form onSubmit={handleAddSector} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sector Name
                  </label>
                  <input
                    type="text"
                    value={newSector.name}
                    onChange={(e) =>
                      setNewSector({ ...newSector, name: e.target.value })
                    }
                    placeholder="e.g., Healthcare"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Situation
                  </label>
                  <textarea
                    value={newSector.situation}
                    onChange={(e) =>
                      setNewSector({ ...newSector, situation: e.target.value })
                    }
                    placeholder="Describe the business situation..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Constraint
                  </label>
                  <textarea
                    value={newSector.constraint}
                    onChange={(e) =>
                      setNewSector({ ...newSector, constraint: e.target.value })
                    }
                    placeholder="Describe the constraints teams must work with..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sector Password
                  </label>
                  <input
                    type="text"
                    value={newSector.password}
                    onChange={(e) =>
                      setNewSector({ ...newSector, password: e.target.value })
                    }
                    placeholder="Password for teams to unlock this sector"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Sector
                </button>
              </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Existing Sectors
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sectors.length === 0 ? (
                  <p className="text-gray-500">No sectors added yet</p>
                ) : (
                  sectors.map((sector) => (
                    <div
                      key={sector.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900">
                          {sector.name}
                        </h3>
                        <button
                          onClick={() => handleDeleteSector(sector.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Situation:</strong>{" "}
                        {sector.situation.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Password:</strong> {sector.password}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {sections === "channels" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Add New Channel
              </h2>

              <form onSubmit={handleAddChannel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    placeholder="e.g., Social Media, Email, Website"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Channel
                </button>
              </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Existing Channels
              </h2>

              <div className="space-y-2">
                {channels.length === 0 ? (
                  <p className="text-gray-500">No channels added yet</p>
                ) : (
                  channels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                    >
                      <span className="font-medium text-gray-900">
                        {channel.name}
                      </span>
                      <button
                        onClick={() => handleDeleteChannel(channel.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
