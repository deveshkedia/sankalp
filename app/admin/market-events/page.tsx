"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Plus, Trash2, Edit2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Sector {
  id: string
  name: string
}

interface MarketEvent {
  id?: string
  sector_id: string
  choice: string
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
}

export default function MarketEventsPage() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [events, setEvents] = useState<MarketEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<MarketEvent | null>(null)
  const [formData, setFormData] = useState<MarketEvent>({
    sector_id: "",
    choice: "A",
    title: "",
    description: "",
    impact: "positive",
  })

  useEffect(() => {
    loadSectors()
  }, [])

  useEffect(() => {
    if (selectedSector) {
      loadEvents(selectedSector.id)
    }
  }, [selectedSector])

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

  const loadEvents = async (sectorId: string) => {
    try {
      const { data, error } = await supabase
        .from("market_events")
        .select("*")
        .eq("sector_id", sectorId)
        .order("choice", { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error("Error loading events:", err)
    }
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setFormData({
      sector_id: selectedSector!.id,
      choice: "A",
      title: "",
      description: "",
      impact: "positive",
    })
    setShowForm(true)
  }

  const handleEditEvent = (event: MarketEvent) => {
    setEditingEvent(event)
    setFormData(event)
    setShowForm(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const { error } = await supabase
        .from("market_events")
        .delete()
        .eq("id", eventId)

      if (error) throw error
      loadEvents(selectedSector!.id)
    } catch (err) {
      console.error("Error deleting event:", err)
      alert("Failed to delete event")
    }
  }

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all fields")
      return
    }

    try {
      if (editingEvent?.id) {
        // Update existing event
        const { error } = await supabase
          .from("market_events")
          .update(formData)
          .eq("id", editingEvent.id)

        if (error) throw error
      } else {
        // Insert new event
        const { error } = await supabase
          .from("market_events")
          .insert([formData])

        if (error) throw error
      }

      setShowForm(false)
      loadEvents(selectedSector!.id)
    } catch (err) {
      console.error("Error saving event:", err)
      alert("Failed to save event")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header and Back Button */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <h1 className="text-4xl font-bold text-white">Market Events</h1>
          <p className="text-slate-300 mt-2">
            Manage A, B, C events for each sector
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sectors List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sectors</h2>
              <div className="space-y-2">
                {sectors.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedSector?.id === sector.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {sector.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Events Management */}
          <div className="lg:col-span-3">
            {selectedSector ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedSector.name} Events
                  </h2>
                  <button
                    onClick={handleAddEvent}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Event
                  </button>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No events configured for this sector. Click "Add Event" to
                      create one.
                    </p>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className={`border-l-4 rounded-lg p-4 ${
                          event.impact === "positive"
                            ? "border-green-600 bg-green-50"
                            : event.impact === "negative"
                              ? "border-red-600 bg-red-50"
                              : "border-blue-600 bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-gray-900">
                                Choice {event.choice}
                              </span>
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded ${
                                  event.impact === "positive"
                                    ? "bg-green-200 text-green-900"
                                    : event.impact === "negative"
                                      ? "bg-red-200 text-red-900"
                                      : "bg-blue-200 text-blue-900"
                                }`}
                              >
                                {event.impact}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">
                              {event.title}
                            </h3>
                            <p className="text-gray-700 text-sm">
                              {event.description}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Form Modal */}
                {showForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {editingEvent ? "Edit Event" : "Add New Event"}
                      </h3>

                      <form onSubmit={handleSaveEvent} className="space-y-4">
                        {/* Choice */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Choice
                          </label>
                          <select
                            value={formData.choice}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                choice: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                          </select>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            placeholder="Event title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            placeholder="Event description"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        {/* Impact */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Impact
                          </label>
                          <select
                            value={formData.impact}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                impact: e.target.value as
                                  | "positive"
                                  | "negative"
                                  | "neutral",
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                            <option value="neutral">Neutral</option>
                          </select>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                          >
                            Save Event
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  Select a sector from the left to view and manage events
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
