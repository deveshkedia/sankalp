"use client"

import { useState } from "react"
import { FileUp } from "lucide-react"

interface Round2Props {
  teamName: string
  onComplete: (imageLink: string) => void
}

export function Round2({ teamName, onComplete }: Round2Props) {
  const [imageLink, setImageLink] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageLink.trim()) {
      setError("Please enter a Google Drive link")
      return
    }

    // Basic validation for Google Drive link
    if (!imageLink.includes("drive.google.com")) {
      setError("Please enter a valid Google Drive link")
      return
    }

    try {
      setError("")
      setSubmitting(true)
      onComplete(imageLink.trim())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-600 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-2">AD-RENALINE - Round 2</h1>
          <p className="text-gray-600 mb-8">
            Team: <span className="font-semibold">{teamName}</span>
          </p>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Submit Your Image/Presentation
            </h2>
            <p className="text-gray-700 mb-4">
              Share your solution as an image or document. Please use Google
              Drive and share the link below.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              📝 Make sure the link is accessible and the file size is not more
              than 25MB
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Drive Link
              </label>
              <input
                type="url"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-2">
                Make sure the link is set to "Anyone with the link can view"
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FileUp className="w-5 h-5" />
              {submitting ? "Submitting..." : "Submit Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
