import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'

// Brazil states coordinates (simplified for SVG)
const brazilStates = {
  AC: { path: "M180,250 L200,230 L220,240 L210,260 L190,270 Z", name: "Acre", x: 200, y: 250 },
  AL: { path: "M550,450 L570,440 L580,460 L560,470 Z", name: "Alagoas", x: 565, y: 455 },
  AM: { path: "M200,100 L250,80 L300,90 L320,120 L300,150 L250,160 L200,150 Z", name: "Amazonas", x: 260, y: 120 },
  AP: { path: "M350,50 L380,30 L410,40 L400,70 L370,80 Z", name: "Amapá", x: 380, y: 50 },
  BA: { path: "M450,300 L500,280 L550,290 L570,320 L550,350 L500,360 L450,340 Z", name: "Bahia", x: 500, y: 320 },
  CE: { path: "M450,150 L480,130 L520,140 L530,170 L500,180 L470,170 Z", name: "Ceará", x: 495, y: 160 },
  DF: { path: "M400,400 L420,380 L440,390 L430,410 L410,410 Z", name: "Distrito Federal", x: 420, y: 395 },
  ES: { path: "M550,500 L580,480 L600,500 L580,520 Z", name: "Espírito Santo", x: 570, y: 500 },
  GO: { path: "M400,350 L450,330 L500,340 L520,360 L500,400 L450,410 L400,400 Z", name: "Goiás", x: 460, y: 370 },
  MA: { path: "M350,150 L400,130 L450,140 L470,170 L450,200 L400,200 L350,180 Z", name: "Maranhão", x: 400, y: 170 },
  MG: { path: "M450,450 L500,430 L550,440 L570,470 L550,500 L500,520 L450,500 Z", name: "Minas Gerais", x: 500, y: 475 },
  MS: { path: "M400,550 L450,530 L500,540 L520,560 L500,580 L450,570 Z", name: "Mato Grosso do Sul", x: 470, y: 555 },
  MT: { path: "M300,250 L350,230 L400,240 L420,270 L400,300 L350,290 L300,270 Z", name: "Mato Grosso", x: 350, y: 260 },
  PA: { path: "M300,50 L380,30 L420,50 L400,100 L350,120 L300,100 Z", name: "Pará", x: 360, y: 80 },
  PB: { path: "M600,200 L630,180 L650,200 L630,220 Z", name: "Paraíba", x: 620, y: 200 },
  PE: { path: "M600,250 L650,230 L670,250 L650,270 Z", name: "Pernambuco", x: 630, y: 250 },
  PI: { path: "M400,150 L450,130 L480,150 L470,180 L420,180 Z", name: "Piauí", x: 440, y: 160 },
  PR: { path: "M450,600 L500,580 L550,600 L530,630 L500,640 L450,620 Z", name: "Paraná", x: 500, y: 610 },
  RJ: { path: "M550,550 L580,530 L600,550 L580,570 Z", name: "Rio de Janeiro", x: 575, y: 550 },
  RN: { path: "M600,150 L630,130 L650,150 L630,170 Z", name: "Rio Grande do Norte", x: 620, y: 150 },
  RO: { path: "M250,200 L280,180 L320,190 L310,220 L280,230 Z", name: "Rondônia", x: 295, y: 205 },
  RR: { path: "M220,100 L250,80 L280,90 L270,120 Z", name: "Roraima", x: 250, y: 100 },
  RS: { path: "M450,700 L500,680 L550,700 L530,730 L500,740 L450,720 Z", name: "Rio Grande do Sul", x: 500, y: 710 },
  SC: { path: "M450,650 L500,630 L550,650 L530,680 L500,690 L450,670 Z", name: "Santa Catarina", x: 500, y: 665 },
  SE: { path: "M550,400 L580,380 L600,400 L580,420 Z", name: "Sergipe", x: 575, y: 400 },
  SP: { path: "M450,480 L520,460 L580,470 L580,520 L520,540 L450,520 Z", name: "São Paulo", x: 510, y: 500 },
  TO: { path: "M350,250 L400,230 L450,240 L430,270 L400,280 L350,270 Z", name: "Tocantins", x: 400, y: 260 }
}

