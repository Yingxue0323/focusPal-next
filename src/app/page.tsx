'use client'

import { useState } from 'react'
import TaskManager from '@/components/todo/TaskManager'
import QuickNotes from '@/components/QuickNotes'
export default function Home() {
  const [isCalendarSynced, setIsCalendarSynced] = useState(false)

  return (
    <main className="container mx-auto p-6 min-h-screen">
      {/* Upper 1/3 */}
      <div className="h-1/3 mb-6">
        <div className="glass-morphism rounded-2xl p-6 h-full flex items-center justify-center">
          <button
            onClick={() => setIsCalendarSynced(true)}
            className="px-8 py-4 rounded-lg bg-white/50 backdrop-blur-lg
                     shadow-lg hover:shadow-xl transition-all
                     border border-white/20"
          >
            Sync with Google Calendar
          </button>
        </div>
      </div>

      <div className="h-1/3 mb-6">
        <div className="glass-morphism rounded-2xl p-6 h-full flex items-center justify-center">
          <button
            className="px-8 py-4 rounded-lg bg-black text-white
                     shadow-lg hover:shadow-xl transition-all
                     hover:bg-black/90"
          >
            Start Focus with AI
          </button>
        </div>
      </div>

      {/* Lower Area */}
      <div className="h-2/3 grid grid-cols-2 gap-6">
        {/* Todo */}
        <TaskManager />
        {/* QuickNotes */}
        <div className="glass-morphism rounded-2xl p-6">
          <div className="h-[calc(100%-2rem)] bg-white/30 rounded-lg">
            <QuickNotes />
          </div>
        </div>
      </div>
    </main>
  )
}