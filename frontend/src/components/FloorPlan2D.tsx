import { useState } from 'react'
import { Lightbulb, Music, Shield, Lock, Wifi, Tv } from 'lucide-react'

interface Room {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
  color: string
  devices: string[]
  icon: string
}

const rooms: Room[] = [
  { id: 'living', name: 'Living Room', x: 5, y: 2, w: 35, h: 30, color: '#e6b800', devices: ['light', 'speaker', 'tv'], icon: '🛋️' },
  { id: 'kitchen', name: 'Kitchen', x: 42, y: 2, w: 30, h: 25, color: '#60a5fa', devices: ['light', 'speaker'], icon: '🍳' },
  { id: 'dining', name: 'Dining Room', x: 42, y: 29, w: 30, h: 25, color: '#a78bfa', devices: ['light'], icon: '🍽️' },
  { id: 'master', name: 'Master Bedroom', x: 5, y: 55, w: 35, h: 28, color: '#f472b6', devices: ['light', 'speaker'], icon: '🛏️' },
  { id: 'bed2', name: 'Bedroom 2', x: 42, y: 56, w: 30, h: 27, color: '#34d399', devices: ['light'], icon: '🛌' },
  { id: 'office', name: 'Office', x: 5, y: 34, w: 22, h: 19, color: '#fb923c', devices: ['light', 'lock'], icon: '💼' },
  { id: 'bath', name: 'Bathroom', x: 42, y: 34, w: 14, h: 19, color: '#38bdf8', devices: ['light'], icon: '🚿' },
  { id: 'garage', name: 'Garage', x: 74, y: 2, w: 22, h: 30, color: '#6b7280', devices: ['light', 'lock'], icon: '🚗' },
  { id: 'theater', name: 'Home Theater', x: 74, y: 34, w: 22, h: 25, color: '#8b5cf6', devices: ['light', 'speaker', 'tv'], icon: '🎬' },
  { id: 'laundry', name: 'Laundry', x: 74, y: 61, w: 22, h: 22, color: '#9ca3af', devices: ['light'], icon: '🧺' },
]

const deviceIcons: Record<string, React.ReactNode> = {
  light: <Lightbulb className="w-3 h-3" />,
  speaker: <Music className="w-3 h-3" />,
  tv: <Tv className="w-3 h-3" />,
  lock: <Lock className="w-3 h-3" />,
  shield: <Shield className="w-3 h-3" />,
  wifi: <Wifi className="w-3 h-3" />,
}

export default function FloorPlan2D({ onSelectRoom }: { onSelectRoom?: (room: string) => void }) {
  const [activeRoom, setActiveRoom] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  const handleRoomClick = (room: Room) => {
    setActiveRoom(room.id === activeRoom ? null : room.id)
    onSelectRoom?.(room.name)
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-white">Floor Plan</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Online</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500/30" /> Active</span>
        </div>
      </div>

      <div className="relative w-full" style={{ paddingBottom: '75%' }}>
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 85" className="w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background */}
            <rect width="100" height="85" rx="6" fill="#1a1a2e" />

            {/* Grid lines */}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="85" stroke="#ffffff08" strokeWidth="0.3" />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#ffffff08" strokeWidth="0.3" />
            ))}

            {/* Walls */}
            <line x1="3" y1="0" x2="3" y2="85" stroke="#ffffff20" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="100" y2="0" stroke="#ffffff20" strokeWidth="0.8" />
            <line x1="0" y1="85" x2="100" y2="85" stroke="#ffffff20" strokeWidth="0.8" />
            <line x1="97" y1="0" x2="97" y2="85" stroke="#ffffff20" strokeWidth="0.8" />

            {/* Rooms */}
            {rooms.map((room) => {
              const isActive = activeRoom === room.id
              return (
                <g key={room.id} onClick={() => handleRoomClick(room)} style={{ cursor: 'pointer' }}>
                  <rect
                    x={room.x}
                    y={room.y}
                    width={room.w}
                    height={room.h}
                    rx={4}
                    fill={`${room.color}${isActive ? '30' : '10'}`}
                    stroke={isActive ? room.color : `${room.color}40`}
                    strokeWidth={isActive ? 1.5 : 0.6}
                    filter={isActive ? 'url(#glow)' : undefined}
                    className="transition-all duration-300"
                  />
                  <text
                    x={room.x + room.w / 2}
                    y={room.y + room.h / 2 - 2}
                    textAnchor="middle"
                    fill={isActive ? room.color : '#ffffff80'}
                    fontSize="2.5"
                    fontFamily="Inter, sans-serif"
                    fontWeight="600"
                  >
                    {room.icon}
                  </text>
                  <text
                    x={room.x + room.w / 2}
                    y={room.y + room.h / 2 + 5}
                    textAnchor="middle"
                    fill={isActive ? room.color : '#ffffff60'}
                    fontSize="1.8"
                    fontFamily="Inter, sans-serif"
                  >
                    {room.name}
                  </text>

                  {/* Devices */}
                  <g>
                    {room.devices.map((dev, di) => (
                      <foreignObject
                        key={dev}
                        x={room.x + 3 + di * 6}
                        y={room.y + room.h - 5}
                        width="5"
                        height="5"
                      >
                        <div
                          className={`w-full h-full rounded flex items-center justify-center transition-all ${
                            selectedDevice === dev && isActive
                              ? 'bg-gold-500/30 text-gold-400'
                              : 'bg-white/5 text-gray-500'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDevice(selectedDevice === dev ? null : dev)
                          }}
                        >
                          {deviceIcons[dev]}
                        </div>
                      </foreignObject>
                    ))}
                  </g>
                </g>
              )
            })}

            {/* Door indicators */}
            {[{ x: 3, y: 20 }, { x: 40, y: 3 }, { x: 40, y: 53 }, { x: 72, y: 3 }].map((d, i) => (
              <g key={i}>
                <line x1={d.x} y1={d.y} x2={d.x + 5} y2={d.y + 5} stroke="#ffffff30" strokeWidth="0.6" strokeDasharray="1,1" />
                <circle cx={d.x} cy={d.y} r="1" fill="#e6b800" opacity="0.6" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {activeRoom && (
        <div className="mt-4 p-4 rounded-xl glass animate-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">
              {rooms.find(r => r.id === activeRoom)?.icon} {rooms.find(r => r.id === activeRoom)?.name}
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {rooms.find(r => r.id === activeRoom)?.devices.map(dev => (
              <span
                key={dev}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  selectedDevice === dev
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/[0.06] hover:bg-white/[0.08]'
                }`}
                onClick={() => setSelectedDevice(selectedDevice === dev ? null : dev)}
              >
                {deviceIcons[dev]}
                {dev.charAt(0).toUpperCase() + dev.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
