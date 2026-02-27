"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Trash2, Plus } from "lucide-react"

export default function AdminSetup() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  // adminPassword state no longer used (leftover from earlier version)
  // const [adminPassword, setAdminPassword] = useState("")
  const [sections, setSections] = useState<
    "sectors" | "channels" | "market-events"
  >("sectors")

  // typed records
  interface SectorRecord {
    id: string
    name: string
    situation: string
    constraint: string
    password: string
    password_round3?: string
  }
  interface ChannelRecord {
    id: string
    name: string
  }
  interface MarketEventRecord {
    id: string
    choice: string
    title: string
    description: string
    impact: string
  }

  // Sectors state
  const [sectors, setSectors] = useState<SectorRecord[]>([])
  const [newSector, setNewSector] = useState({
    name: "",
    situation: "",
    constraint: "",
    password: "", // password for Round 1
    password_round3: "", // optional separate password for Round 3
  })

  // Channels state
  const [channels, setChannels] = useState<ChannelRecord[]>([])
  const [newChannel, setNewChannel] = useState("")

  // Market events state
  const [events, setEvents] = useState<MarketEventRecord[]>([])
  const [newEvent, setNewEvent] = useState({
    choice: "A",
    title: "",
    description: "",
    impact: "positive",
  })

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - in production use proper auth
    if (password === "ADRen@2026!Sec") {
      setIsAuthenticated(true)
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

  const loadEvents = async () => {
    try {
      const { data } = await supabase.from("market_events").select("*")
      setEvents(data || [])
    } catch (err) {
      console.error("Error loading market events:", err)
    }
  }

  useEffect(() => {
    // Load existing data if authenticated
    if (isAuthenticated) {
      loadSectors()
      loadChannels()
      loadEvents()
    }
  }, [isAuthenticated])

  const handleAddSector = async (e: React.FormEvent) => {
    // ensure both password fields filled (round3 optional)
    e.preventDefault()
    if (
      !newSector.name ||
      !newSector.situation ||
      !newSector.constraint ||
      !newSector.password
    ) {
      alert(
        "Please fill all fields (password for Round 1 is required; Round 3 password can be left blank to reuse the same value)",
      )
      return
    }

    try {
      await supabase.from("sectors").insert([newSector])
      loadSectors()
      setNewSector({
        name: "",
        situation: "",
        constraint: "",
        password: "",
        password_round3: "",
      })
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

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title.trim() || !newEvent.description.trim()) {
      alert("Please fill title and description")
      return
    }
    try {
      await supabase.from("market_events").insert([newEvent])
      loadEvents()
      setNewEvent({
        choice: "A",
        title: "",
        description: "",
        impact: "positive",
      })
      alert("Event added")
    } catch (err) {
      console.error("Error adding event:", err)
      alert("Error adding event")
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return
    try {
      await supabase.from("market_events").delete().eq("id", id)
      loadEvents()
    } catch (err) {
      console.error("Error deleting event:", err)
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
          <button
            onClick={() => setSections("market-events")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              sections === "market-events"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-200 hover:bg-slate-600"
            }`}
          >
            Market Events ({events.length})
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
                    Round 1 Password
                  </label>
                  <input
                    type="text"
                    value={newSector.password}
                    onChange={(e) =>
                      setNewSector({ ...newSector, password: e.target.value })
                    }
                    placeholder="Password for teams to unlock this sector (Round 1)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Round 3 Password (optional)
                  </label>
                  <input
                    type="text"
                    value={newSector.password_round3}
                    onChange={(e) =>
                      setNewSector({
                        ...newSector,
                        password_round3: e.target.value,
                      })
                    }
                    placeholder="Separate password for Round 3 (leave empty to use Round 1)"
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
                        <strong>Round 1 password:</strong> {sector.password}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Round 3 password:</strong>{" "}
                        {sector.password_round3 || sector.password}
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
        {sections === "market-events" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Add New Market Event
              </h2>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Choice (A/B/C)
                  </label>
                  <select
                    value={newEvent.choice}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, choice: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact
                  </label>
                  <select
                    value={newEvent.impact}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, impact: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Event
                </button>
              </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Existing Events
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-gray-500">No events added yet</p>
                ) : (
                  events.map((ev) => (
                    <div
                      key={ev.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900">
                          [{ev.choice}] {ev.title}
                        </h3>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {ev.description.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-gray-600">
                        Impact: {ev.impact}
                      </p>
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
