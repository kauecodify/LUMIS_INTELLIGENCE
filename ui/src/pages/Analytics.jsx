import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, Users, Activity, HeartPulse, TrendingUp, TrendingDown, Filter, Download } from 'lucide-react'

// Mock data for charts
const dailyData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
  registrations: Math.floor(Math.random() * 200) + 50,
  activeUsers: Math.floor(Math.random() * 500) + 100,
  apiRequests: Math.floor(Math.random() * 5000) + 1000,
}))

const stateData = [
  { name: 'SP', value: 45, patients: 12450 },
  { name: 'RJ', value: 32, patients: 8920 },
  { name: 'MG', value: 28, patients: 7350 },
  { name: 'RS', value: 22, patients: 5890 },
  { name: 'PR', value: 18, patients: 4720 },
  { name: 'Outros', value: 15, patients: 10670 },
]

const riskData = [
  { name: 'Baixo', value: 65, count: 16250 },
  { name: 'Médio', value: 25, count: 6250 },
  { name: 'Alto', value: 10, count: 2500 },
]

const ageData = [
  { group: '0-18', male: 1200, female: 1100 },
  { group: '19-35', male: 4500, female: 5200 },
  { group: '36-50', male: 6200, female: 7100 },
  { group: '51-65', male: 3800, female: 4200 },
  { group: '65+', male: 1500, female: 2000 },
]

