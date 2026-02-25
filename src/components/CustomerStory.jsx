'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, Phone, MapPin, DollarSign, ShoppingCart,
  ArrowRight, CheckCircle2, Link2, Tag, Globe, Smartphone,
  BarChart3, Zap, Clock, Eye, Shield
} from 'lucide-react';
import { useMDFStore } from '@/store/store';
import { DATA_CLASS_COLORS } from '@/store/sourceCatalog';
import IdentityGraphVisual from './IdentityGraphVisual';
import SourceLineageTimeline from './SourceLineageTimeline';
import JourneyReplay from './JourneyReplay';
import ConflictResolution from './ConflictResolution';

export default function CustomerStory({ profile }) {
  const clearProfile = useMDFStore((s) => s.clearProfile);

  if (!profile) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
          onClick={clearProfile}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card p-0"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 p-4 sm:p-6 border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="flex items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--gradient-primary)' }}>
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-slate-900 leading-tight">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-sm sm:text-lg font-medium text-slate-500">Golden Record</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {profile.sources.map((s) => (
                      <span key={s} className="badge badge-source">{s}</span>
                    ))}
                    {/* Match Confidence */}
                    {profile.matchConfidence && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-bold border ${
                        profile.matchConfidence === 'high' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        profile.matchConfidence === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <Shield size={10} />
                        {profile.matchConfidence.toUpperCase()} CONFIDENCE
                      </span>
                    )}
                  </div>
                  {/* Data Class Badges */}
                  {profile.dataClasses && profile.dataClasses.length > 0 && (
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {profile.dataClasses.map((dc) => {
                        const dcStyle = DATA_CLASS_COLORS[dc];
                        if (!dcStyle) return null;
                        return (
                          <span key={dc} className={`inline-flex items-center px-1.5 py-0.5 rounded text-sm font-bold ${dcStyle.bg} ${dcStyle.text} ${dcStyle.border} border`}>
                            {dcStyle.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={clearProfile}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* The Customer Story */}
            <div className="glass-card-sm p-4 sm:p-5 bg-indigo-50/50 border-indigo-100">
              <h3 className="text-base sm:text-lg font-bold text-indigo-600 uppercase tracking-wider mb-2">
                📖 The Customer Story
              </h3>
              <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">
                <strong>{profile.firstName} {profile.lastName}</strong> was created by merging{' '}
                <strong>{profile.recordCount} source records</strong> across{' '}
                {profile.sources.join(', ')}. Records arrived via{' '}
                {profile.ingestionTypes.map((t, i) => (
                  <span key={t}>
                    {i > 0 && ' and '}
                    <strong className={t === 'Realtime' ? 'text-cyan-600' : 'text-amber-600'}>
                      {t} Ingestion
                    </strong>
                  </span>
                ))}
                . The MDF cleaned formatting inconsistencies, resolved identities across systems, and
                produced this unified Golden Record powering downstream MarTech activation.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Lifetime Value', value: `$${profile.ltv.toLocaleString()}`, icon: DollarSign, color: '#10b981' },
                { label: 'Total Spend', value: `$${profile.totalSpend.toLocaleString()}`, icon: ShoppingCart, color: '#6366f1' },
                { label: 'Lead Score', value: profile.leadScore, icon: BarChart3, color: '#f59e0b' },
                { label: 'Sources Merged', value: profile.recordCount, icon: Link2, color: '#8b5cf6' },
              ].map((metric) => (
                <div key={metric.label} className="glass-card-sm p-4 text-center bg-white border-slate-200">
                  <metric.icon size={20} style={{ color: metric.color }} className="mx-auto mb-2" />
                  <p className="text-3xl font-black text-slate-900">{metric.value}</p>
                  <p className="text-base font-medium text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="glass-card-sm p-4 sm:p-5 bg-white border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {profile.email && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Mail size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className="text-base sm:text-lg font-medium text-slate-700 truncate">{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Phone size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className="text-base sm:text-lg font-medium text-slate-700">{profile.phone}</span>
                  </div>
                )}
                {profile.city && (
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-indigo-500" />
                    <span className="text-lg font-medium text-slate-700">{profile.city}, {profile.state}</span>
                  </div>
                )}
                {profile.status && (
                  <div className="flex items-center gap-3">
                    <Tag size={16} className="text-indigo-500" />
                    <span className="text-lg font-medium text-slate-700">Status: {profile.status}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Before & After: Data Hygiene */}
            {profile.hygieneExamples.length > 0 && (
              <div className="glass-card-sm p-5 bg-white border-slate-200">
                <h3 className="text-lg font-bold text-cyan-600 uppercase tracking-wider mb-4">
                  🧹 Data Hygiene — Before & After
                </h3>
                <div className="space-y-2">
                  {profile.hygieneExamples.map((example, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {/* Scanning laser wipe */}
                      <motion.div
                        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent skew-x-12 z-0"
                        animate={{ left: ['-50%', '150%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, delay: idx * 0.3 }}
                      />
                      <span className="text-sm sm:text-base font-bold text-slate-500 w-16 sm:w-20 flex-shrink-0 relative z-10">{example.field}</span>
                      <div className="flex-1 flex flex-col gap-1 min-w-0 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <div className="flex-1 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-100 shadow-sm relative overflow-hidden">
                             <code className="text-xs sm:text-base font-semibold text-rose-600 break-all">{example.before}</code>
                          </div>
                          <ArrowRight size={16} className="text-slate-400 flex-shrink-0 hidden sm:block" />
                          <div className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 shadow-sm relative overflow-hidden hover-lift">
                            <motion.div 
                               className="absolute inset-0 bg-emerald-400/10"
                               animate={{ opacity: [0, 1, 0] }}
                               transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 + 1 }}
                            />
                            <code className="text-base font-semibold text-emerald-600 break-all relative z-10">{example.after}</code>
                          </div>
                        </div>
                        {example.source && (
                          <span className="text-[11px] font-semibold text-slate-400 ml-1">
                            Source: <span className="text-indigo-500">{example.source}</span>
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Identity Resolution Graph */}
            {profile.identityLinks.length > 0 && (
              <div className="glass-card-sm p-5 bg-white border-slate-200">
                <h3 className="text-lg font-bold text-violet-600 uppercase tracking-wider mb-4">
                  🔗 Identity Resolution — ID Links
                </h3>
                <div className="space-y-2">
                  {profile.identityLinks.map((link, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <code className="text-base font-bold text-violet-700 bg-violet-100 px-2 py-1 rounded-md">{link.from}</code>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-0.5 bg-violet-100 rounded-full relative overflow-hidden">
                              <motion.div className="absolute inset-0 bg-violet-400"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                              />
                            </div>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Link2 size={14} className="text-violet-500 drop-shadow-sm" />
                            </motion.div>
                            <div className="w-10 h-0.5 bg-violet-100 rounded-full relative overflow-hidden">
                              <motion.div className="absolute inset-0 bg-violet-400"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
                              />
                            </div>
                          </div>
                          <code className="text-base font-bold text-violet-700 bg-violet-100 px-2 py-1 rounded-md">{link.to}</code>
                        </div>
                        <p className="text-base font-medium text-slate-500 mt-2">Method: <span className="text-slate-700">{link.method}</span></p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Identity Graph Visualization */}
            <IdentityGraphVisual profile={profile} />

            {/* Source Lineage Timeline */}
            <SourceLineageTimeline profile={profile} />

            {/* Journey Replay */}
            <JourneyReplay profile={profile} />

            {/* Conflict Resolution */}
            <ConflictResolution profile={profile} />

            {/* Cross-Channel Touchpoints */}
            {profile.touchpoints.length > 0 && (
              <div className="glass-card-sm p-4 bg-white border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  🌐 Cross-Channel Touchpoints
                </h3>
                <div className="space-y-1.5">
                  {profile.touchpoints.map((tp, idx) => {
                    const icons = {
                      Web: Globe,
                      Paid: Zap,
                      Email: Mail,
                      CRM: User,
                      Commerce: ShoppingCart,
                      Mobile: Smartphone,
                    };
                    const TpIcon = icons[tp.channel] || Eye;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                          <TpIcon size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <span className="text-base font-bold text-indigo-700">{tp.channel}</span>
                          <p className="text-lg font-medium text-slate-600">{tp.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Purchases */}
            {profile.purchases.length > 0 && (
              <div className="glass-card-sm p-5 bg-white border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  🛒 Recent Purchases
                </h3>
                <div className="space-y-2">
                  {profile.purchases.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-50">
                      <div className="flex items-center gap-3">
                        <ShoppingCart size={16} className="text-emerald-600" />
                        <span className="text-lg font-bold text-slate-700">{p.product}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-700">${p.price}</span>
                        <p className="text-sm font-medium text-emerald-600/70">{p.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Identifier Summary */}
            <div className="glass-card-sm p-4 sm:p-5 bg-white border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">🔑 Identifiers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'CRM ID', value: profile.crmId },
                  { label: 'Commerce ID', value: profile.customerId },
                  { label: 'Marketo ID', value: profile.marketoId },
                  { label: 'Cookie ID', value: profile.cookieId },
                  { label: 'Device ID', value: profile.deviceId },
                ].filter((i) => i.value).map((item) => (
                  <div key={item.label} className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                    <p className="text-xs sm:text-sm font-bold text-slate-500 mb-0.5 sm:mb-1">{item.label}</p>
                    <code className="text-sm sm:text-base font-medium text-slate-800 break-all">{item.value}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
