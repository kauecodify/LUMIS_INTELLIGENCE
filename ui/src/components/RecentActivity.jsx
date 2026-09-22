import React from 'react'
import { motion } from 'framer-motion'
import { User, FileText, Database, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

// Mock activity data
const activities = [
  { 
    id: 1, 
    type: 'register', 
    icon: User, 
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    title: 'Novo paciente cadastrado',
    description: 'Maria Silva, 45 anos, São Paulo',
    time: '2 min atrás',
    status: 'success'
  },
  { 
    id: 2, 
    type: 'import', 
    icon: FileText, 
    color: 'text-medical-cyan',
    bgColor: 'bg-medical-cyan/20',
    title: 'Importação de Excel',
    description: '1.248 registros processados',
    time: '15 min atrás',
    status: 'success'
  },
  { 
    id: 3, 
    type: 'sync', 
    icon: Database, 
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/20',
    title: 'Sincronização de dados',
    description: 'Região Sudeste atualizada',
    time: '1 hora atrás',
    status: 'warning'
  },
  { 
    id: 4, 
    type: 'api', 
    icon: Clock, 
    color: 'text-medical-teal',
    bgColor: 'bg-medical-teal/20',
    title: 'API Request',
    description: 'Consulta de paciente #TR8-2024-001',
    time: '2 horas atrás',
    status: 'success'
  },
  { 
    id: 5, 
    type: 'error', 
    icon: AlertCircle, 
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    title: 'Erro de validação',
    description: 'Campo "CEP" inválido no registro #4521',
    time: '3 horas atrás',
    status: 'error'
  },
]

// Status icons
const statusIcons = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
}

function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon
        const StatusIcon = statusIcons[activity.status] || activity.icon
        
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer`}
          >
            {/* Icon */}
            <div className={`p-3 rounded-xl ${activity.bgColor}`}>
              <Icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">{activity.title}</h4>
                <span className="text-xs text-white/50">{activity.time}</span>
              </div>
              <p className="text-sm text-white/60 truncate">{activity.description}</p>
            </div>
            
            {/* Status */}
            <div className={`p-2 rounded-lg ${
              activity.status === 'success' ? 'bg-green-500/10' :
              activity.status === 'warning' ? 'bg-orange-500/10' :
              'bg-red-500/10'
            }`}>
              <StatusIcon className={`w-4 h-4 ${
                activity.status === 'success' ? 'text-green-500' :
                activity.status === 'warning' ? 'text-orange-500' :
                'text-red-500'
              }`} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default RecentActivity
