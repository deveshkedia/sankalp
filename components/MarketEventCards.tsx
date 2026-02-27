"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface MarketEventCardsProps {
  choice: string
  sectorId: string
  onContinue: () => void
}

export function MarketEventCards({
  choice,
  sectorId,
  onContinue,
}: MarketEventCardsProps) {
  interface Event {
    id?: string
    title: string
    description: string
    impact: "positive" | "negative" | "neutral"
  }

  const [selectedEvents, setSelectedEvents] = useState<Event[]>([])

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data } = await supabase
          .from("market_events")
          .select("*")
          .eq("sector_id", sectorId)
          .eq("choice", choice)
        setSelectedEvents((data as Event[]) || [])
      } catch (err) {
        console.error("Error loading market events:", err)
      }
    }
    loadEvents()
  }, [choice, sectorId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-2 text-indigo-600">
              Market Events
            </h2>
            <p className="text-center text-gray-600">
              Here's what happened in the market based on your choice
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {selectedEvents.length === 0 ? (
              <p className="text-gray-500 text-center">
                No market events configured for this choice and sector.
              </p>
            ) : (
              selectedEvents.map((event: Event, index: number) => (
                <div
                  key={index}
                  className={`rounded-lg p-6 border-l-4 ${
                    event.impact === "positive"
                      ? "bg-green-50 border-green-600"
                      : event.impact === "negative"
                        ? "bg-red-50 border-red-600"
                        : "bg-blue-50 border-blue-600"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div>
                      {event.impact === "positive" && (
                        <TrendingUp className="w-6 h-6 text-green-600 mt-1" />
                      )}
                      {event.impact === "negative" && (
                        <TrendingDown className="w-6 h-6 text-red-600 mt-1" />
                      )}
                      {event.impact === "neutral" && (
                        <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-bold mb-1 ${
                          event.impact === "positive"
                            ? "text-green-900"
                            : event.impact === "negative"
                              ? "text-red-900"
                              : "text-blue-900"
                        }`}
                      >
                        {event.title}
                      </h3>
                      <p
                        className={
                          event.impact === "positive"
                            ? "text-green-700"
                            : event.impact === "negative"
                              ? "text-red-700"
                              : "text-blue-700"
                        }
                      >
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            Continue to Results
          </button>
        </div>

        <div className="bg-indigo-400 rounded-lg p-4 text-center">
          <p className="text-indigo-100 text-sm">
            Your choice has shaped your market outcome. Well done!
          </p>
        </div>
      </div>
    </div>
  )
}
