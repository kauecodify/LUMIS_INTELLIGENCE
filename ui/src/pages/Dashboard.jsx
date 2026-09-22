import React from 'react'
import { motion } from 'framer-motion'
import { Users, Activity, HeartPulse, FileText, Clock, MapPin, Globe } from 'lucide-react'
import StatCard from '../components/StatCard'
import BrazilMap from '../components/BrazilMap'
import RecentActivity from '../components/RecentActivity'
import DataFlow from '../components/DataFlow'

// Mock data for demonstration
const stats = [
  { label: 'Pacientes Totais', value: '2.4M', change: '+12%', icon: Users, color: 'from-medical-cyan to-medical-teal' },
  { label: 'Ativos Hoje', value: '18.5K', change: '+8%', icon: Activity, color: 'from-medical-blue to-medical-cyan' },
  { label: 'Novo Cadastro', value: '1.2K', change: '+15%', icon: FileText, color: 'from-green-500 to-emerald-500' },
  { label: 'Tempo Real', value: '99.7%', change: 'Live', icon: Clock, color: 'from-orange-500 to-amber-500' },
]

const regionalData = {
  'SP': { value: 45, color: '#00B4D8' },
  'RJ': { value: 32, color: '#00D1FF' },
  'MG': { value: 28, color: '#0077B6' },
  'RS': { value: 22, color: '#88C9D4' },
  'PR': { value: 18, color: '#004977' },
  'BA': { value: 15, color: '#FF6B6B' },
  'CE': { value: 12, color: '#4CAF50' },
}

function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Bem-vindo ao <span className="text-gradient">LUMIS Intelligence</span></h1>
            <p className="text-white/70 mt-1">Plataforma de IA Médica com Análise em Tempo Real</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/60">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Powered by TR8 APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-500">TR8 APIs Online</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brazil Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Distribuição Geográfica</h3>
              <p className="text-white/60 text-sm">Pacientes por Estado - Brasil</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-medical-cyan" />
              <span className="text-sm text-white/60">26 Estados + DF</span>
            </div>
          </div>
          
          <div className="h-96">
            <BrazilMap data={regionalData} />
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6">
            {Object.entries(regionalData).slice(0, 4).map(([state, data]) => (
              <div key={state} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                <span className="text-sm text-white/70">{state}</span>
              </div>
            ))}
            <div className="text-xs text-white/50">
              Data via TR8 APIs
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-6"
        >
          {/* TR8 Data Flow */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">TR8 Data Flow</h3>
              <span className="text-xs px-3 py-1 bg-medical-cyan/20 text-medical-cyan rounded-full">Real-Time</span>
            </div>
            <DataFlow />
          </div>
          
          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Resumo Rápido</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">TR8 API Requests</span>
                <span className="text-white font-medium">1.2M/day</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-medical-blue to-medical-teal"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Latência Média</span>
                <span className="text-white font-medium">45ms</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: '90%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Uptime</span>
                <span className="text-white font-medium">99.97%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: '99.97%' }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Atividade Recente</h3>
          <button className="text-sm text-medical-cyan hover:text-medical-teal transition-colors">
            Ver Tudo
          </button>
        </div>
        <RecentActivity />
      </motion.div>
    </div>
  )
}

export default Dashboard
