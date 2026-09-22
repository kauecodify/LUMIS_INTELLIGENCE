import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-medical-dark/80 backdrop-blur-xl">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-8"
      >
        <div className="relative w-20 h-20">
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-medical-cyan/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Inner Circle */}
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Pulse Dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white"
            style={{ transform: 'translate(-50%, -50%)' }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
      
      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xl font-semibold text-white"
      >
        TR8 Intelligence
      </motion.p>
      
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-medical-cyan mt-2"
      >
        Loading Medical AI...
      </motion.p>
      
      {/* Spinner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8"
      >
        <Loader2 className="w-8 h-8 text-medical-cyan animate-spin" />
      </motion.div>
    </div>
  )
}

export default LoadingScreen
