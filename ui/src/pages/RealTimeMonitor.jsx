import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Server, Database, Zap, Clock, Users, Activity, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import BrazilMap from '../components/BrazilMap'

// Mock real-time data
const generateMockData = () => {
  const states = ['SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'PE', 'CE', 'SC', 'GO']
  return {
    timestamp: new Date().toISOString(),
    totalRequests: Math.floor(Math.random() * 10000) + 5000,
    activeUsers: Math.floor(Math.random() * 5000) + 1000,
    newRegistrations: Math.floor(Math.random() * 100) + 10,
    apiLatency: Math.floor(Math.random() * 50) + 20,
    databaseQueries: Math.floor(Math.random() * 10000) + 2000,
    regionalData: Object.fromEntries(
      states.map(state => [
        state, 
        {
          value: Math.floor(Math.random() * 50) + 10,
          requests: Math.floor(Math.random() * 1000) + 100,
          users: Math.floor(Math.random() * 500) + 50,
          color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
        }
      ])
    ),
    recentActivity: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      type: ['api', 'db', 'auth', 'sync'][Math.floor(Math.random() * 4)],
      action: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
      entity: ['patient', 'record', 'session', 'report'][Math.floor(Math.random() * 4)],
      time: new Date(Date.now() - i * 1000 * 60).toISOString(),
      status: ['success', 'success', 'success', 'warning', 'error'][Math.floor(Math.random() * 5)],
      latency: Math.floor(Math.random() * 200) + 10
    }))
  }
}

function RealTimeMonitor() {
  const [data, setData] = useState(generateMockData())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState(null)

  // Update data periodically
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      setData(generateMockData())
    }, 3000)
    
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Manual refresh
  const handleRefresh = () => {
    setData(generateMockData())
  }

  // Format numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  // Format latency
  const formatLatency = (ms) => {
    return ms < 100 ? '⚡ Instant' : `${ms}ms`
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-500'
      case 'warning': return 'text-orange-500'
      case 'error': return 'text-red-500'
      default: return 'text-white/60'
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✓'
      case 'warning': return '⚠'
      case 'error': return '✗'
      default: return '•'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Monitoramento em Tempo Real</h1>
          <p className="text-white/70 mt-1">
            Dados ao vivo das APIs e processamento global
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="medical-btn medical-btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-white/5 text-white/60'
            }`}
          >
            {autoRefresh ? 'Auto: ON' : 'Auto: OFF'}
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {/* Total Requests */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-blue to-medical-teal flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{formatNumber(data.totalRequests)}</p>
          <p className="text-white/60 text-sm mt-1">Requests Total</p>
        </div>

        {/* Active Users */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-cyan to-medical-teal flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              Live
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{formatNumber(data.activeUsers)}</p>
          <p className="text-white/60 text-sm mt-1">Usuários Ativos</p>
        </div>

        {/* New Registrations */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              Hoje
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{formatNumber(data.newRegistrations)}</p>
          <p className="text-white/60 text-sm mt-1">Novos Cadastros</p>
        </div>

        {/* API Latency */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded-full">
              {formatLatency(data.apiLatency)}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{data.apiLatency}ms</p>
          <p className="text-white/60 text-sm mt-1">Latência Média</p>
        </div>

        {/* Database Queries */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded-full">
              /min
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{formatNumber(data.databaseQueries)}</p>
          <p className="text-white/60 text-sm mt-1">Consultas DB</p>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brazil Map with Real-Time Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Atividade por Região</h3>
              <p className="text-white/60 text-sm">
                Dados em tempo real - Brasil
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-medical-cyan" />
              <span className="text-sm text-white/60">
                {selectedRegion || 'Todas as Regiões'}
              </span>
            </div>
          </div>
          
          <div className="h-96">
            <BrazilMap 
              data={data.regionalData}
              onStateSelect={setSelectedRegion}
            />
          </div>
          
          {/* Region Stats */}
          {selectedRegion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white/5 rounded-xl"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {data.regionalData[selectedRegion]?.requests || 0}
                  </p>
                  <p className="text-white/60 text-xs">Requests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {data.regionalData[selectedRegion]?.users || 0}
                  </p>
                  <p className="text-white/60 text-xs">Usuários</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {data.regionalData[selectedRegion]?.value || 0}%
                  </p>
                  <p className="text-white/60 text-xs">Atividade</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    ✓
                  </p>
                  <p className="text-white/60 text-xs">Status</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column - Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Atividade Recente</h3>
            <button className="text-sm text-medical-cyan hover:text-medical-teal transition-colors">
              Ver Tudo
            </button>
          </div>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {data.recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                {/* Timestamp */}
                <div className="text-xs text-white/40 whitespace-nowrap">
                  {new Date(activity.time).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
                
                {/* Status */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-green-500/20' :
                  activity.status === 'warning' ? 'bg-orange-500/20' :
                  'bg-red-500/20'
                }`}>
                  <span className={`font-bold ${getStatusColor(activity.status)}`}>
                    {getStatusIcon(activity.status)}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">
                    {activity.action} {activity.entity}
                  </p>
                  <p className="text-white/50 text-xs truncate">
                    {activity.type.toUpperCase()}
                  </p>
                </div>
                
                {/* Latency */}
                <div className={`text-xs ${activity.latency < 100 ? 'text-green-500' : 'text-white/60'}`}>
                  {activity.latency}ms
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section - API Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Status das APIs</h3>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-medical-cyan" />
            <span className="text-sm text-white/60">
              Última verificação: {new Date(data.timestamp).toLocaleTimeString('pt-BR')}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { name: 'API Gateway', status: 'success', latency: data.apiLatency },
            { name: 'Lambda', status: 'success', latency: 25 },
            { name: 'DynamoDB', status: 'success', latency: 15 },
            { name: 'S3', status: 'success', latency: 5 },
            { name: 'Auth', status: 'success', latency: 30 },
            { name: 'Analytics', status: 'success', latency: 45 },
            { name: 'Notifications', status: 'success', latency: 20 },
            { name: 'Monitoring', status: 'success', latency: 10 },
          ].map((api, index) => (
            <motion.div
              key={api.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              className="text-center"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                api.status === 'success' ? 'bg-green-500/20' :
                api.status === 'warning' ? 'bg-orange-500/20' :
                'bg-red-500/20'
              }`}>
                <Server className="w-6 h-6 text-white/60" />
              </div>
              <p className="text-white font-medium text-sm truncate">{api.name}</p>
              <p className={`text-xs ${getStatusColor(api.status)}`}>
                {api.latency}ms
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default RealTimeMonitor
