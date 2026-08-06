import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { MessageCircle, AlertTriangle, Clock, CheckCircle, XCircle, Send, Shield } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const PRIORITY_COLORS = {
  URGENT: '#ef4444',
  HIGH: '#f97316',
  NORMAL: '#22c55e',
  LOW: '#94a3b8'
}

export default function App() {
  const [messages, setMessages] = useState([])
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [stats, setStats] = useState(null)
  const [simContent, setSimContent] = useState('')
  const [simPhone, setSimPhone] = useState('+919999999999')
  const [loading, setLoading] = useState(false)

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API}/messages`)
      const data = await res.json()
      setMessages(data)
    } catch (e) { console.error(e) }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/dashboard/stats`)
      const data = await res.json()
      setStats(data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    fetchMessages()
    fetchStats()
    const interval = setInterval(() => {
      fetchMessages()
      fetchStats()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const simulateMessage = async () => {
    if (!simContent.trim()) return
    setLoading(true)
    try {
      await fetch(`${API}/webhook/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_phone: simPhone,
          sender_name: 'Demo Customer',
          content: simContent
        })
      })
      setSimContent('')
      fetchMessages()
      fetchStats()
    } catch (e) { alert('Error: ' + e.message) }
    setLoading(false)
  }

  const handleApprove = async (id, approved) => {
    try {
      await fetch(`${API}/messages/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      })
      fetchMessages()
      setSelectedMsg(null)
    } catch (e) { alert('Error: ' + e.message) }
  }

  const statData = stats ? Object.entries(stats.priority_distribution || {}).map(([name, value]) => ({
    name, value: value || 0
  })) : []

  return (
    <div className="min-h-screen bg-whatsapp-bg">
      <header className="bg-whatsapp-dark text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle size={28} />
            <div>
              <h1 className="text-xl font-bold">WhatsApp Priority Agent</h1>
              <p className="text-xs text-green-200">AMD Radeon Cloud • Qwen2.5-7B-Instruct</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield size={16} className="text-green-400" />
            <span>Private AI Agent</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Send size={18} className="text-whatsapp-light" />
              Simulate Message
            </h2>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp-light"
              placeholder="Phone number"
              value={simPhone}
              onChange={e => setSimPhone(e.target.value)}
            />
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-whatsapp-light"
              placeholder="Type a customer message..."
              value={simContent}
              onChange={e => setSimContent(e.target.value)}
            />
            <button 
              onClick={simulateMessage}
              disabled={loading}
              className="w-full bg-whatsapp-light hover:bg-whatsapp-dark text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Classifying...' : <><Send size={16}/> Send & Classify</>}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" />
              Priority Analytics
            </h2>
            {stats && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Messages</span>
                  <span className="font-bold">{stats.total_messages}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Approval</span>
                  <span className="font-bold text-orange-600">{stats.pending_approval}</span>
                </div>
              </div>
            )}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                    {statData.map((entry, index) => (
                      <Cell key={index} fill={PRIORITY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle size={18} className="text-whatsapp-light" />
                Inbox
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Auto-refresh every 3s
              </span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {messages.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No messages yet. Simulate one from the left panel.
                </div>
              )}
              {messages.map(m => (
                <div 
                  key={m.id} 
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                    m.priority === 'URGENT' ? 'border-red-500 bg-red-50' :
                    m.priority === 'HIGH' ? 'border-orange-500 bg-orange-50' :
                    m.priority === 'NORMAL' ? 'border-green-500 bg-green-50' :
                    'border-gray-400 bg-gray-50'
                  }`}
                  onClick={() => setSelectedMsg(m)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: PRIORITY_COLORS[m.priority] }}
                      >
                        {m.priority}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{m.sender_name}</span>
                      <span className="text-xs text-gray-400">{m.sender_phone}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      m.status === 'replied' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{m.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedMsg && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-whatsapp-chat">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Clock size={18} className="text-whatsapp-light" />
                  Conversation
                </h2>
              </div>
              <div className="p-5 bg-whatsapp-chat min-h-[200px] space-y-4">
                <div className="flex justify-end">
                  <div className="bg-whatsapp-user rounded-lg rounded-tr-none px-4 py-3 max-w-[80%] shadow-sm">
                    <p className="text-sm font-medium text-gray-800 mb-1">{selectedMsg.sender_name}</p>
                    <p className="text-sm text-gray-700">{selectedMsg.content}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">{new Date(selectedMsg.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 max-w-[80%] shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-whatsapp-light">AI Agent</span>
                      <span 
                        className="text-xs text-white px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: PRIORITY_COLORS[selectedMsg.priority] }}
                      >
                        {selectedMsg.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedMsg.ai_reply}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex gap-3">
                <button 
                  onClick={() => handleApprove(selectedMsg.id, true)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Approve & Send
                </button>
                <button 
                  onClick={() => handleApprove(selectedMsg.id, false)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}