import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Edit, Trash2, Eye, MoreVertical, ChevronLeft, ChevronRight, Download, Upload } from 'lucide-react'

// Mock patient data
const mockPatients = Array.from({ length: 50 }, (_, i) => ({
  id: `TR8-${1000 + i}`,
  name: `${['Maria', 'João', 'Ana', 'Carlos', 'Fernanda', 'Pedro', 'Luiza'][i % 7]} ${['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Ribeiro'][i % 7]}`,
  cpf: `${Math.floor(100000000 + Math.random() * 900000000)}`.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
  email: `paciente${i}@example.com`,
  phone: `(${['11', '21', '31', '41', '51'][i % 5]}) ${Math.floor(90000000 + Math.random() * 100000000)}`.replace(/(\d{5})(\d{4})/, '$1-$2'),
  birthDate: new Date(1970 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('pt-BR'),
  age: Math.floor(Math.random() * 80) + 18,
  gender: ['M', 'F'][Math.floor(Math.random() * 2)],
  bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
  state: ['SP', 'RJ', 'MG', 'RS', 'PR'][Math.floor(Math.random() * 5)],
  city: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Curitiba'][Math.floor(Math.random() * 5)],
  healthPlan: ['Unimed', 'Bradesco', 'SulAmérica', 'Amil', 'Particular'][Math.floor(Math.random() * 5)],
  status: ['Ativo', 'Inativo', 'Pendente'][Math.floor(Math.random() * 3)],
  lastVisit: new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000).toLocaleDateString('pt-BR'),
  riskLevel: ['Baixo', 'Médio', 'Alto'][Math.floor(Math.random() * 3)],
}))

