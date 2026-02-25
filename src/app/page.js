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

export default function Home() {
  const selectedProfile = useMDFStore((s) => s.selectedProfile);

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
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">MDF Simulator</h1>
              <p className="text-base text-slate-500 font-medium">Marketing Data Foundation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-source text-sm">v1.0</span>
            <span className="text-base text-slate-600">Data-Centric Architecture</span>
          </div>
        </div>
      </header>

      {/* Validation Banner */}
      <div className="max-w-[1920px] mx-auto px-5 md:px-8 pt-4">
        <ValidationBanner />
      </div>

      {/* 3-Column Layout */}
      <div className="max-w-[1920px] mx-auto p-5 md:p-8 grid grid-cols-1 lg:grid-cols-[340px_1fr_380px] gap-6 min-h-[calc(100vh-73px)]">
        {/* Column 1: Infrastructure */}
        <aside className="lg:max-h-[calc(100vh-105px)] overflow-y-auto space-y-4">
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
        <section className="lg:max-h-[calc(100vh-105px)] overflow-y-auto">
          <MDFEngine />
        </section>

        {/* Column 3: AI Assistant */}
        <aside className="lg:max-h-[calc(100vh-105px)] overflow-y-auto">
          <AIAssistant />
        </aside>
      </div>

      {/* Customer Story Modal */}
      {selectedProfile && <CustomerStory profile={selectedProfile} />}
    </main>
  );
}
