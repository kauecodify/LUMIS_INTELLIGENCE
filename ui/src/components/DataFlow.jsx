import React from 'react'
import { motion } from 'framer-motion'
import { Server, Database, Cloud, Zap, ArrowRight, ArrowDown } from 'lucide-react'

// Animated data flow nodes (TR8 Infrastructure)
const nodes = [
  { id: 1, icon: Cloud, label: 'TR8 API Gateway', color: '#00B4D8', x: 50, y: 20 },
  { id: 2, icon: Server, label: 'TR8 Lambda', color: '#00D1FF', x: 50, y: 80 },
  { id: 3, icon: Database, label: 'TR8 DynamoDB', color: '#0077B6', x: 50, y: 140 },
  { id: 4, icon: Server, label: 'TR8 Process', color: '#88C9D4', x: 200, y: 80 },
  { id: 5, icon: Database, label: 'TR8 S3 Lake', color: '#004977', x: 200, y: 140 },
  { id: 6, icon: Zap, label: 'TR8 Real-Time', color: '#FF6B6B', x: 350, y: 80 },
]

// Connections between nodes
const connections = [
  { from: 1, to: 2, label: '1.2M reqs' },
  { from: 2, to: 3, label: '5B/day' },
  { from: 2, to: 4, label: 'Process' },
  { from: 4, to: 5, label: 'Store' },
  { from: 5, to: 6, label: 'Stream' },
]

function DataFlow() {
  return (
    <div className="relative w-full h-48">
      {/* Nodes */}
      {nodes.map((node, index) => {
        const Icon = node.icon
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.5, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="absolute flex flex-col items-center"
            style={{ left: `${node.x}px`, top: `${node.y}px` }}
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`} 
                 style={{ backgroundColor: node.color }}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white/80 mt-2 whitespace-nowrap">
              {node.label}
            </span>
          </motion.div>
        )
      })}

      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        {connections.map((conn, index) => {
          const fromNode = nodes.find(n => n.id === conn.from)
          const toNode = nodes.find(n => n.id === conn.to)
          
          if (!fromNode || !toNode) return null
          
          // Calculate path
          const startX = fromNode.x + 6
          const startY = fromNode.y + 12
          const endX = toNode.x + 6
          const endY = toNode.y + 12
          
          // Control points for curve
          const controlX1 = startX + (endX - startX) / 3
          const controlY1 = startY
          const controlX2 = startX + (endX - startX) * 2 / 3
          const controlY2 = endY
          
          return (
            <motion.path
              key={index}
              d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
              fill="none"
              stroke="#ffffff20"
              strokeWidth="2"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              initial={{ strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              className="stroke-current"
            />
          )
        })}
      </svg>

      {/* Connection Labels */}
      {connections.map((conn, index) => {
        const fromNode = nodes.find(n => n.id === conn.from)
        const toNode = nodes.find(n => n.id === conn.to)
        
        if (!fromNode || !toNode) return null
        
        const labelX = (fromNode.x + toNode.x) / 2
        const labelY = (fromNode.y + toNode.y) / 2
        
        return (
          <motion.div
            key={`label-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            className="absolute text-xs text-white/60 whitespace-nowrap"
            style={{ left: `${labelX}px`, top: `${labelY - 10}px`, transform: 'translateX(-50%)' }}
          >
            {conn.label}
          </motion.div>
        )
      })}

      {/* Animated Data Particles */}
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-medical-cyan"
          initial={{ opacity: 0, x: 50, y: 20 }}
          animate={{ 
            opacity: [0, 1, 0],
            x: [50, 200, 350],
            y: [20, 80, 80]
          }}
          transition={{ 
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.5
          }}
          style={{ pointerEvents: 'none' }}
        />
      ))}

      {/* Timeline */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
        <div className="text-xs text-white/40">TR8 Ingest</div>
        <div className="text-xs text-white/40">TR8 Process</div>
        <div className="text-xs text-white/40">TR8 Store</div>
        <div className="text-xs text-white/40">TR8 Stream</div>
      </div>
    </div>
  )
}

export default DataFlow