const COLORS = ['#00B4D8', '#00D1FF', '#0077B6', '#88C9D4', '#FF6B6B', '#4CAF50']

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3">
        <p className="text-white font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-white/80 text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function Analytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedChart, setSelectedChart] = useState('daily')
  const [isLoading, setIsLoading] = useState(false)

  // Filter data based on time range
  const filteredDailyData = dailyData.slice(
    timeRange === '7d' ? -7 : timeRange === '15d' ? -15 : 0
  )

  // Calculate totals
  const totalRegistrations = filteredDailyData.reduce((sum, day) => sum + day.registrations, 0)
  const totalActiveUsers = filteredDailyData.reduce((sum, day) => sum + day.activeUsers, 0)
  const avgApiRequests = filteredDailyData.reduce((sum, day) => sum + day.apiRequests, 0) / filteredDailyData.length

  // Handle export
  const handleExport = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
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
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-white/70 mt-1">
            Análise de dados e métricas do sistema
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="medical-btn medical-btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button 
            className="medical-btn medical-btn-primary flex items-center gap-2"
            onClick={handleExport}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Exportar
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Registrations */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-blue to-medical-teal flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{totalRegistrations.toLocaleString('pt-BR')}</p>
          <p className="text-white/60 text-sm mt-1">Cadastros Totais</p>
        </div>

        {/* Active Users */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-cyan to-medical-teal flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              +8%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{totalActiveUsers.toLocaleString('pt-BR')}</p>
          <p className="text-white/60 text-sm mt-1">Usuários Ativos</p>
        </div>

        {/* API Requests */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded-full">
              Média
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{Math.round(avgApiRequests).toLocaleString('pt-BR')}</p>
          <p className="text-white/60 text-sm mt-1">Requests/Dia</p>
        </div>

        {/* Growth Rate */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              Crescimento
            </span>
          </div>
          <p className="text-3xl font-bold text-green-500">+24%</p>
          <p className="text-white/60 text-sm mt-1">Mês a Mês</p>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-white">Período</h3>
          <div className="flex gap-2">
            {['7d', '15d', '30d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range 
                    ? 'bg-medical-cyan text-white' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {range === '7d' ? '7 Dias' : range === '15d' ? '15 Dias' : '30 Dias'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Atividade Diária</h3>
            <div className="flex gap-2">
              {['daily', 'weekly'].map(chart => (
                <button
                  key={chart}
                  onClick={() => setSelectedChart(chart)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedChart === chart 
                      ? 'bg-medical-cyan/20 text-medical-cyan' 
                      : 'bg-white/5 text-white/60'
                  }`}
                >
                  {chart === 'daily' ? 'Diário' : 'Semanal'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredDailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff40" 
                  tick={{ fontSize: 12, fill: '#ffffff80' }}
                />
                <YAxis 
                  stroke="#ffffff40" 
                  tick={{ fontSize: 12, fill: '#ffffff80' }}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  wrapperStyle={{ backgroundColor: 'transparent' }}
                />
                <Legend wrapperStyle={{ color: '#ffffff80' }} />
                <Line 
                  type="monotone" 
                  dataKey="registrations" 
                  name="Cadastros" 
                  stroke="#00B4D8" 
                  strokeWidth={3}
                  dot={{ fill: '#00B4D8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  name="Usuários Ativos" 
                  stroke="#00D1FF" 
                  strokeWidth={3}
                  dot={{ fill: '#00D1FF', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* State Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Distribuição por Estado</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">Atualizado</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  type="number" 
                  stroke="#ffffff40" 
                  tick={{ fontSize: 12, fill: '#ffffff80' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#ffffff40" 
                  tick={{ fontSize: 12, fill: '#ffffff80' }}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  wrapperStyle={{ backgroundColor: 'transparent' }}
                />
                <Bar dataKey="value" fill="#00B4D8" radius={[4, 4, 0, 0]}>
                  {stateData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Nível de Risco</h3>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">Pacientes</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={riskData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {riskData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  wrapperStyle={{ backgroundColor: 'transparent' }}
                />
                <Legend 
                  wrapperStyle={{ color: '#ffffff80' }} 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Age Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Distribuição por Idade</h3>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">Demografia</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="group" 
                  stroke="#ffffff40" 
                  tick={{ fontSize: 12, fill: '#ffffff80' }}
                />
                <YAxis 
                  stroke="#ffffff40" 
                  tick={{ fontSize: 12, fill: '#ffffff80' }}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  wrapperStyle={{ backgroundColor: 'transparent' }}
                />
                <Legend wrapperStyle={{ color: '#ffffff80' }} />
                <Bar dataKey="male" name="Masculino" stackId="a" fill="#00B4D8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="female" name="Feminino" stackId="a" fill="#00D1FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Detailed Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Estatísticas Detalhadas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Top States */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-3">Top 5 Estados</h4>
            <div className="space-y-2">
              {stateData.slice(0, 5).map((state, index) => (
                <div key={state.name} className="flex items-center gap-3">
                  <span className="text-white/60">{index + 1}.</span>
                  <span className="text-white font-medium">{state.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-medical-cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${state.value}%` }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                  <span className="text-white/60 text-sm">{state.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Levels */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-3">Níveis de Risco</h4>
            <div className="space-y-2">
              {riskData.map((risk, index) => (
                <div key={risk.name} className="flex items-center gap-3">
                  <span className="text-white/60">{index + 1}.</span>
                  <span className="text-white font-medium">{risk.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-medical-blue"
                      initial={{ width: 0 }}
                      animate={{ width: `${risk.value}%` }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                  <span className="text-white/60 text-sm">{risk.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Age Groups */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-3">Faixas Etárias</h4>
            <div className="space-y-2">
              {ageData.map((age, index) => {
                const total = age.male + age.female
                const percent = (total / ageData.reduce((sum, a) => sum + a.male + a.female, 0)) * 100
                return (
                  <div key={age.group} className="flex items-center gap-3">
                    <span className="text-white/60">{age.group}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-medical-teal"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      />
                    </div>
                    <span className="text-white/60 text-sm">{Math.round(percent)}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Trends */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-3">Tendências</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-white font-medium">Cadastros</span>
                </div>
                <span className="text-green-500 text-sm font-medium">+24%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-white font-medium">Usuários Ativos</span>
                </div>
                <span className="text-green-500 text-sm font-medium">+18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-white font-medium">Latência</span>
                </div>
                <span className="text-red-500 text-sm font-medium">-12%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics
