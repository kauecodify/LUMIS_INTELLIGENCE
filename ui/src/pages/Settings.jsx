import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Shield, Bell, Language, Palette, Database, Key, Save, X } from 'lucide-react'

function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: 'Admin TR8',
    email: 'admin@tr8.intelligence',
    phone: '(11) 99999-9999',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    alerts: true,
  })
  const [language, setLanguage] = useState('pt-BR')
  const [theme, setTheme] = useState('dark')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle notification toggle
  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Handle save
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSaving(false)
    setSaveStatus('success')
    
    // Clear status after 3 seconds
    setTimeout(() => setSaveStatus(null), 3000)
  }

  // Tabs
  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'appearance', name: 'Aparência', icon: Palette },
    { id: 'system', name: 'Sistema', icon: Database },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-white/70 mt-1">
          Gerencie suas preferências e configurações do sistema
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-medical-cyan/20 text-medical-cyan'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Informações do Perfil</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="medical-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="medical-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="medical-input"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="medical-btn medical-btn-primary flex items-center gap-2 mt-6"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Salvar Alterações
                </button>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Alterar Senha</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Digite sua senha atual"
                      className="medical-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Digite a nova senha"
                      className="medical-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirme a nova senha"
                      className="medical-input"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="medical-btn medical-btn-primary flex items-center gap-2 mt-6"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Key className="w-5 h-5" />
                  )}
                  Alterar Senha
                </button>
              </div>

              {/* API Keys */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Chaves de API</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass-card">
                    <div>
                      <p className="text-white font-medium">Chave Primária</p>
                      <p className="text-white/60 text-sm">tr8_sk_abc123xyz456...</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-white/60 hover:text-white text-sm">
                        Copiar
                      </button>
                      <button className="text-white/60 hover:text-red-500 text-sm">
                        Revogar
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 glass-card">
                    <div>
                      <p className="text-white font-medium">Chave Secundária</p>
                      <p className="text-white/60 text-sm">tr8_sk_def789ghi012...</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-white/60 hover:text-white text-sm">
                        Copiar
                      </button>
                      <button className="text-white/60 hover:text-red-500 text-sm">
                        Revogar
                      </button>
                    </div>
                  </div>
                  <button className="medical-btn medical-btn-secondary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Gerar Nova Chave
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Preferências de Notificação
                </h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 glass-card"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {key === 'email' && 'Notificações por Email'}
                          {key === 'push' && 'Notificações Push'}
                          {key === 'sms' && 'Notificações por SMS'}
                          {key === 'alerts' && 'Alertas Críticos'}
                        </p>
                        <p className="text-white/60 text-sm">
                          {key === 'email' && 'Receba notificações por email'}
                          {key === 'push' && 'Receba notificações no navegador'}
                          {key === 'sms' && 'Receba notificações por SMS'}
                          {key === 'alerts' && 'Receba alertas de sistema'}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification(key)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          value ? 'bg-medical-cyan' : 'bg-white/10'
                        }`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                          value ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/30'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="medical-btn medical-btn-primary flex items-center gap-2 mt-6"
                >
                  <Save className="w-5 h-5" />
                  Salvar Preferências
                </button>
              </div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Idioma</h3>
                <div className="space-y-4">
                  {['pt-BR', 'en-US', 'es-ES'].map(lang => (
                    <div
                      key={lang}
                      className={`flex items-center gap-3 p-4 glass-card cursor-pointer transition-colors ${
                        language === lang ? 'ring-2 ring-medical-cyan' : ''
                      }`}
                      onClick={() => setLanguage(lang)}
                    >
                      <Language className="w-5 h-5 text-white/60" />
                      <div>
                        <p className="text-white font-medium">
                          {lang === 'pt-BR' && 'Português (Brasil)'}
                          {lang === 'en-US' && 'Inglês (EUA)'}
                          {lang === 'es-ES' && 'Espanhol (Espanha)'}
                        </p>
                        <p className="text-white/60 text-sm">
                          {lang === 'pt-BR' && 'Idioma padrão do sistema'}
                          {lang === 'en-US' && 'English (United States)'}
                          {lang === 'es-ES' && 'Español (España)'}
                        </p>
                      </div>
                      <div className="ml-auto">
                        {language === lang && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Tema</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 glass-card cursor-pointer rounded-xl transition-colors ${
                      theme === 'dark' ? 'ring-2 ring-medical-cyan' : ''
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Escuro</p>
                        <p className="text-white/60 text-sm">Tema escuro</p>
                      </div>
                      {theme === 'dark' && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="w-24 h-4 rounded-full bg-white/10" />
                      <div className="w-16 h-4 rounded-full bg-white/10" />
                    </div>
                  </div>

                  <div
                    className={`p-4 glass-card cursor-pointer rounded-xl transition-colors ${
                      theme === 'light' ? 'ring-2 ring-medical-cyan' : ''
                    }`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Claro</p>
                        <p className="text-white/60 text-sm">Tema claro</p>
                      </div>
                      {theme === 'light' && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="w-24 h-4 rounded-full bg-medical-dark/10" />
                      <div className="w-16 h-4 rounded-full bg-medical-dark/10" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="medical-btn medical-btn-primary flex items-center gap-2 mt-6"
                >
                  <Save className="w-5 h-5" />
                  Salvar Preferências
                </button>
              </div>
            </motion.div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Informações do Sistema
                </h3>
                <div className="space-y-4">
                  <div className="p-4 glass-card">
                    <p className="text-white/60 text-sm mb-1">Versão do Sistema</p>
                    <p className="text-white font-medium">TR8 Intelligence v1.0.0</p>
                  </div>
                  <div className="p-4 glass-card">
                    <p className="text-white/60 text-sm mb-1">Ambiente</p>
                    <p className="text-white font-medium">Produção</p>
                  </div>
                  <div className="p-4 glass-card">
                    <p className="text-white/60 text-sm mb-1">Região</p>
                    <p className="text-white font-medium">us-east-1 (Primária)</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Ações do Sistema
                </h3>
                <div className="space-y-4">
                  <button className="medical-btn medical-btn-secondary flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      <span>Backup do Banco de Dados</span>
                    </div>
                    <span className="text-white/60">↗</span>
                  </button>
                  <button className="medical-btn medical-btn-secondary flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      <span>Reindexar Dados</span>
                    </div>
                    <span className="text-white/60">↗</span>
                  </button>
                  <button className="medical-btn medical-btn-secondary flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5" />
                      <span>Limpar Cache</span>
                    </div>
                    <span className="text-white/60">↗</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-xl bg-green-500/20 border border-green-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                <Save className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-green-500 font-medium">Configurações salvas com sucesso!</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Settings
