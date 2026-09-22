import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Upload,
  Globe,
  HeartPulse,
  X,
  Settings as SettingsIcon
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', name: 'Pacientes', icon: Users },
  { path: '/analytics', name: 'Analytics', icon: BarChart3 },
  { path: '/registration', name: 'Cadastro', icon: FileText },
  { path: '/data-import', name: 'Importar Excel', icon: Upload },
  { path: '/realtime', name: 'TR8 APIs', icon: Globe },
  { path: '/settings', name: 'Configurações', icon: SettingsIcon },
]

function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 z-50 lg:translate-x-0 lg:static lg:bg-white/5 lg:border-r-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative w-10 h-10"
              whileHover={{ scale: 1.1 }}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-medical-blue to-medical-teal" />
              <div className="absolute inset-1 rounded-xl bg-medical-dark" />
              <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-medical-cyan" 
                   style={{ transform: 'translate(-50%, -50%)' }}>
                <div className="absolute inset-0 rounded-full bg-white animate-pulse" />
              </div>
            </motion.div>
            <div>
              <h1 className="font-bold text-lg text-white">LUMIS</h1>
              <p className="text-xs text-white/60">Intelligence</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(({ path, name, icon: Icon }) => (
              <motion.li key={path} whileHover={{ scale: 1.02 }}>
                <NavLink
                  to={path}
                  className={({ isActive }) => 
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5 text-white/60" />
                  <span>{name}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3 text-white/60">
            <HeartPulse className="w-5 h-5 text-medical-cyan" />
            <span className="text-sm font-medium">Powered by TR8</span>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </motion.aside>
      
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20"
        onClick={() => setIsOpen(true)}
      >
        <LayoutDashboard className="w-5 h-5 text-white" />
      </button>
    </>
  )
}

export default Sidebar
