'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { X, Network } from 'lucide-react';
import { useMDFStore } from '@/store/store';
import { SOURCE_CATALOG } from '@/store/sourceCatalog';

// Fixed Nodes
const coreNodes = [
  { id: 'hygiene', type: 'default', data: { label: 'Data Hygiene' }, position: { x: 300, y: 150 }, style: { background: 'rgba(255, 255, 255, 0.8)', border: '1px solid var(--border-active)', borderRadius: '12px', padding: '12px', fontWeight: '500' } },
  { id: 'identity', type: 'default', data: { label: 'Identity Resolution' }, position: { x: 500, y: 150 }, style: { background: 'rgba(255, 255, 255, 0.8)', border: '1px solid var(--border-active)', borderRadius: '12px', padding: '12px', fontWeight: '500' } },
  { id: 'unified', type: 'output', data: { label: 'Unified Profiles (Golden Records)' }, position: { x: 750, y: 150 }, style: { background: 'var(--gradient-primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '15px', fontWeight: 'bold', boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)' } },
  
  // Destinations
  { id: 'dest-cdp', type: 'output', data: { label: 'CDP (Audience Segments)' }, position: { x: 1050, y: 50 }, style: { borderRadius: '8px' } },
  { id: 'dest-ads', type: 'output', data: { label: 'Ad Platforms (Conversion API)' }, position: { x: 1050, y: 150 }, style: { borderRadius: '8px' } },
  { id: 'dest-bi', type: 'output', data: { label: 'BI & Analytics (ROI Dashboards)' }, position: { x: 1050, y: 250 }, style: { borderRadius: '8px' } },
];

const coreEdges = [
  { id: 'e-hygiene-id', source: 'hygiene', target: 'identity', animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' } },
  { id: 'e-id-unif', source: 'identity', target: 'unified', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },
  { id: 'e-unif-cdp', source: 'unified', target: 'dest-cdp', animated: true, style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e-unif-ads', source: 'unified', target: 'dest-ads', animated: true, style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e-unif-bi', source: 'unified', target: 'dest-bi', animated: true, style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
];

export default function ArchitectureCanvas({ isOpen, onClose }) {
  const selectedSources = useMDFStore((s) => s.selectedSources);
  const theme = useMDFStore((s) => s.theme);
  
  const [nodes, setNodes] = useState(coreNodes);
  const [edges, setEdges] = useState(coreEdges);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  useEffect(() => {
    // Generate source nodes dynamically based on selected sources
    const selectedSourcesList = selectedSources.map(id => SOURCE_CATALOG.find(s => s.id === id)).filter(Boolean);
    
    // Create an "Empty State" node if no sources selected
    if (selectedSourcesList.length === 0) {
      const emptyNode = {
        id: 'no-sources',
        type: 'input',
        data: { label: 'No Sources Selected' },
        position: { x: 50, y: 150 },
        style: { border: '1px dashed #ef4444', color: '#ef4444', background: '#fef2f2' }
      };
      setNodes([emptyNode, ...coreNodes]);
      setEdges(coreEdges);
      return;
    }

    const startY = Math.max(0, 150 - ((selectedSourcesList.length * 80) / 2));
    
    const sourceNodes = selectedSourcesList.map((s, idx) => ({
      id: `src-${s.id}`,
      type: 'input',
      data: { label: s.name },
      position: { x: 50, y: startY + (idx * 80) },
      style: { border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white' }
    }));
    
    const sourceEdges = selectedSourcesList.map((s) => ({
      id: `e-src-${s.id}-hygiene`,
      source: `src-${s.id}`,
      target: 'hygiene',
      animated: true,
      style: { stroke: '#94a3b8' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }
    }));

    setNodes([...sourceNodes, ...coreNodes]);
    setEdges([...sourceEdges, ...coreEdges]);
  }, [selectedSources]);

  // Handle dark mode styles for nodes dynamically
  useEffect(() => {
    setNodes(nds => nds.map(node => {
        // Skip updating the unified node
        if (node.id === 'unified') return node;
        
        return {
            ...node,
            style: {
                ...node.style,
                background: theme === 'dark' ? '#1e293b' : 'white',
                color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                borderColor: theme === 'dark' ? '#334155' : '#cbd5e1'
            }
        };
    }));
  }, [theme]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full h-full max-w-7xl bg-white dark:bg-[#0f172a] shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#0f172a]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Network size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Architecture Canvas</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Interactive node-based map of your data flow</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* React Flow Canvas */}
          <div className="flex-1 w-full h-full bg-slate-50 dark:bg-[#020617]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-right"
            >
              <Background color={theme === 'dark' ? '#334155' : '#cbd5e1'} gap={16} />
              <Controls />
            </ReactFlow>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
