import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Patients = lazy(() => import('./pages/Patients'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Registration = lazy(() => import('./pages/Registration'))
const DataImport = lazy(() => import('./pages/DataImport'))
const RealTimeMonitor = lazy(() => import('./pages/RealTimeMonitor'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <div className="min-h-screen bg-gradient-animated">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />
          
          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <Suspense fallback={<LoadingScreen />}>{
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/data-import" element={<DataImport />} />
                  <Route path="/realtime" element={<RealTimeMonitor />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              }</Suspense>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
