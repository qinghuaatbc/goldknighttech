import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Save, Pencil, X, Check, FileText, Mail, MessageSquare, ChevronDown, Home, Shield, MapPin, Clock } from 'lucide-react'
import { getAdminCustomer, updateCustomer, createCustomer, createZone, deleteZone, deleteCustomer } from '../lib/api'
import ConfirmModal from '../components/ConfirmModal'
import { jsPDF } from 'jspdf'

const emptyForm = { slug: '', address_line: '', city: '', alarm_panel: '', image: '' }

export default function CustomerDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isNew = slug === 'new'
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(!isNew)
  const [form, setForm] = useState(emptyForm)
  const [zoneLang, setZoneLang] = useState('en')
  const [filterLang, setFilterLang] = useState('all')
  const [newZone, setNewZone] = useState({ zone_key: '', description: '' })
  const [editingZone, setEditingZone] = useState<string | null>(null)
  const [editZoneDesc, setEditZoneDesc] = useState('')
  const [editZoneLang, setEditZoneLang] = useState('en')
  const [saving, setSaving] = useState(false)
  const [confirmSave, setConfirmSave] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmZoneDelete, setConfirmZoneDelete] = useState<string | null>(null)
  const [actionOpen, setActionOpen] = useState(false)
  const actionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isNew) loadCustomer(); else setLoading(false)
  }, [slug])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) setActionOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const loadCustomer = async () => {
    try {
      const c = await getAdminCustomer(slug!)
      setCustomer(c)
      setForm({ slug: c.slug, address_line: c.address_line, city: c.city, alarm_panel: c.alarm_panel, image: c.image || '' })
    } catch { navigate('/admin/dashboard') }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    setConfirmSave(false); setSaving(true)
    try {
      if (isNew) { await createCustomer(form); navigate(`/admin/customers/${form.slug}`) }
      else { await updateCustomer(slug!, form); loadCustomer() }
    } catch (err: any) { alert(err.message) }
    finally { setSaving(false) }
  }

  const handleAddZone = async () => {
    if (!newZone.zone_key) return
    try { await createZone(slug!, { ...newZone, lang: zoneLang }); setNewZone({ zone_key: '', description: '' }); loadCustomer() }
    catch (err: any) { alert(err.message) }
  }

  const handleEditZone = async (zoneKey: string) => {
    if (!editZoneDesc.trim()) return
    try { await createZone(slug!, { zone_key: zoneKey, description: editZoneDesc, lang: editZoneLang }); setEditingZone(null); loadCustomer() }
    catch (err: any) { alert(err.message) }
  }

  const startEditZone = (zoneKey: string, desc: string, lang: string) => {
    setEditingZone(zoneKey); setEditZoneDesc(desc); setEditZoneLang(lang)
  }

  const handleDeleteZone = async () => {
    if (!confirmZoneDelete) return
    try { await deleteZone(slug!, confirmZoneDelete); setConfirmZoneDelete(null); loadCustomer() }
    catch (err: any) { alert(err.message) }
  }

  const handleDelete = async () => {
    setConfirmDelete(false)
    try { await deleteCustomer(slug!); navigate('/admin/dashboard') }
    catch (err: any) { alert(err.message) }
  }

  const generatePDF = () => {
    if (!customer) return
    const doc = new jsPDF()
    const pageW = doc.internal.pageSize.getWidth()
    doc.setFillColor(124, 58, 237); doc.rect(0, 0, pageW, 40, 'F')
    doc.setTextColor(255,255,255); doc.setFontSize(20); doc.setFont('helvetica','bold')
    doc.text('Gold Knight Tech', pageW/2, 18, {align:'center'})
    doc.setFontSize(10); doc.setFont('helvetica','normal')
    doc.text('Customer Report', pageW/2, 30, {align:'center'})
    doc.setTextColor(51,51,51); doc.setFontSize(14); doc.setFont('helvetica','bold')
    doc.text('Customer Information', 14, 55)
    doc.setFontSize(10); doc.setFont('helvetica','normal')
    const info = [['Address', customer.address_line],['City', customer.city],['Alarm Panel', customer.alarm_panel],['Slug', customer.slug]]
    let y = 65
    info.forEach(([l,v]) => { doc.setFont('helvetica','bold'); doc.text(`${l}:`,14,y); doc.setFont('helvetica','normal'); doc.text(String(v||'-'),55,y); y+=8 })
    y += 5; doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.text('Alarm Zones',14,y); y+=8
    if (customer.zones?.length) {
      doc.setFillColor(243,244,246); doc.rect(14,y-5,pageW-28,7,'F')
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.text('Key',18,y); doc.text('Description',55,y); y+=8
      doc.setFont('helvetica','normal'); doc.setFontSize(8)
      customer.zones.forEach((z:any) => { doc.text(z.zone_key,18,y); doc.text(z.description,55,y); y+=6; if(y>270){doc.addPage();y=20} })
    }
    doc.setFontSize(8); doc.setTextColor(150,150,150)
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Gold Knight Tech`,14,290)
    doc.save(`customer-${customer.slug}.pdf`)
  }

  const sendEmail = () => {
    if (!customer) return
    // First download the PDF
    generatePDF()
    const zoneCount = customer.zones?.length || 0
    const body = `Dear Client,

Thank you for choosing Gold Knight Tech, Vancouver's trusted smart home partner since 2014.

Please find attached the customer report for ${customer.address_line} (${customer.city}).

Report Summary:
- Address: ${customer.address_line}
- City: ${customer.city}
- Alarm System: ${customer.alarm_panel || 'Not configured'}
- Total Alarm Zones: ${zoneCount}

Should you have any questions or require further assistance, please do not hesitate to contact us.

Best regards,
Gold Knight Tech
Vancouver, BC | info@goldknighttech.com | www.goldknighttech.com`
    window.open(`mailto:?subject=Customer Report - ${customer.address_line}&body=${encodeURIComponent(body)}`)
    setActionOpen(false)
  }

  const sendSMS = () => {
    if (!customer) return
    // First download the PDF
    generatePDF()
    const zoneCount = customer.zones?.length || 0
    const msg = `Gold Knight Tech - Report for ${customer.address_line}. Alarm: ${customer.alarm_panel||'N/A'}, ${zoneCount} zones. PDF report downloaded. Contact: info@goldknighttech.com`
    window.open(`sms:?body=${encodeURIComponent(msg)}`)
    setActionOpen(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-pink-50"><div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" /></div>
  if (!customer && !isNew) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-pink-50 text-gray-400">Customer not found</div>

  const langLabels: Record<string, string> = { en: 'EN', zh: '中文', fa: 'فارسی' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <ConfirmModal open={confirmSave} title={isNew?'Create Customer':'Save Changes'} message={isNew?'Create this customer?':'Save changes?'} confirmLabel={isNew?'Create':'Save'} variant="info" onConfirm={handleSave} onCancel={()=>setConfirmSave(false)} />
      <ConfirmModal open={confirmDelete} title="Delete Customer" message={`Delete "${customer?.address_line}"?`} confirmLabel="Delete" variant="danger" onConfirm={handleDelete} onCancel={()=>setConfirmDelete(false)} />
      <ConfirmModal open={!!confirmZoneDelete} title="Delete Zone" message={`Delete zone "${confirmZoneDelete}"?`} confirmLabel="Delete" variant="danger" onConfirm={handleDeleteZone} onCancel={()=>setConfirmZoneDelete(null)} />

      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-violet-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-violet-600 hover:border-violet-200 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-gray-900 truncate max-w-md">{isNew ? 'New Customer' : customer?.address_line}</h1>
              {!isNew && <p className="text-[10px] text-gray-400">Created {new Date(customer.created_at).toLocaleDateString()}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isNew && (
              <div className="relative" ref={actionRef}>
                <button onClick={()=>setActionOpen(!actionOpen)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-white hover:border-violet-300 transition-all">
                  <FileText className="w-4 h-4" /> PDF <ChevronDown className="w-3 h-3" />
                </button>
                {actionOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1 overflow-hidden">
                    <button onClick={()=>{generatePDF();setActionOpen(false)}} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 transition-all"><FileText className="w-4 h-4 text-violet-500" /> Download PDF</button>
                    <button onClick={sendEmail} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 transition-all"><Mail className="w-4 h-4 text-blue-500" /> Send Email</button>
                    <button onClick={sendSMS} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 transition-all"><MessageSquare className="w-4 h-4 text-green-500" /> Send SMS</button>
                  </div>
                )}
              </div>
            )}
            <button onClick={()=>setConfirmSave(true)} disabled={!form.address_line}
              className="inline-flex items-center gap-2 px-5 py-2 hero-gradient text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50">
              <Save className="w-4 h-4" /> {isNew ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Customer Info Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center text-white shadow-md"><Home className="w-5 h-5" /></div>
            <h2 className="font-display font-bold text-gray-900 text-lg">Customer Information</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isNew && (
              <div className="lg:col-span-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Slug</label>
                <input type="text" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} placeholder="e.g. 1234main" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all bg-white" />
              </div>
            )}
            <div className={isNew?'':''}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Address</label>
              <input type="text" value={form.address_line} onChange={e=>setForm(f=>({...f,address_line:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">City</label>
              <input type="text" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Alarm Panel</label>
              <input type="text" value={form.alarm_panel} onChange={e=>setForm(f=>({...f,alarm_panel:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Image URL</label>
              <input type="text" value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all bg-white" />
            </div>
          </div>
          {form.image && (
            <div className="mt-4">
              <img src={form.image} alt="" className="h-28 w-auto rounded-xl object-cover border border-gray-200" onError={e=>(e.currentTarget.style.display='none')} />
            </div>
          )}
        </div>

        {/* Zones Card */}
        {!isNew && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center text-white shadow-md"><Shield className="w-5 h-5" /></div>
                <h2 className="font-display font-bold text-gray-900 text-lg">Alarm Zones</h2>
                <span className="px-2.5 py-1 rounded-lg bg-violet-100 text-violet-700 text-xs font-medium">{customer?.zones?.length || 0} zones</span>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                {(['all','en','zh','fa'] as const).map(l => (
                  <button key={l} onClick={()=>setFilterLang(l)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      filterLang===l ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600'
                    }`}>{l==='all'?'All':langLabels[l]}</button>
                ))}
              </div>
            </div>

            {/* Add Zone */}
            <div className="flex gap-2.5 mb-6 p-4 bg-violet-50/50 rounded-xl border border-violet-100/50">
              <input type="text" value={newZone.zone_key} onChange={e=>setNewZone(z=>({...z,zone_key:e.target.value}))} placeholder="Key (z01)" className="w-24 px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:border-violet-500 outline-none bg-white" />
              <input type="text" value={newZone.description} onChange={e=>setNewZone(z=>({...z,description:e.target.value}))} placeholder="Zone description" className="flex-1 px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:border-violet-500 outline-none bg-white" />
              <select value={zoneLang} onChange={e=>setZoneLang(e.target.value)} className="w-20 px-2 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:border-violet-500 outline-none">
                <option value="en">EN</option><option value="zh">中文</option><option value="fa">فارسی</option>
              </select>
              <button onClick={handleAddZone} className="inline-flex items-center gap-1.5 px-4 py-2 hero-gradient text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"><Plus className="w-4 h-4" /> Add</button>
            </div>

            {/* Zone Table */}
            {(!customer?.zones || customer.zones.length === 0) ? (
              <p className="text-sm text-gray-400 text-center py-8">No alarm zones configured. Add one above.</p>
            ) : (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Key</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Description</th>
                      <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 w-20">Lang</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {customer.zones
                      .filter((z:any) => filterLang === 'all' || z.lang === filterLang)
                      .map((z:any) => (
                      <tr key={z.zone_key+(z.lang||'en')} className="hover:bg-violet-50/20 transition-all group">
                        <td className="px-5 py-3"><code className="text-sm font-mono font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded">{z.zone_key}</code></td>
                        <td className="px-5 py-3">
                          {editingZone === z.zone_key+(z.lang||'en') ? (
                            <div className="flex gap-1.5">
                              <input type="text" value={editZoneDesc} onChange={e=>setEditZoneDesc(e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-violet-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 bg-white"
                                autoFocus onKeyDown={e=>e.key==='Enter'&&handleEditZone(z.zone_key)} />
                              <button onClick={()=>handleEditZone(z.zone_key)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
                              <button onClick={()=>setEditingZone(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-700">{z.description}</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            z.lang==='zh'?'bg-red-50 text-red-600':z.lang==='fa'?'bg-emerald-50 text-emerald-600':'bg-violet-50 text-violet-600'
                          }`}>{langLabels[z.lang]||'EN'}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>startEditZone(z.zone_key,z.description,z.lang||'en')}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={()=>setConfirmZoneDelete(z.zone_key)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
