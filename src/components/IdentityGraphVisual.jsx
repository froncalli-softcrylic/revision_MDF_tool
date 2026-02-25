'use client';

import { motion } from 'framer-motion';
import { User, Globe, Mail, Smartphone, ShoppingCart, Link2, Fingerprint } from 'lucide-react';

/**
 * Identity Graph Visualization — shows the Golden Record as a center node
 * with satellite nodes for each channel/data source, connected by animated links.
 */
export default function IdentityGraphVisual({ profile }) {
  if (!profile) return null;

  // Build satellite nodes from sources and touchpoints
  const channelIcons = {
    Web: { icon: Globe, color: '#06b6d4' },
    CRM: { icon: User, color: '#8b5cf6' },
    Email: { icon: Mail, color: '#ec4899' },
    Mobile: { icon: Smartphone, color: '#10b981' },
    Commerce: { icon: ShoppingCart, color: '#f59e0b' },
    Paid: { icon: Fingerprint, color: '#f43f5e' },
  };

  // Deduplicate channels from touchpoints
  const channels = [...new Set((profile.touchpoints || []).map((tp) => tp.channel))];
  const nodes = channels.slice(0, 6).map((ch) => ({
    label: ch,
    ...(channelIcons[ch] || { icon: Link2, color: '#6366f1' }),
  }));

  // Position nodes in a circle around center
  const cx = 120, cy = 100, radius = 72;

  return (
    <div className="glass-card-sm p-5 bg-white border-slate-200">
      <h3 className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-3">
        🔗 Identity Graph — Unified View
      </h3>
      <div className="relative mx-auto" style={{ width: 240, height: 200 }}>
        {/* Connection lines */}
        <svg className="absolute inset-0" width="240" height="200" viewBox="0 0 240 200">
          {nodes.map((node, i) => {
            const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const nx = cx + radius * Math.cos(angle);
            const ny = cy + radius * Math.sin(angle);
            return (
              <motion.line
                key={node.label}
                x1={cx} y1={cy} x2={nx} y2={ny}
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeDasharray="4 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              />
            );
          })}
          {/* Animated data particles along lines */}
          {nodes.map((node, i) => {
            const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const nx = cx + radius * Math.cos(angle);
            const ny = cy + radius * Math.sin(angle);
            return (
              <motion.circle
                key={`particle-${node.label}`}
                r="3"
                fill={node.color}
                initial={{ cx, cy }}
                animate={{
                  cx: [cx, nx, cx],
                  cy: [cy, ny, cy],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
              />
            );
          })}
        </svg>

        {/* Center node — Golden Record */}
        <motion.div
          className="absolute flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-indigo-300 bg-white shadow-lg z-10"
          style={{ left: cx - 32, top: cy - 32 }}
          animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.3)', '0 0 0px rgba(99,102,241,0)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-lg font-black text-indigo-600">
            {profile.firstName[0]}{profile.lastName[0]}
          </span>
          <span className="text-[7px] font-bold text-indigo-400 uppercase">Golden</span>
        </motion.div>

        {/* Satellite nodes */}
        {nodes.map((node, i) => {
          const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const nx = cx + radius * Math.cos(angle) - 16;
          const ny = cy + radius * Math.sin(angle) - 16;
          const NodeIcon = node.icon;
          return (
            <motion.div
              key={node.label}
              className="absolute w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white shadow-sm z-10"
              style={{ left: nx, top: ny, borderColor: node.color + '60' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              title={node.label}
            >
              <NodeIcon size={14} style={{ color: node.color }} />
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {nodes.map((node) => (
          <span key={node.label} className="text-[9px] font-semibold text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full mr-0.5" style={{ background: node.color }} />
            {node.label}
          </span>
        ))}
      </div>
    </div>
  );
}
