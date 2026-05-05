import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, Plus, Search, Trash2, Users, Home, MapPin, Shield, Activity, ChevronRight, Settings, BarChart3 } from 'lucide-react'
import { getCustomers, deleteCustomer, clearToken, Customer } from '../lib/api'
import ConfirmModal from '../components/ConfirmModal'

export default function AdminDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { navigate('/admin'); return }
    loadCustomers()
  }, [page, search])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const res = await getCustomers(page, search)
      setCustomers(res.data); setTotal(res.total); setTotalPages(res.total_pages)
    } catch { clearToken(); navigate('/admin') }
    finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try { await deleteCustomer(confirmDelete); setConfirmDelete(null); loadCustomers() }
    catch (err: any) { alert(err.message) }
  }

  const cities = [...new Set(customers.map(c => c.city).filter(Boolean))]
  const zoneCount = customers.reduce((s, c) => s + (c.zones?.length || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <ConfirmModal open={!!confirmDelete} title="Delete Customer" message={`Delete "${confirmDelete}"? All alarm zones will also be removed.`} confirmLabel="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />

      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-violet-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 hero-gradient rounded-lg flex items-center justify-center shadow-md">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-gray-900">Dashboard</h1>
              <p className="text-[10px] text-gray-400">{total} customers · {zoneCount} zones</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-gray-400 hover:text-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-all">← Site</Link>
            <button onClick={() => { clearToken(); navigate('/admin') }}
              className="text-xs text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Users className="w-5 h-5" />, label: 'Total Customers', value: total, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-100' },
            { icon: <Shield className="w-5 h-5" />, label: 'Alarm Zones', value: zoneCount, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-100' },
            { icon: <MapPin className="w-5 h-5" />, label: 'Cities', value: cities.length, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-100' },
            { icon: <Activity className="w-5 h-5" />, label: 'Active Panels', value: customers.filter(c => c.alarm_panel).length, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-100' },
          ].map((s, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <div className={`bg-gradient-to-br ${s.color} w-full h-full rounded-xl flex items-center justify-center text-white`}>{s.icon}</div>
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search customers by address, city, or slug..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all shadow-sm" />
          </div>
          <Link to="/admin/customers/new"
            className="inline-flex items-center gap-2 px-6 py-3 hero-gradient text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all shrink-0">
            <Plus className="w-4 h-4" /> Add Customer
          </Link>
        </div>

        {/* Customer Table */}
        {loading ? (
          <div className="text-center py-16"><div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin mx-auto" /></div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-2xl border border-gray-100">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No customers found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or add a new customer.</p>
          </div>
        ) : (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Address</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">City</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Alarm Panel</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Slug</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-violet-50/30 transition-all group">
                        <td className="px-6 py-4">
                          <Link to={`/admin/customers/${c.slug}`} className="block group/link">
                            <p className="text-sm font-medium text-gray-900 group-hover/link:text-violet-600 transition-colors">{c.address_line}</p>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">{c.city || <span className="text-gray-300">—</span>}</span>
                        </td>
                        <td className="px-6 py-4">
                          {c.alarm_panel ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium border border-violet-200">
                              <Shield className="w-3 h-3" /> {c.alarm_panel}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">No panel</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs text-gray-400 font-mono">{c.slug}</code>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/admin/customers/${c.slug}`}
                              className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all">
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                            <button onClick={() => setConfirmDelete(c.slug)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-30 transition-all">← Previous</button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === p ? 'hero-gradient text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}>{p}</button>
                  ))}
                </div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-30 transition-all">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
