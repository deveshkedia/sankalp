"use client"

import Link from "next/link"
import { Settings, BarChart3, Home } from "lucide-react"

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Sanklap Admin</h1>
          <p className="text-slate-300">Event management and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Setup */}
          <Link href="/admin/setup">
            <div className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="mb-4">
                <Settings className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup</h2>
              <p className="text-gray-600">
                Configure sectors and channels for the event
              </p>
            </div>
          </Link>

          {/* Dashboard */}
          <Link href="/admin/dashboard">
            <div className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="mb-4">
                <BarChart3 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Dashboard
              </h2>
              <p className="text-gray-600">
                View live submissions and team progress
              </p>
            </div>
          </Link>
        </div>

        {/* Back to Event */}
        <div className="mt-12">
          <Link href="/">
            <div className="bg-slate-700 hover:bg-slate-600 transition rounded-lg p-4 text-center">
              <Home className="w-6 h-6 text-white mx-auto mb-2" />
              <p className="text-white font-medium">← Back to Event</p>
            </div>
          </Link>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Start</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <span>
                Go to <strong>Setup</strong> and configure all 10 sectors with
                their situations, constraints, and passwords
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <span>Add the 5 channels for Round 3 coin allocation</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <span>Share the event link with teams</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">4.</span>
              <span>
                Monitor progress in the <strong>Dashboard</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">5.</span>
              <span>Download submissions as CSV anytime</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