function Patients() {
  const [patients, setPatients] = useState(mockPatients)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    status: '',
    riskLevel: '',
    bloodType: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPatients, setSelectedPatients] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [isLoading, setIsLoading] = useState(false)
  const patientsPerPage = 10

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.cpf.includes(searchQuery) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesState = filters.state ? patient.state === filters.state : true
    const matchesCity = filters.city ? patient.city === filters.city : true
    const matchesStatus = filters.status ? patient.status === filters.status : true
    const matchesRisk = filters.riskLevel ? patient.riskLevel === filters.riskLevel : true
    const matchesBlood = filters.bloodType ? patient.bloodType === filters.bloodType : true
    
    return matchesSearch && matchesState && matchesCity && matchesStatus && matchesRisk && matchesBlood
  })

  // Sort patients
  const sortedPatients = React.useMemo(() => {
    if (!sortConfig.key) return filteredPatients
    
    return [...filteredPatients].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredPatients, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedPatients.length / patientsPerPage)
  const currentPatients = sortedPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  )

  // Request sort
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  // Toggle patient selection
  const togglePatientSelection = (id) => {
    setSelectedPatients(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    )
  }

  // Select all patients on current page
  const selectAll = () => {
    const allIds = currentPatients.map(p => p.id)
    setSelectedPatients(prev => 
      prev.length === allIds.length 
        ? prev.filter(id => !allIds.includes(id))
        : [...new Set([...prev, ...allIds])]
    )
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-500/20 text-green-500'
      case 'Inativo': return 'bg-red-500/20 text-red-500'
      case 'Pendente': return 'bg-orange-500/20 text-orange-500'
      default: return 'bg-white/10 text-white/60'
    }
  }

  // Get risk color
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Baixo': return 'bg-green-500/20 text-green-500'
      case 'Médio': return 'bg-orange-500/20 text-orange-500'
      case 'Alto': return 'bg-red-500/20 text-red-500'
      default: return 'bg-white/10 text-white/60'
    }
  }

  // Mock actions
  const handleExport = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const handleBulkAction = (action) => {
    console.log(`Executing ${action} on ${selectedPatients.length} patients`)
    setSelectedPatients([])
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
          <h1 className="text-2xl font-bold text-white">Pacientes</h1>
          <p className="text-white/70 mt-1">
            Gerencie todos os pacientes do sistema LUMIS
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="medical-btn medical-btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Importar
          </button>
          <button 
            className="medical-btn medical-btn-primary flex items-center gap-2"
            onClick={() => window.location.href = '/registration'}
          >
            <Plus className="w-4 h-4" />
            Novo Paciente
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 w-4 h-4 text-white/60 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar pacientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 medical-input"
              />
            </div>
          </div>
          
          {/* State Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              className="px-4 py-3 medical-select"
            >
              <option value="">Estado</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="PR">Paraná</option>
            </select>
          </div>
          
          {/* City Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-4 py-3 medical-select"
              disabled={!filters.state}
            >
              <option value="">Cidade</option>
              {filters.state === 'SP' && (
                <>
                  <option value="São Paulo">São Paulo</option>
                  <option value="Campinas">Campinas</option>
                  <option value="Santos">Santos</option>
                </>
              )}
              {filters.state === 'RJ' && (
                <>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                  <option value="Niterói">Niterói</option>
                </>
              )}
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 medical-select"
            >
              <option value="">Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
          
          {/* Risk Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
              className="px-4 py-3 medical-select"
            >
              <option value="">Nível de Risco</option>
              <option value="Baixo">Baixo</option>
              <option value="Médio">Médio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
          
          {/* Clear Filters */}
          {Object.values(filters).some(v => v) && (
            <button
              onClick={() => setFilters({ state: '', city: '', status: '', riskLevel: '', bloodType: '' })}
              className="px-4 py-3 text-white/60 hover:text-white transition-colors"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </motion.div>

      {/* Bulk Actions */}
      {selectedPatients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white/60">
                {selectedPatients.length} paciente(s) selecionado(s)
              </span>
              <button
                onClick={() => handleBulkAction('export')}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={() => handleBulkAction('activate')}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Ativar
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Desativar
              </button>
            </div>
            <button
              onClick={() => setSelectedPatients([])}
              className="text-white/60 hover:text-white transition-colors"
            >
              Limpar Seleção
            </button>
          </div>
        </motion.div>
      )}

      {/* Patients Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedPatients.length > 0 && currentPatients.every(p => selectedPatients.includes(p.id))}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-white/20 bg-transparent text-medical-cyan focus:ring-medical-cyan"
                  />
                </th>
                <th
                  className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => requestSort('name')}
                >
                  Nome {getSortIndicator('name')}
                </th>
                <th
                  className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => requestSort('cpf')}
                >
                  CPF {getSortIndicator('cpf')}
                </th>
                <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Telefone
                </th>
                <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Idade
                </th>
                <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Risco
                </th>
                <th className="text-right py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedPatients.includes(patient.id)}
                        onChange={() => togglePatientSelection(patient.id)}
                        className="w-4 h-4 rounded border-white/20 bg-transparent text-medical-cyan focus:ring-medical-cyan"
                      />
                    </td>
                    <td className="py-4 px-4 text-white font-medium">
                      {patient.name}
                    </td>
                    <td className="py-4 px-4 text-white/70">
                      {patient.cpf}
                    </td>
                    <td className="py-4 px-4 text-white/70">
                      {patient.email}
                    </td>
                    <td className="py-4 px-4 text-white/70">
                      {patient.phone}
                    </td>
                    <td className="py-4 px-4 text-white">
                      {patient.age}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                        {patient.state}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(patient.riskLevel)}`}>
                        {patient.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4 text-white/60" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4 text-white/60" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="w-12 h-12 text-white/30" />
                      <p className="text-white/60">Nenhum paciente encontrado</p>
                      <button
                        className="medical-btn medical-btn-primary flex items-center gap-2"
                        onClick={() => window.location.href = '/registration'}
                      >
                        <Plus className="w-4 h-4" />
                        Cadastrar Paciente
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">
                Mostrando {currentPage * patientsPerPage - patientsPerPage + 1}-{Math.min(currentPage * patientsPerPage, filteredPatients.length)} de {filteredPatients.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentPage === page 
                          ? 'bg-medical-cyan text-white' 
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Export Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-end"
      >
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="medical-btn medical-btn-secondary flex items-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          Exportar para Excel
        </button>
      </motion.div>
    </div>
  )
}

export default Patients
