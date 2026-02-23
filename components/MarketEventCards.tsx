"use client"

import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface MarketEventCardsProps {
  choice: string
  onContinue: () => void
}

export function MarketEventCards({
  choice,
  onContinue,
}: MarketEventCardsProps) {
  const events: Record<
    string,
    Array<{
      title: string
      description: string
      impact: "positive" | "negative" | "neutral"
    }>
  > = {
    A: [
      {
        title: "Market Expansion",
        description:
          "Your choice attracted 50% more customer interest in the first month.",
        impact: "positive",
      },
      {
        title: "Partnership Opportunity",
        description: "A key industry player approached you for collaboration.",
        impact: "positive",
      },
    ],
    B: [
      {
        title: "Competitive Pressure",
        description: "A major competitor launched a similar offering.",
        impact: "negative",
      },
      {
        title: "Regulatory Compliance",
        description: "You faced unexpected regulatory requirements.",
        impact: "neutral",
      },
    ],
    C: [
      {
        title: "Customer Satisfaction",
        description: "Your approach resulted in 40% higher customer retention.",
        impact: "positive",
      },
      {
        title: "Operational Challenge",
        description: "Scaling required significant infrastructure investment.",
        impact: "negative",
      },
    ],
  }

  const selectedEvents = events[choice] || []

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
            {selectedEvents.map((event, index) => (
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
            ))}
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
