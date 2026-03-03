import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Phone, Users, Loader2, RefreshCw, User, CreditCard, Lock, Eye, EyeOff, Plus, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { TOURNAMENT_INFO } from '@/lib/constants';
import { getAllRegistrations, verifyPayment, rejectPayment, createRegistration, getVerifiedTeamCount } from '@/lib/supabase';
import type { Registration, PlayerInfo } from '@/lib/supabase';

const ADMIN_USERNAME = '9984671212';
const ADMIN_PASSWORD = 'Pulak.123';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'failed'>('all');

  const [newTeam, setNewTeam] = useState({ teamName: '', captainName: '', captainPhone: '' });
  const [newPlayers, setNewPlayers] = useState<PlayerInfo[]>(
    Array.from({ length: TOURNAMENT_INFO.totalPlayers }, () => ({ name: '', aadhaar: '' }))
  );

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    const [regs, count] = await Promise.all([getAllRegistrations(), getVerifiedTeamCount()]);
    setRegistrations(regs);
    setVerifiedCount(count);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchData]);

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('🔓 Admin access granted');
    } else {
      toast.error('गलत username या password');
    }
  };

  const handleVerify = async (id: string) => {
    setLoading(true);
    try {
      await verifyPayment(id);
      toast.success('✅ पेमेंट वेरिफाइड! टीम रजिस्टर्ड।');
      fetchData();
      setSelectedReg(null);
    } catch { toast.error('Error'); }
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    try {
      await rejectPayment(id);
      toast.success('❌ रजिस्ट्रेशन रिजेक्ट किया गया');
      fetchData();
      setSelectedReg(null);
    } catch { toast.error('Error'); }
    setLoading(false);
  };

  const handleAddTeam = async () => {
    if (!newTeam.teamName.trim() || !newTeam.captainName.trim()) { toast.error('टीम और कप्तान का नाम डालें'); return; }
    for (let i = 0; i < newPlayers.length; i++) {
      if (!newPlayers[i].name.trim() || newPlayers[i].aadhaar.length !== 12) { toast.error(`Player ${i + 1} incomplete`); return; }
    }
    setLoading(true);
    try {
      await createRegistration({
        team_name: newTeam.teamName.trim(), captain_name: newTeam.captainName.trim(),
        captain_phone: newTeam.captainPhone.trim() || 'N/A', player_names: JSON.stringify(newPlayers),
        payment_status: 'verified', amount: TOURNAMENT_INFO.entryFee, utr_number: 'OFFLINE/ADMIN',
      });
      toast.success('✅ टीम add की गई! (Auto-verified)');
      setShowAddTeam(false); setNewTeam({ teamName: '', captainName: '', captainPhone: '' });
      setNewPlayers(Array.from({ length: TOURNAMENT_INFO.totalPlayers }, () => ({ name: '', aadhaar: '' })));
      fetchData();
    } catch (err: any) { toast.error(err?.message || 'Error adding team'); }
    setLoading(false);
  };

  const filteredRegs = filter === 'all' ? registrations : registrations.filter((r) => r.payment_status === filter);
  const pendingCount = registrations.filter((r) => r.payment_status === 'pending').length;

  if (!isAuthenticated) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="section-container w-full">
          <div className="max-w-md mx-auto text-center glass-card p-8 sm:p-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-24 h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-8">
                <Lock size={40} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>Admin Panel</h1>
              <p className="text-base mb-8" style={{ color: 'var(--color-text-muted)' }}>Login to access the dashboard</p>

              <div className="mb-4">
                <input
                  type="text"
                  className="input-field text-center text-lg"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <div className="relative mb-6">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-14 text-center text-lg"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button onClick={handleLogin} className="btn-primary w-full text-lg py-4">
                <Shield size={20} /> Access Dashboard
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              🛡️ Dashboard
            </h1>
            <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>Manage registrations and payments</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchData} disabled={refreshing} className="btn-outline !py-2.5 !px-5 flex-1 md:flex-none">
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => setShowAddTeam(true)} className="btn-primary !py-2.5 !px-5 flex-1 md:flex-none">
              <Plus size={16} /> Add Team
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {[
            { label: 'Total Registrations', value: registrations.length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Pending Verification', value: pendingCount, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { label: 'Verified Teams', value: verifiedCount, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            { label: 'Spots Remaining', value: TOURNAMENT_INFO.maxTeams - verifiedCount, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
          ].map((s, i) => (
            <div key={i} className={`admin-card text-center p-6 sm:p-8 ${s.bg}`}>
              <p className={`text-4xl sm:text-5xl font-black mb-2 ${s.color}`} style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4 hide-scrollbar">
          {(['all', 'pending', 'verified', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border-none cursor-pointer whitespace-nowrap ${
                filter === f
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'hover:bg-black/[0.04] dark:hover:bg-white/5'
              }`}
              style={filter !== f ? { background: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' } : {}}
            >
              {f === 'all' ? `All (${registrations.length})` :
               f === 'pending' ? `⏳ Pending (${pendingCount})` :
               f === 'verified' ? `✅ Verified (${verifiedCount})` :
               `❌ Rejected`}
            </button>
          ))}
        </div>

        {/* Registration List */}
        <div className="space-y-5">
          {filteredRegs.length === 0 && (
            <div className="text-center py-20 glass-card" style={{ color: 'var(--color-text-muted)' }}>
              <Users size={48} className="mx-auto mb-6 opacity-20" />
              <p className="text-lg font-medium">No registrations found in this category.</p>
            </div>
          )}

          {filteredRegs.map((reg) => {
            let players: PlayerInfo[] = [];
            try { players = JSON.parse(reg.player_names); } catch {}
            return (
              <motion.div key={reg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-card !p-5 sm:!p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h3 className="font-bold text-lg sm:text-xl truncate" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>{reg.team_name}</h3>
                      <span className={`status-badge px-3 py-1.5 text-xs sm:text-sm ${
                        reg.payment_status === 'verified' ? 'status-verified' :
                        reg.payment_status === 'pending' ? 'status-pending' : 'status-failed'
                      }`}>
                        {reg.payment_status === 'verified' ? '✅ Verified' :
                         reg.payment_status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <span className="flex items-center gap-2 font-medium"><User size={14} /> {reg.captain_name}</span>
                      <span className="flex items-center gap-2 font-medium"><Phone size={14} /> {reg.captain_phone}</span>
                      <span className="flex items-center gap-2 font-medium"><Users size={14} /> {players.length} Players</span>
                      {reg.utr_number ? (
                        <span className="flex items-center gap-2 font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-md font-bold">
                          <CreditCard size={14} /> UTR: {reg.utr_number}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-md font-bold text-xs border border-red-200 dark:border-red-500/20">
                          ⚠️ No UTR Submitted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => setSelectedReg(selectedReg?.id === reg.id ? null : reg)} className="btn-outline !py-2.5 !px-5 text-sm flex-1 lg:flex-none">
                      {selectedReg?.id === reg.id ? 'Hide Details' : 'View Players'}
                    </button>

                    {reg.payment_status === 'pending' && (
                      <>
                        <button onClick={() => handleVerify(reg.id!)} disabled={loading} className="btn-primary !bg-emerald-500 !py-2.5 !px-5 text-sm flex-1 lg:flex-none">
                          <CheckCircle size={16} /> Verify
                        </button>
                        <button onClick={() => handleReject(reg.id!)} disabled={loading} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm border-none cursor-pointer hover:bg-red-600 transition-colors">
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedReg?.id === reg.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Roster Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          {players.map((p, j) => (
                            <div key={j} className="flex items-center gap-3 p-3.5 rounded-xl text-sm border" style={{ background: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}>
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                j < TOURNAMENT_INFO.playingPlayers
                                  ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400'
                              }`}>
                                {j < TOURNAMENT_INFO.playingPlayers ? `P${j + 1}` : `S${j - TOURNAMENT_INFO.playingPlayers + 1}`}
                              </span>
                              <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{p.name}</span>
                              <span className="font-mono ml-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.aadhaar}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs mt-4 font-medium" style={{ color: 'var(--color-text-muted)' }}>
                          Registered on: {new Date(reg.created_at!).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ===== ADD TEAM MODAL ===== */}
        <AnimatePresence>
          {showAddTeam && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowAddTeam(false); }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass-card p-6 sm:p-10 w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    <UserPlus size={24} /> Direct Team Entry
                  </h3>
                  <button onClick={() => setShowAddTeam(false)} className="p-2 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/10 transition-colors border-none cursor-pointer bg-transparent" style={{ color: 'var(--color-text-muted)' }}>
                    <X size={24} />
                  </button>
                </div>

                <div className="overflow-y-auto pr-2 flex-1 hide-scrollbar space-y-8">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/15">
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      ⚡ Teams added here are <strong>automatically verified</strong>. Use this for offline/cash payments collected by admins.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="form-label">Team Name</label>
                      <input type="text" className="input-field" placeholder="Enter Team Name" value={newTeam.teamName} onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="form-label">Captain's Name</label>
                        <input type="text" className="input-field" placeholder="Captain's Name" value={newTeam.captainName} onChange={(e) => setNewTeam({ ...newTeam, captainName: e.target.value })} />
                      </div>
                      <div>
                        <label className="form-label">Phone Number (Optional)</label>
                        <input type="tel" className="input-field" placeholder="10-digit number" value={newTeam.captainPhone} onChange={(e) => setNewTeam({ ...newTeam, captainPhone: e.target.value.replace(/\D/g, '') })} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>Roster ({TOURNAMENT_INFO.totalPlayers} Players)</h4>
                    <div className="space-y-4">
                      {newPlayers.map((p, i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border" style={{ background: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}>
                          <span className={`w-full sm:w-12 py-1.5 sm:py-2 text-center text-xs font-bold rounded-lg ${
                            i < TOURNAMENT_INFO.playingPlayers
                              ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                              : 'bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400'
                          }`}>{i < TOURNAMENT_INFO.playingPlayers ? `P${i+1}` : `S${i-TOURNAMENT_INFO.playingPlayers+1}`}</span>
                          <input type="text" className="input-field flex-1" placeholder="Full Name" value={p.name}
                            onChange={(e) => { const u = [...newPlayers]; u[i] = { ...u[i], name: e.target.value }; setNewPlayers(u); }} />
                          <input type="text" inputMode="numeric" className="input-field flex-1 font-mono" placeholder="Aadhaar (12 digits)" maxLength={12} value={p.aadhaar}
                            onChange={(e) => { const u = [...newPlayers]; u[i] = { ...u[i], aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) }; setNewPlayers(u); }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-2 border-t flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                  <button onClick={handleAddTeam} disabled={loading} className="btn-primary w-full text-lg py-4">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                    {loading ? 'Adding Team...' : 'Submit & Verify Team'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}