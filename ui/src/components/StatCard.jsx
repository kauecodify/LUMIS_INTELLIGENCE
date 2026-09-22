import React from 'react'
import { motion } from 'framer-motion'

function StatCard({ label, value, change, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between">
        {/* Icon */}
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        {/* Stats */}
        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-sm font-medium">{label}</p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.1 }}
            className="text-3xl font-bold text-white mt-1"
          >
            {value}
          </motion.div>
        </div>
        
        {/* Change */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className={`text-sm font-medium ${
            change.startsWith('+') ? 'text-green-500' : 
            change.startsWith('-') ? 'text-red-500' : 
            'text-medical-cyan'
          }`}
        >
          {change}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default StatCard
