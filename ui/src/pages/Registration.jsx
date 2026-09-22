import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, MapPin, Phone, Mail, Calendar, Home, Building, Search, Plus, Upload, CreditCard as IdCardIcon } from 'lucide-react'
import BrazilMap from '../components/BrazilMap'

// Brazilian states for select
const brazilStates = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
]

// Cities by state (sample data)
const citiesByState = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'São José dos Campos'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Betuim'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Foz do Iguaçu'],
}

function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    address: '',
    city: '',
    state: '',
    cep: '',
    healthPlan: '',
    gender: '',
    bloodType: '',
  })
  
  const [selectedState, setSelectedState] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Handle state selection from map
  const handleStateSelect = (stateCode) => {
    setSelectedState(stateCode)
    setFormData(prev => ({ ...prev, state: stateCode, city: '' }))
  }

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle CEP auto-fill (mock)
  const handleCepChange = (e) => {
    const cep = e.target.value
    setFormData(prev => ({ ...prev, cep }))
    
    // Mock: Auto-fill address based on CEP
    if (cep === '01310-100') {
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          address: 'Av. Paulista, 1000',
          city: 'São Paulo',
          state: 'SP'
        }))
      }, 500)
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitStatus('success')
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitStatus(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birthDate: '',
        address: '',
        city: '',
        state: '',
        cep: '',
        healthPlan: '',
        gender: '',
        bloodType: '',
      })
      setSelectedState(null)
    }, 3000)
  }

  // Filter cities based on selected state
  const filteredCities = formData.state 
    ? citiesByState[formData.state] || []
    : []

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
          <h1 className="text-2xl font-bold text-white">Cadastro de Pacientes</h1>
          <p className="text-white/70 mt-1">Cadastre novos pacientes no sistema LUMIS</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="medical-btn medical-btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Importar Excel
          </button>
          <button 
            className="medical-btn medical-btn-primary flex items-center gap-2"
            form="registration-form"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Paciente'}
          </button>
        </div>
      </motion.div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Seleção Geográfica</h3>
            <p className="text-white/60 text-sm">Selecione o estado do paciente</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-medical-cyan" />
            <span className="text-sm text-white/60">
              {selectedState || 'Nenhum estado selecionado'}
            </span>
          </div>
        </div>
        
        <div className="h-64 mb-4">
          <BrazilMap 
            data={Object.fromEntries(brazilStates.map(s => [s, { value: Math.random() * 50 + 10, color: '#00B4D8' }]))}
            onStateSelect={handleStateSelect}
          />
        </div>
        
        {/* Quick State Selection */}
        <div className="flex flex-wrap gap-2">
          {['SP', 'RJ', 'MG', 'RS', 'PR'].map(state => (
            <button
              key={state}
              onClick={() => handleStateSelect(state)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedState === state 
                  ? 'bg-medical-cyan text-white' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Registration Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Dados do Paciente</h3>
            <p className="text-white/60 text-sm">Preencha todos os campos obrigatórios</p>
          </div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-medical-teal" />
          </div>
        </div>
        
        {/* Submit Status Message */}
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                <span className="text-green-500 text-xl">✓</span>
              </div>
              <div>
                <p className="text-green-500 font-medium">Paciente cadastrado com sucesso!</p>
                <p className="text-white/60 text-sm">ID: TR8-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        <form id="registration-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <UserPlus className="w-4 h-4 inline mr-2" />
                Nome Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome completo"
                className="medical-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="paciente@email.com"
                className="medical-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="medical-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <IdCardIcon className="w-4 h-4 inline mr-2" />
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className="medical-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data de Nascimento *
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="medical-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Gênero *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="medical-select"
                required
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tipo Sanguíneo
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="medical-select"
              >
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Plano de Saúde
              </label>
              <input
                type="text"
                name="healthPlan"
                value={formData.healthPlan}
                onChange={handleChange}
                placeholder="Unimed, Bradesco, etc."
                className="medical-input"
              />
            </div>
          </div>
          
          {/* Address Information */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-sm font-semibold text-white/80 mb-6 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Endereço
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Endereço *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua, número, complemento"
                  className="medical-input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Cidade *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="medical-select"
                  required
                  disabled={!formData.state}
                >
                  <option value="">Selecione a cidade</option>
                  {filteredCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Estado *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={(e) => {
                    handleChange(e)
                    setSelectedState(e.target.value)
                  }}
                  className="medical-select"
                  required
                >
                  <option value="">Selecione o estado</option>
                  {brazilStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  className="medical-input"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="medical-btn medical-btn-primary flex items-center gap-2 w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Cadastrar Paciente
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Registration
