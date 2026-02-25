'use client';

import InfrastructurePanel from '@/components/InfrastructurePanel';
import MDFEngine from '@/components/MDFEngine';
import AIAssistant from '@/components/AIAssistant';
import CustomerStory from '@/components/CustomerStory';
import ScenarioPresets from '@/components/ScenarioPresets';
import EdgeCaseDemos from '@/components/EdgeCaseDemos';
import IdentityModeToggle from '@/components/IdentityModeToggle';
import HygieneRulesPanel from '@/components/HygieneRulesPanel';
import ValidationBanner from '@/components/ValidationBanner';
import SimulationControls from '@/components/SimulationControls';
import GovernancePanel from '@/components/GovernancePanel';
import SourceDependencyMap from '@/components/SourceDependencyMap';
import ConsentLayer from '@/components/ConsentLayer';
import { useMDFStore } from '@/store/store';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Home() {
  const selectedProfile = useMDFStore((s) => s.selectedProfile);
  const processingStage = useMDFStore((s) => s.processingStage);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-hide the sidebar when simulation becomes active
  useEffect(() => {
    if (processingStage === 'ingesting') {
      setIsSidebarOpen(false);
    }
  }, [processingStage]);

  return (
    <main className="min-h-screen w-full">
      {/* Header */}
      <header className="w-full px-6 py-5 border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">MDF Simulator</h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">Marketing Data Foundation</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="badge badge-source text-xs md:text-sm">v1.0</span>
            <span className="text-sm md:text-base text-slate-600">Data-Centric Architecture</span>
          </div>
        </div>
      </header>

      {/* Validation Banner */}
      <div className="max-w-[1920px] mx-auto px-5 md:px-8 pt-4">
        <ValidationBanner />
      </div>

      {/* Sidebar Toggle Button (Tablet/Desktop) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-50 items-center justify-center w-6 h-14 bg-white border border-slate-200 border-l-0 rounded-r-xl shadow-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        title={isSidebarOpen ? "Hide Infrastructure Panel" : "Show Infrastructure Panel"}
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Responsive Layout */}
      <div className={`max-w-[1920px] mx-auto p-4 sm:p-5 md:p-8 grid grid-cols-1 ${
        isSidebarOpen 
          ? 'md:grid-cols-[280px_1fr] min-[1440px]:grid-cols-[340px_1fr_350px]' 
          : 'md:grid-cols-1 min-[1440px]:grid-cols-[1fr_350px]'
      } gap-6 min-h-[calc(100vh-73px)] relative z-10 transition-all duration-500`}>
        
        {/* Column 1: Infrastructure */}
        <aside className={`${isSidebarOpen ? 'block' : 'hidden'} md:col-span-1 md:max-h-[calc(100vh-105px)] overflow-y-auto space-y-4 pr-1`}>
          <ScenarioPresets />
          <InfrastructurePanel />
          <EdgeCaseDemos />
          <IdentityModeToggle />
          <HygieneRulesPanel />
          <SimulationControls />
          <GovernancePanel />
          <SourceDependencyMap />
          <ConsentLayer />
        </aside>

        {/* Column 2: MDF Engine */}
        <section className="md:col-span-1 min-[1440px]:col-span-1 md:max-h-[calc(100vh-105px)] overflow-y-auto">
          <MDFEngine />
        </section>

        {/* Column 3: AI Assistant (Inline for 1440p+) */}
        <aside className="hidden min-[1440px]:block min-[1440px]:col-span-1 max-h-[calc(100vh-105px)] overflow-y-auto">
          <AIAssistant />
        </aside>
      </div>

      {/* Floating AI Assistant (For <1440p) */}
      <div className="block min-[1440px]:hidden relative z-50">
        <AIAssistant isFloating={true} />
      </div>

      {/* Customer Story Modal */}
      {selectedProfile && <CustomerStory profile={selectedProfile} />}
    </main>
  );
}
