import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Users, Loader2, CheckCircle, CreditCard, Copy, AlertTriangle, Shield, MapPin, Store, IdCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { TOURNAMENT_INFO, CONTACTS, UTR_GUIDES } from '@/lib/constants';
import { createRegistration, updateUTR, checkAadhaarDuplicates, getActiveTeamCount } from '@/lib/supabase';
import type { PlayerInfo } from '@/lib/supabase';

interface FormData {
  teamName: string;
  captainName: string;
  captainPhone: string;
  captainAadhaar: string;
  players: PlayerInfo[];
}
const emptyPlayer = (): PlayerInfo => ({ name: '', aadhaar: '' });
type Step = 'form' | 'payment' | 'success';

const STORAGE_KEY = 'kcc_register_draft';

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { formData: FormData; step: Step; registrationId: string | null; utrInput: string };
  } catch { return null; }
}

function saveDraft(data: { formData: FormData; step: Step; registrationId: string | null; utrInput: string }) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function clearDraft() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export default function RegisterPage() {
  const draft = loadDraft();
  const [step, setStep] = useState<Step>(draft?.step === 'success' ? 'form' : draft?.step || 'form');
  const [formData, setFormData] = useState<FormData>(draft?.formData || {
    teamName: '', captainName: '', captainPhone: '', captainAadhaar: '',
    players: Array.from({ length: TOURNAMENT_INFO.rosterPlayers }, emptyPlayer),
  });
  const [loading, setLoading] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(draft?.registrationId || null);
  const [utrInput, setUtrInput] = useState(draft?.utrInput || '');
  const [registrationsClosed, setRegistrationsClosed] = useState(false);
  const [teamCount, setTeamCount] = useState(0);

  const UPI_ID = 'mishrapulak.6107@okhdfcbank';
  const QR_IMAGE = '/qr-payment.png'; // Place your QR code image in public folder

  // Save draft whenever form state changes
  useEffect(() => {
    if (step === 'success') { clearDraft(); return; }
    saveDraft({ formData, step, registrationId, utrInput });
  }, [formData, step, registrationId, utrInput]);

  useEffect(() => {
    getActiveTeamCount().then((count) => {
      setTeamCount(count);
      if (count >= TOURNAMENT_INFO.maxTeams) setRegistrationsClosed(true);
    });
  }, []);

  const updatePlayer = (index: number, field: keyof PlayerInfo, value: string) => {
    const updated = [...formData.players];
    if (field === 'aadhaar') value = value.replace(/\D/g, '').slice(0, 12);
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, players: updated });
  };

  const validateForm = (): boolean => {
    if (!formData.teamName.trim()) { toast.error('टीम का नाम डालें'); return false; }
    if (!formData.captainName.trim()) { toast.error('कप्तान का नाम डालें'); return false; }
    if (!formData.captainPhone.trim() || formData.captainPhone.length < 10) { toast.error('सही फोन नंबर डालें'); return false; }
    if (formData.captainAadhaar.length !== 12) { toast.error('कप्तान का 12 अंकों का आधार डालें'); return false; }
    for (let i = 0; i < formData.players.length; i++) {
      const p = formData.players[i];
      if (!p.name.trim()) { toast.error(`खिलाड़ी ${i + 1} का नाम डालें`); return false; }
      if (p.aadhaar.length !== 12) { toast.error(`खिलाड़ी ${i + 1} का 12 अंकों का आधार डालें`); return false; }
    }
    const allAadhaars = [formData.captainAadhaar, ...formData.players.map((p) => p.aadhaar)];
    if (new Set(allAadhaars).size !== allAadhaars.length) { toast.error('एक ही आधार दो बार नहीं डाल सकते'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const count = await getActiveTeamCount();
      if (count >= TOURNAMENT_INFO.maxTeams) {
        toast.error('🚫 रजिस्ट्रेशन बंद हो गया है!');
        setRegistrationsClosed(true); setLoading(false); return;
      }
      const allPlayers: PlayerInfo[] = [
        { name: formData.captainName.trim() + ' (C)', aadhaar: formData.captainAadhaar },
        ...formData.players,
      ];
      const dups = await checkAadhaarDuplicates(allPlayers.map((p) => p.aadhaar));
      if (dups.length > 0) {
        toast.error(`कुछ खिलाड़ी पहले से रजिस्टर्ड हैं।`, { duration: 5000 });
        setLoading(false); return;
      }
      const result = await createRegistration({
        team_name: formData.teamName.trim(), captain_name: formData.captainName.trim(),
        captain_phone: formData.captainPhone.trim(), player_names: JSON.stringify(allPlayers),
        payment_status: 'pending', amount: TOURNAMENT_INFO.entryFee,
      });
      setRegistrationId(result.id!); setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('✅ टीम सबमिट हो गई! अब पेमेंट करें।');
    } catch (err) { toast.error('कुछ गड़बड़ हो गई।'); } finally { setLoading(false); }
  };

  const handleUTRSubmit = async () => {
    if (!utrInput.trim()) { toast.error('UTR नंबर डालें'); return; }
    if (!registrationId) return;
    setLoading(true);
    try {
      await updateUTR(registrationId, utrInput.trim());
      clearDraft(); setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('🎉 रजिस्ट्रेशन सबमिट!');
    } catch (err) { toast.error('कुछ गड़बड़ हो गई।'); } finally { setLoading(false); }
  };

  const copyUPI = () => { navigator.clipboard.writeText(UPI_ID); toast.success('UPI ID कॉपी हो गई!'); };
  const filledPlayers = formData.players.filter((p) => p.name.trim() && p.aadhaar.length === 12).length;
  const captainFilled = formData.captainName.trim() && formData.captainPhone.length >= 10 && formData.captainAadhaar.length === 12;

  if (registrationsClosed) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="section-container text-center w-full">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 max-w-lg mx-auto">
            <div className="text-7xl mb-6">🚫</div>
            <h1 className="text-3xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>रजिस्ट्रेशन बंद हो गया है</h1>
            <p className="text-lg font-medium" style={{ color: 'var(--color-text-secondary)' }}>सभी {TOURNAMENT_INFO.maxTeams} slots भर चुके हैं। अगले सीज़न में मिलते हैं!</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="section-title mb-4"><span className="gradient-text">🏏 टीम रजिस्ट्रेशन</span></h1>
          <p className="text-sm sm:text-base font-medium mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Entry: <span className="font-bold">{TOURNAMENT_INFO.entryFeeDisplay}</span> • {TOURNAMENT_INFO.totalPlayers} Players (1 Captain + {TOURNAMENT_INFO.rosterPlayers} Players)
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <Users size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {TOURNAMENT_INFO.maxTeams - teamCount} / {TOURNAMENT_INFO.maxTeams} spots left
            </span>
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-12">
            {[{ label: 'Details', s: 'form' }, { label: 'Payment', s: 'payment' }, { label: 'Done', s: 'success' }].map((item, i) => {
              const stepOrder = ['form', 'payment', 'success'];
              const isCurrent = item.s === step;
              const isCompleted = stepOrder.indexOf(item.s) < stepOrder.indexOf(step);
              return (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all ${
                    isCurrent ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                    isCompleted ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle size={20} /> : i + 1}
                  </div>
                  <span className="hidden sm:block text-sm font-bold tracking-wide" style={{ color: isCurrent ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>{item.label}</span>
                  {i < 2 && <div className="w-10 sm:w-16 h-1 rounded-full" style={{ background: isCompleted ? '#10b981' : 'var(--color-border)' }} />}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* ===== STEP 1: FORM ===== */}
            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                
                {/* Team Name */}
                <div className="glass-card animated-border p-6 sm:p-10 mb-10">
                  <h3 className="text-xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    🏏 Team Information
                  </h3>
                  <div>
                    <label className="form-label mb-3">टीम का नाम / Team Name</label>
                    <div className="relative">
                      <input type="text" className="input-field !pl-11 !py-3.5" placeholder="e.g. Royal Strikers" value={formData.teamName} onChange={(e) => setFormData({ ...formData, teamName: e.target.value })} />
                      <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                  </div>
                </div>

                {/* Captain Details */}
                <div className="glass-card animated-border p-6 sm:p-10 mb-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                      👑 Captain Details
                    </h3>
                    {captainFilled && (
                      <span className="text-xs font-bold px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        ✅ Complete
                      </span>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label mb-3">👤 कप्तान का नाम / Captain's Name</label>
                        <div className="relative">
                          <input type="text" className="input-field !pl-11 !py-3.5" placeholder="Full Name" value={formData.captainName} onChange={(e) => setFormData({ ...formData, captainName: e.target.value })} />
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                        </div>
                      </div>
                      <div>
                        <label className="form-label mb-3">📱 फोन नंबर / Phone Number</label>
                        <div className="relative">
                          <input type="tel" className="input-field !pl-11 !py-3.5" placeholder="10 Digits" maxLength={10} value={formData.captainPhone} onChange={(e) => setFormData({ ...formData, captainPhone: e.target.value.replace(/\D/g, '') })} />
                          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="form-label mb-3">🪪 कप्तान का आधार / Captain's Aadhaar</label>
                      <div className="relative">
                        <input type="text" inputMode="numeric" className="input-field !pl-11 !py-3.5 font-mono tracking-widest" placeholder="12 Digit Aadhaar Number" maxLength={12} value={formData.captainAadhaar} onChange={(e) => setFormData({ ...formData, captainAadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) })} />
                        <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                        {formData.captainAadhaar.length === 12 && <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Players Section (11 players excluding captain) */}
                <div className="glass-card p-6 sm:p-10 mb-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                      👥 Players ({TOURNAMENT_INFO.rosterPlayers})
                    </h3>
                    <span className={`text-xs font-bold px-4 py-2 rounded-lg ${filledPlayers === TOURNAMENT_INFO.rosterPlayers ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                      {filledPlayers} of {TOURNAMENT_INFO.rosterPlayers} Completed
                    </span>
                  </div>

                  <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    कप्तान के अलावा {TOURNAMENT_INFO.rosterPlayers} खिलाड़ियों की जानकारी भरें (Excluding Captain)
                  </p>

                  <div className="space-y-5">
                    {formData.players.map((player, i) => (
                      <div key={i} className="p-5 sm:p-6 rounded-2xl border transition-all" style={{ background: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}>
                        <div className="mb-4 flex items-center gap-3">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${i < (TOURNAMENT_INFO.playingPlayers - 1) ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400'}`}>
                            {i < (TOURNAMENT_INFO.playingPlayers - 1) ? `Player ${i + 1} • Playing` : `Player ${i + 1} • Substitute`}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" className="input-field !py-3" placeholder="Full Name" value={player.name} onChange={(e) => updatePlayer(i, 'name', e.target.value)} />
                          <div className="relative">
                            <input type="text" inputMode="numeric" className="input-field !py-3 font-mono tracking-widest" placeholder="Aadhaar Number (12)" maxLength={12} value={player.aadhaar} onChange={(e) => updatePlayer(i, 'aadhaar', e.target.value)} />
                            {player.aadhaar.length === 12 && <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={loading} className="btn-gold w-full text-lg py-4 mt-2 shadow-lg shadow-amber-500/20">
                  {loading ? <Loader2 size={24} className="animate-spin" /> : <CreditCard size={24} />}
                  {loading ? 'Processing...' : `Pay ${TOURNAMENT_INFO.entryFeeDisplay} & Register`}
                </button>
              </motion.div>
            )}

            {/* ===== STEP 2: PAYMENT ===== */}
            {step === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                {/* UPI Payment */}
                <div className="glass-card animated-border p-8 sm:p-10 mb-8">
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                      <CreditCard size={32} className="text-amber-500" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                      पेमेंट करें
                    </h3>
                    <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
                      UPI से <span className="text-amber-600 dark:text-amber-400 font-bold text-xl">{TOURNAMENT_INFO.entryFeeDisplay}</span> भेजें
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Amount */}
                    <div className="p-6 rounded-xl text-center" style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-border)' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Amount</p>
                      <p className="text-4xl font-black text-amber-600 dark:text-amber-400" style={{ fontFamily: 'var(--font-heading)' }}>
                        {TOURNAMENT_INFO.entryFeeDisplay}
                      </p>
                    </div>

                    {/* Pay using App - PRIMARY */}
                    <a
                      href={`upi://pay?pa=${UPI_ID}&pn=KCC%20Tournament&am=${TOURNAMENT_INFO.entryFee}&cu=INR&tn=KCC%20Season%202%20-%20${encodeURIComponent(formData.teamName)}`}
                      className="btn-gold w-full text-lg py-5 flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20 no-underline"
                    >
                      <CreditCard size={24} />
                      📱 Pay using App
                    </a>
                    <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                      यह बटन आपके फोन पर UPI ऐप (GPay, PhonePe, Paytm) खोलेगा
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>OR</span>
                      <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                    </div>

                    {/* QR Code - Centered */}
                    <div className="flex flex-col items-center p-8 rounded-xl" style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-border)' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Scan QR to Pay</p>
                      <img src={QR_IMAGE} alt="Payment QR Code" className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl object-contain border" style={{ borderColor: 'var(--color-border)', background: '#fff' }} />
                      <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>QR Code से स्कैन करके पेमेंट करें</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>OR</span>
                      <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                    </div>

                    {/* UPI ID - Copy */}
                    <div className="p-6 rounded-xl" style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-border)' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>UPI ID</p>
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{UPI_ID}</code>
                        <button onClick={copyUPI} className="p-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition border-none cursor-pointer bg-transparent" style={{ color: 'var(--color-text-secondary)' }}>
                          <Copy size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/15 flex items-start gap-4">
                      <Store size={20} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>ऑफलाइन पेमेंट?</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          यहाँ विजिट करें: <br />
                          <a href={TOURNAMENT_INFO.locationLink} target="_blank" rel="noopener noreferrer" className="text-purple-700 dark:text-purple-300 font-bold hover:underline">
                            📍 {TOURNAMENT_INFO.offlinePaymentAddress}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UTR Guide */}
                <div className="glass-card p-8 sm:p-10 mb-8">
                  <h3 className="text-lg font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    📖 UTR नंबर कहाँ मिलेगा?
                  </h3>
                  <div className="space-y-4">
                    {UTR_GUIDES.map((guide, i) => (
                      <div key={i} className={`p-5 rounded-xl ${guide.bg} border ${guide.border}`}>
                        <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${guide.color}`}>
                          <span className="text-lg">{guide.icon}</span> {guide.app}
                        </h4>
                        <ol className="space-y-2 pl-1">
                          {guide.steps.map((s, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${guide.bg} ${guide.color}`}>
                                {j + 1}
                              </span>
                              {s}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UTR Input */}
                <div className="glass-card animated-border p-8 sm:p-10 mb-6">
                  <div className="p-5 mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      <p className="font-bold text-red-600 dark:text-red-400 mb-1">⚠️ ज़रूरी सूचना / Important</p>
                      <p>बिना UTR नंबर के रजिस्ट्रेशन पूरा नहीं होगा। पेमेंट करने के बाद <strong style={{ color: 'var(--color-text-primary)' }}>UTR/Transaction Reference Number</strong> (12 अंक) नीचे दर्ज करें। UTR सबमिट करने के बाद ही आपकी टीम Admin को वेरिफिकेशन के लिए भेजी जाएगी।</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="form-label">UTR / Transaction Reference Number</label>
                    <input type="text" className="input-field font-mono text-lg tracking-widest" placeholder="e.g. 425698741258"
                      value={utrInput} onChange={(e) => setUtrInput(e.target.value)} />
                  </div>

                  <button onClick={handleUTRSubmit} disabled={loading} className="btn-primary w-full text-lg py-4">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                    {loading ? 'Submitting...' : 'Submit UTR & Complete Registration'}
                  </button>
                </div>

                <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
                  समस्या? <a href="https://wa.me/919984671212" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">WhatsApp करें</a>
                  {' '}या कॉल करें: <a href="tel:+919984671212" className="text-emerald-600 dark:text-emerald-400 hover:underline">9984671212</a>
                </p>
              </motion.div>
            )}

            {/* ===== STEP 3: SUCCESS ===== */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 sm:p-12 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, delay: 0.2 }} className="success-checkmark">
                  <CheckCircle size={44} className="text-white" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    🎉 Submission Received!
                  </h3>
                  <p className="text-base mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    टीम <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formData.teamName}</span> की डिटेल्स सबमिट हो गई हैं!
                  </p>
                  <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'var(--color-text-muted)' }}>
                    हम आपका UTR वेरिफाई कर रहे हैं। वेरिफिकेशन की स्थिति जानने के लिए वेबसाइट पर <strong className="text-emerald-600 dark:text-emerald-400">Teams</strong> सेक्शन चेक करें। ✅
                  </p>

                  <div className="p-6 rounded-xl text-left mb-10 mx-auto max-w-sm" style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-border)' }}>
                    <div className="grid grid-cols-2 gap-5 text-sm">
                      <div><p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Team</p><p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{formData.teamName}</p></div>
                      <div><p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Captain</p><p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{formData.captainName}</p></div>
                      <div><p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Phone</p><p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{formData.captainPhone}</p></div>
                      <div><p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Players</p><p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{TOURNAMENT_INFO.totalPlayers}</p></div>
                    </div>
                  </div>

                  <a href={`https://wa.me/919984671212?text=KCC+Season+2+-+Team+${encodeURIComponent(formData.teamName)}+registered!`}
                    target="_blank" rel="noopener noreferrer" className="btn-primary text-lg py-4 px-8">
                    📱 WhatsApp पर कन्फर्म करें
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}