import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, XCircle, Clock, AlertCircle, Table, Users, Filter } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

// Mock file types
const allowedFileTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv',
]

// Mock validation rules
const validationRules = {
  requiredColumns: ['CPF', 'Nome', 'Data Nascimento', 'Email', 'Telefone'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxRows: 10000,
}

function DataImport() {
  const [files, setFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [importResults, setImportResults] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [filters, setFilters] = useState({ state: '', city: '' })

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    // Check file type
    const validFiles = acceptedFiles.filter(file => 
      allowedFileTypes.includes(file.type) || 
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls') || 
      file.name.endsWith('.csv')
    )
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
      
      // Generate preview for first file
      if (validFiles.length > 0) {
        generatePreview(validFiles[0])
      }
    }
  }, [])

  // Generate preview data
  const generatePreview = (file) => {
    // Mock preview data
    const mockData = [
      { cpf: '123.456.789-00', name: 'Maria Silva', birth: '15/03/1978', email: 'maria@email.com', phone: '(11) 99999-9999', state: 'SP', city: 'São Paulo' },
      { cpf: '987.654.321-00', name: 'João Santos', birth: '22/08/1985', email: 'joao@email.com', phone: '(11) 88888-8888', state: 'RJ', city: 'Rio de Janeiro' },
      { cpf: '456.789.123-00', name: 'Ana Oliveira', birth: '10/12/1990', email: 'ana@email.com', phone: '(11) 77777-7777', state: 'MG', city: 'Belo Horizonte' },
      { cpf: '321.654.987-00', name: 'Carlos Souza', birth: '05/06/1982', email: 'carlos@email.com', phone: '(11) 66666-6666', state: 'SP', city: 'Campinas' },
      { cpf: '654.987.321-00', name: 'Fernanda Lima', birth: '30/01/1995', email: 'fernanda@email.com', phone: '(11) 55555-5555', state: 'PR', city: 'Curitiba' },
    ]
    
    setPreviewData({
      fileName: file.name,
      totalRows: 1248,
      validRows: 1245,
      invalidRows: 3,
      data: mockData,
    })
  }

  // Remove file
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    if (files.length === 1) {
      setPreviewData(null)
    }
  }

  // Handle upload
  const handleUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)
    setImportResults(null)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setUploadProgress(i)
    }
    
    // Simulate import results
    setImportResults({
      total: previewData.totalRows,
      success: previewData.validRows,
      failed: previewData.invalidRows,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 5000).toISOString(),
      errors: [
        { row: 12, field: 'CPF', message: 'CPF inválido' },
        { row: 45, field: 'Email', message: 'Email já cadastrado' },
        { row: 89, field: 'Telefone', message: 'Formato inválido' },
      ],
    })
    
    setIsUploading(false)
  }

  // Filter preview data
  const filteredPreviewData = previewData?.data.filter(row => {
    if (filters.state && row.state !== filters.state) return false
    if (filters.city && row.city !== filters.city) return false
    return true
  })

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 5,
    maxSize: validationRules.maxFileSize,
  })

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
          <h1 className="text-2xl font-bold text-white">Importar Dados</h1>
          <p className="text-white/70 mt-1">Importe pacientes em lote via Excel ou CSV</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="medical-btn medical-btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button 
            className="medical-btn medical-btn-primary flex items-center gap-2"
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
          >
            {isUploading ? 'Importando...' : 'Importar Dados'}
          </button>
        </div>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Arquivos para Importar</h3>
            <p className="text-white/60 text-sm">
              Arraste e solte arquivos ou clique para seleccionar
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-medical-cyan" />
            <span className="text-sm text-white/60">
              {files.length} arquivo(s) selecionado(s)
            </span>
          </div>
        </div>
        
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 mb-6 transition-all duration-300 ${
            isDragActive 
              ? 'border-medical-cyan bg-medical-cyan/10' 
              : 'border-white/20 bg-white/5 hover:border-white/30'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-medical-blue/20 to-medical-teal/20 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <Upload className="w-8 h-8 text-medical-cyan" />
            </motion.div>
            <p className="text-white/80 text-center">
              {isDragActive 
                ? 'Solte os arquivos aqui' 
                : 'Arraste e solte arquivos Excel ou CSV aqui'}
            </p>
            <p className="text-white/50 text-sm text-center">
              ou clique para selecionar
            </p>
            <div className="text-xs text-white/40 flex items-center gap-4">
              <span>Suporta: .xlsx, .xls, .csv</span>
              <span>|</span>
              <span>Máx: 10MB por arquivo</span>
            </div>
          </div>
        </div>
        
        {/* Selected Files */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/80">
              Arquivos Selecionados
            </h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 text-medical-cyan" />
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-white/50 text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-white/60" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Preview Section */}
      {previewData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Pré-visualização: {previewData.fileName}
              </h3>
              <p className="text-white/60 text-sm">
                {previewData.totalRows} registros | {previewData.validRows} válidos | {previewData.invalidRows} inválidos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">{previewData.validRows} válidos</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">{previewData.invalidRows} inválidos</span>
              </div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/60" />
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-medical-cyan"
              >
                <option value="">Todos os estados</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="PR">Paraná</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-white/60" />
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-medical-cyan"
                disabled={!filters.state}
              >
                <option value="">Todas as cidades</option>
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
          </div>
          
          {/* Preview Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Nascimento
                  </th>
                  <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left py-4 px-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPreviewData?.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-white">{row.cpf}</td>
                    <td className="py-4 px-4 text-white">{row.name}</td>
                    <td className="py-4 px-4 text-white/70">{row.birth}</td>
                    <td className="py-4 px-4 text-white/70">{row.email}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-medical-blue/20 text-medical-blue">
                        {row.state}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                        Válido
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPreviewData?.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">Nenhum registro encontrado</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Importando Dados
            </h3>
            <span className="text-white/60">{uploadProgress}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-medical-blue to-medical-teal"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Progress Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  uploadProgress >= 25 ? 'bg-green-500/20' : 'bg-white/5'
                }`}>
                  <Upload className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <p className="text-white font-medium">Upload</p>
                  <p className="text-white/50 text-sm">Enviando arquivo</p>
                </div>
              </div>
              <span className="text-white/60">
                {uploadProgress >= 25 ? 'Concluído' : 'Pendente'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  uploadProgress >= 50 ? 'bg-green-500/20' : 'bg-white/5'
                }`}>
                  <Clock className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <p className="text-white font-medium">Validação</p>
                  <p className="text-white/50 text-sm">Validando dados</p>
                </div>
              </div>
              <span className="text-white/60">
                {uploadProgress >= 50 ? 'Concluído' : 'Pendente'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  uploadProgress >= 75 ? 'bg-green-500/20' : 'bg-white/5'
                }`}>
                  <Database className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <p className="text-white font-medium">Importação</p>
                  <p className="text-white/50 text-sm">Salvando no banco</p>
                </div>
              </div>
              <span className="text-white/60">
                {uploadProgress >= 75 ? 'Concluído' : 'Pendente'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  uploadProgress >= 100 ? 'bg-green-500/20' : 'bg-white/5'
                }`}>
                  <CheckCircle className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <p className="text-white font-medium">Finalização</p>
                  <p className="text-white/50 text-sm">Atualizando índices</p>
                </div>
              </div>
              <span className="text-white/60">
                {uploadProgress >= 100 ? 'Concluído' : 'Pendente'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Import Results */}
      {importResults && !isUploading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Resultado da Importação
              </h3>
              <p className="text-white/60 text-sm">
                Processado em {(new Date(importResults.endTime) - new Date(importResults.startTime)) / 1000} segundos
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-medical-cyan" />
              <span className="text-sm text-white/60">
                {new Date(importResults.endTime).toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>
          
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-white">{importResults.success}</p>
              <p className="text-white/60 text-sm">Registros Importados</p>
            </div>
            
            <div className="glass-card p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <Table className="w-6 h-6 text-white/60" />
              </div>
              <p className="text-3xl font-bold text-white">{importResults.total}</p>
              <p className="text-white/60 text-sm">Total de Registros</p>
            </div>
            
            <div className="glass-card p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-white">{importResults.failed}</p>
              <p className="text-white/60 text-sm">Registros com Erro</p>
            </div>
          </div>
          
          {/* Errors */}
          {importResults.errors.length > 0 && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Erros Encontrados
              </h4>
              <div className="space-y-3">
                {importResults.errors.map((error, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <span className="text-red-500 font-bold">{error.row}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        Linha {error.row} - {error.field}
                      </p>
                      <p className="text-white/60 text-sm">{error.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default DataImport