function BrazilMap({ data }) {
  const [hoveredState, setHoveredState] = useState(null)
  const [selectedState, setSelectedState] = useState(null)

  // Generate SVG paths for all states
  const renderStates = () => {
    return Object.entries(brazilStates).map(([code, state]) => {
      const stateData = data[code] || { value: 0, color: '#ffffff20' }
      const isHovered = hoveredState === code
      const isSelected = selectedState === code
      
      return (
        <motion.path
          key={code}
          d={state.path}
          fill={isSelected ? '#00D1FF' : isHovered ? stateData.color : stateData.color + '80'}
          stroke={isSelected ? '#00D1FF' : isHovered ? '#00D1FF' : '#ffffff20'}
          strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.5}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onHoverStart={() => setHoveredState(code)}
          onHoverEnd={() => setHoveredState(null)}
          onClick={() => setSelectedState(selectedState === code ? null : code)}
          data-tooltip-id="state-tooltip"
          data-tooltip-content={`${state.name}: ${stateData.value || 0}%`}
          className="cursor-pointer"
        />
      )
    })
  }

  return (
    <div className="relative w-full h-full">
      {/* SVG Map */}
      <svg
        viewBox="0 0 700 800"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        {/* Background */}
        <rect width="100%" height="100%" fill="#00000000" />
        
        {/* Brazil Outline */}
        <motion.path
          d="M200,100 L250,80 L300,90 L320,120 L300,150 L250,160 L200,150 L180,200 L200,230 L220,240 L210,260 L190,270 L180,250 L200,250 L250,230 L280,200 L300,210 L350,200 L400,200 L450,180 L470,170 L500,180 L530,170 L550,200 L570,230 L600,250 L630,230 L650,200 L670,250 L650,270 L600,280 L550,290 L500,280 L450,300 L400,320 L350,300 L300,320 L250,340 L200,350 L180,400 L200,450 L250,470 L300,480 L350,470 L400,450 L450,430 L500,440 L550,450 L600,470 L630,480 L650,500 L630,520 L600,520 L550,500 L500,520 L450,500 L400,480 L350,460 L300,450 L250,440 L200,450 Z"
          fill="none"
          stroke="#ffffff20"
          strokeWidth="2"
        />
        
        {/* States */}
        {renderStates()}
        
        {/* Markers for major cities */}
        <circle cx="510" cy="500" r="3" fill="#FF6B6B" className="animate-pulse" />
        <text x="515" y="505" className="text-xs fill-white/80 font-medium">São Paulo</text>
        
        <circle cx="575" cy="550" r="3" fill="#FF6B6B" className="animate-pulse" />
        <text x="580" y="555" className="text-xs fill-white/80 font-medium">Rio</text>
        
        <circle cx="500" cy="320" r="3" fill="#FF6B6B" className="animate-pulse" />
        <text x="505" y="325" className="text-xs fill-white/80 font-medium">Salvador</text>
        
        <circle cx="420" cy="395" r="3" fill="#FF6B6B" className="animate-pulse" />
        <text x="425" y="400" className="text-xs fill-white/80 font-medium">Brasília</text>
      </svg>
      
      {/* Tooltip */}
      <Tooltip
        id="state-tooltip"
        place="top"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', borderRadius: '8px' }}
      />
      
      {/* Selected State Info */}
      {selectedState && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4 glass-card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">{brazilStates[selectedState]?.name || selectedState}</h4>
              <p className="text-white/60 text-sm">
                Pacientes: {data[selectedState]?.value || 0}%
              </p>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              className="text-white/60 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-medical-blue to-medical-teal"
                initial={{ width: 0 }}
                animate={{ width: `${data[selectedState]?.value || 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Legend */}
      <div className="absolute top-4 right-4 glass-card p-4 rounded-xl">
        <div className="space-y-2">
          {Object.entries(data).slice(0, 3).map(([code, d]) => (
            <div key={code} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-white/80">{code}</span>
            </div>
          ))}
          <div className="text-xs text-white/60 pt-2 border-t border-white/10">
            +23 estados
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrazilMap
