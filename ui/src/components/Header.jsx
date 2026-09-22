import React from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, User, Bell, Search } from 'lucide-react'

function Header() {
  const location = useLocation()
  
  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname.replace('/', '')
    if (!path) return 'Dashboard'
    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <header className="sticky top-0 z-30 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Button (placeholder) */}
          <div className="lg:hidden w-10" />
          
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            key={location.pathname}
          >
            <h2 className="text-xl font-bold text-white">{getPageTitle()}</h2>
            <p className="text-xs text-white/50">LUMIS Intelligence Platform</p>
          </motion.div>
        </div>
        
        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-white/60 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-48 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-medical-cyan"
            />
          </div>
          
          {/* Time */}
          <div className="hidden lg:flex items-center gap-2 text-white/60">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          {/* User */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white hidden md:block">Admin</span>
          </div>
          
          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-white/60" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-medical-cyan" />
          </motion.button>
        </div>
      </div>
    </header>
  )
}

export default Header
