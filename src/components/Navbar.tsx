'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [focusTime, setFocusTime] = useState('00:00:00')

  return (
    <nav className="sticky top-0 z-50 glass-morphism border-b border-white/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* 左侧 Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="FocusPal Logo" width={32} height={32} />
          <span className="text-xl font-semibold">FocusPal</span>
        </div>

        {/* 右侧内容 */}
        <div className="flex items-center space-x-6">
          {/* 专注时间 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Focus Time:</span>
            <span className="font-mono">{focusTime}</span>
          </div>

          {/* 用户头像和下拉菜单 */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors"
            >
              <Image src="/avatar.png" alt="User Avatar" width={32} height={32} />
            </button>

            {/* 下拉菜单 */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-morphism rounded-xl border border-white/20 shadow-lg">
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 hover:bg-white/10">
                    VIP
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-white/10">
                    Profile
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-white/10">
                    Settings
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}