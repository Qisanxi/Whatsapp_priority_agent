import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { MessageCircle, AlertTriangle, Clock, CheckCircle, XCircle, Send, Shield, User, ArrowLeft } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const PRIORITY_COLORS = {
  URGENT: '#ef4444',
  HIGH: '#f97316',
  NORMAL: '#22c55e',
  LOW: '#94a3b8'
}

export default function Dashboard() {
  const [contacts, setContacts] = useState([])
  const [selectedPhone, setSelectedPhone] = useState(null)
  const [thread, setThread] = useState([])
  const [stats, setStats] = useState(null)
  const [simContent, setSimContent] = useState('')
  const [simPhone, setSimPhone] = useState('+919999999999')
  const [loading, setLoading] = useState(false)

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API}/inbox`)
      const data = await res.json()
      setContacts(data)
    } catch (e) { console.error(e) }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/dashboard/stats`)
      const data = await res.json()
      setStats(data)
    } catch (e) { console.error(e) }
  }

  const fetchThread = async (phone) => {
    try {
      const res = await fetch(`${API}/conversations/${encodeURIComponent(phone)}`)
      const data = await res.json()
      setThread(data)
      setSelectedPhone(phone)
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    fetchContacts()
    fetchStats()
    const interval = setInterval(() => {
      fetchContacts()
      fetchStats()
      if (selectedPhone) fetchThread(selectedPhone)
    }, 3000)
    return () => clearInterval(interval)
  }, [selectedPhone])

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
      fetchContacts()
      fetchStats()
      if (selectedPhone === simPhone) fetchThread(simPhone)
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
      fetchContacts()
      if (selectedPhone) fetchThread(selectedPhone)
    } catch (e) { alert('Error: ' + e.message) }
  }

  const statData = stats ? Object.entries(stats.priority_distribution || {}).map(([name, value]) => ({
    name, value: value || 0
  })) : []

  const selectedContact = contacts.find(c => c.sender_phone === selectedPhone)

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
          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
              title="Back to landing page"
            >
              <ArrowLeft size={14} />
              About
            </Link>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-400" />
              <span>Private AI Agent</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-6">

          {/* Simulator */}
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
              {loading ? 'Classifying...' : <><Send size={16} /> Send & Classify</>}
            </button>
          </div>

          {/* Stats */}
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

        {/* MIDDLE: CONTACT LIST */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User size={18} className="text-whatsapp-light" />
                Contacts
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {contacts.length} chats
              </span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {contacts.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No contacts yet. Simulate a message.
                </div>
              )}
              {contacts.map(c => (
                <div
                  key={c.sender_phone}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedPhone === c.sender_phone ? 'bg-gray-100' : ''
                    }`}
                  onClick={() => fetchThread(c.sender_phone)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-whatsapp-light text-white flex items-center justify-center font-bold text-sm">
                      {c.sender_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800 truncate">{c.sender_name}</span>
                        <span className="text-xs text-gray-400">{new Date(c.updated_at).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: PRIORITY_COLORS[c.last_priority] }}
                        >
                          {c.last_priority}
                        </span>
                        <span className="text-xs text-gray-500 truncate flex-1">{c.last_message}</span>
                        {c.unread_count > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: CHAT THREAD */}
        <div className="lg:col-span-1 space-y-6">
          {selectedContact ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
              <div className="px-5 py-4 border-b border-gray-100 bg-whatsapp-chat flex items-center gap-3">
                <button
                  onClick={() => setSelectedPhone(null)}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div className="w-8 h-8 rounded-full bg-whatsapp-light text-white flex items-center justify-center font-bold text-xs">
                  {selectedContact.sender_name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-sm font-semibold">{selectedContact.sender_name}</h2>
                  <p className="text-xs text-gray-500">{selectedContact.sender_phone}</p>
                </div>
              </div>

              <div className="flex-1 p-4 bg-whatsapp-chat overflow-y-auto space-y-4">
                {thread.map(t => (
                  <div key={t.id} className="space-y-3">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-whatsapp-user rounded-lg rounded-tr-none px-4 py-2 max-w-[85%] shadow-sm">
                        <p className="text-sm text-gray-700">{t.content}</p>
                        <p className="text-[10px] text-gray-500 mt-1 text-right">
                          {new Date(t.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {/* AI Reply */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg rounded-tl-none px-4 py-2 max-w-[85%] shadow-sm border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-whatsapp-light">AI Agent</span>
                          <span
                            className="text-[10px] text-white px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: PRIORITY_COLORS[t.priority] }}
                          >
                            {t.priority}
                          </span>
                          {t.status === 'replied' && (t.priority === 'URGENT' || t.priority === 'HIGH') && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
                              Auto-Replied
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{t.ai_reply}</p>

                        {t.status === 'pending' && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleApprove(t.id, true)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button
                              onClick={() => handleApprove(t.id, false)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400 h-[600px] flex items-center justify-center">
              <div>
                <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Select a contact to view conversation</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
