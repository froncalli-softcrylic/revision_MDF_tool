'use client';
import { create } from 'zustand';
import { SOURCE_CATALOG } from './sourceCatalog';
import { generateDataForSource, cleanName, cleanEmail, cleanPhone, uuid, randomPick, randomInt, cities, states, products } from './dataGenerators';

// ─── MDF Processing Logic ────────────────────────────────────────────────────

function applyDataHygiene(rawRecords, hygieneRules) {
  return rawRecords.map((record) => {
    const cleaned = { ...record, _hygieneApplied: true };
    if (record.firstName && hygieneRules.properCaseNames) cleaned.firstName = cleanName(record.firstName);
    if (record.lastName && hygieneRules.properCaseNames) cleaned.lastName = cleanName(record.lastName);
    if (record.email) {
      cleaned.originalEmail = record.email;
      if (hygieneRules.lowercaseEmail) cleaned.email = cleanEmail(record.email);
    }
    if (record.phone) {
      cleaned.originalPhone = record.phone;
      if (hygieneRules.normalizePhone) cleaned.phone = cleanPhone(record.phone);
    }
    if (record.firstName && hygieneRules.trimWhitespace) cleaned.firstName = cleaned.firstName.trim();
    if (record.lastName && hygieneRules.trimWhitespace) cleaned.lastName = cleaned.lastName.trim();
    return cleaned;
  });
}

function applyIdentityResolution(cleanedRecords, mode) {
  const emailIndex = {};
  const phoneIndex = {};
  const fuzzyNameIndex = {}; // for probabilistic: "firstinitial_lastname_city"
  const clusters = [];

  const isProbabilistic = mode === 'probabilistic';

  cleanedRecords.forEach((record) => {
    let assignedCluster = null;

    // Deterministic: exact email match
    if (record.email && emailIndex[record.email]) {
      assignedCluster = emailIndex[record.email];
    }
    // Deterministic: exact phone match
    if (record.phone && phoneIndex[record.phone]) {
      if (assignedCluster && assignedCluster !== phoneIndex[record.phone]) {
        const old = phoneIndex[record.phone];
        old.records.forEach((r) => {
          assignedCluster.records.push(r);
          if (r.email) emailIndex[r.email] = assignedCluster;
          if (r.phone) phoneIndex[r.phone] = assignedCluster;
        });
        const idx = clusters.indexOf(old);
        if (idx !== -1) clusters.splice(idx, 1);
      } else {
        assignedCluster = phoneIndex[record.phone];
      }
    }

    // Probabilistic: fuzzy name + city match
    if (isProbabilistic && !assignedCluster && record.firstName && record.lastName) {
      const fuzzyKey = `${record.firstName[0].toLowerCase()}_${record.lastName.toLowerCase()}_${(record.city || '').toLowerCase()}`;
      if (fuzzyNameIndex[fuzzyKey]) {
        assignedCluster = fuzzyNameIndex[fuzzyKey];
      }
    }

    // Probabilistic: similar email match (same domain, first initial matches)
    if (isProbabilistic && !assignedCluster && record.email) {
      const [localPart, domain] = record.email.split('@');
      if (localPart && domain) {
        const initial = localPart[0].toLowerCase();
        const similarKey = `${initial}@${domain.toLowerCase()}`;
        // Check existing emails in the index for partial match
        for (const existingEmail of Object.keys(emailIndex)) {
          const [ePart, eDomain] = existingEmail.split('@');
          if (eDomain === domain && ePart[0]?.toLowerCase() === initial && ePart !== localPart) {
            assignedCluster = emailIndex[existingEmail];
            break;
          }
        }
      }
    }

    if (!assignedCluster) {
      assignedCluster = { id: uuid(), records: [] };
      clusters.push(assignedCluster);
    }

    assignedCluster.records.push(record);
    if (record.email) emailIndex[record.email] = assignedCluster;
    if (record.phone) phoneIndex[record.phone] = assignedCluster;
    if (isProbabilistic && record.firstName && record.lastName) {
      const fuzzyKey = `${record.firstName[0].toLowerCase()}_${record.lastName.toLowerCase()}_${(record.city || '').toLowerCase()}`;
      fuzzyNameIndex[fuzzyKey] = assignedCluster;
    }
  });

  return clusters;
}

function buildUnifiedProfiles(clusters, allRawRecords) {
  return clusters.map((cluster) => {
    const records = cluster.records;
    const firstName = records.find((r) => r.firstName)?.firstName || 'Unknown';
    const lastName = records.find((r) => r.lastName)?.lastName || 'Profile';
    const email = records.find((r) => r.email)?.email;
    const phone = records.find((r) => r.phone)?.phone;
    const city = records.find((r) => r.city)?.city || randomPick(cities);
    const state = records.find((r) => r.state)?.state || randomPick(states);
    const crmId = records.find((r) => r.crmId)?.crmId;
    const customerId = records.find((r) => r.customerId)?.customerId;
    const marketoId = records.find((r) => r.marketoId)?.marketoId;
    const cookieId = records.find((r) => r.cookieId)?.cookieId;
    const deviceId = records.find((r) => r.deviceId)?.deviceId;
    const loyaltyId = records.find((r) => r.loyaltyId)?.loyaltyId;
    const masterId = records.find((r) => r.masterId)?.masterId;
    const leadScore = records.find((r) => r.leadScore)?.leadScore || randomInt(30, 80);
    const status = records.find((r) => r.status)?.status || 'Customer';

    const allPurchases = records.flatMap((r) => r.purchases || []);
    const totalSpend = allPurchases.reduce((acc, p) => acc + p.price, 0) || randomInt(50, 2000);
    const ltv = totalSpend * (1 + Math.random() * 2);

    // Collect data classes present
    const dataClasses = [...new Set(records.map((r) => r.dataClass).filter(Boolean))];

    // Build touchpoints from all source types
    const touchpoints = [];
    records.forEach((r) => {
      if (r.sourceId === 'ga4' || r.sourceId === 'webAppEvents') touchpoints.push({ channel: 'Web', detail: `Visited ${r.lastPage || r.pageUrl || '/home'}, ${r.pageViews || 1} page views` });
      if (r.sourceId === 'paidSocial' || r.source === 'Paid Media') touchpoints.push({ channel: 'Paid', detail: `Clicked ${r.campaign} on ${r.adPlatform}` });
      if (r.sourceId === 'marketo' || r.sourceId === 'emailEngagement') touchpoints.push({ channel: 'Email', detail: `${r.emailOpens || r.opens || 0} opens, campaign: ${r.lastCampaign || r.campaignId || 'N/A'}` });
      if (r.sourceId === 'crm') touchpoints.push({ channel: 'CRM', detail: `Status: ${r.status}, Lead Score: ${r.leadScore}` });
      if (r.sourceId === 'pos') touchpoints.push({ channel: 'Commerce', detail: `${(r.purchases || []).length} purchases, $${r.totalSpend} total` });
      if (r.sourceId === 'mobileAppEvents') touchpoints.push({ channel: 'Mobile', detail: `${r.action} on ${r.screenName} (${r.os})` });
      if (r.sourceId === 'support') touchpoints.push({ channel: 'Support', detail: `Ticket: ${r.subject} (${r.priority}), CSAT: ${r.csatScore}` });
      if (r.sourceId === 'callCenter') touchpoints.push({ channel: 'Call Center', detail: `${r.disposition}, ${Math.round(r.callDuration / 60)}min call` });
      if (r.sourceId === 'loyalty') touchpoints.push({ channel: 'Loyalty', detail: `${r.tier} tier, ${r.pointsBalance} points` });
    });

    const sources = [...new Set(records.map((r) => r.source))];
    const ingestionTypes = [...new Set(records.map((r) => r.ingestionType).filter(Boolean))];

    // Build before/after for the customer story
    const rawForProfile = records.map((r) => {
      const raw = allRawRecords.find(
        (raw) =>
          (raw.crmId && raw.crmId === r.crmId) ||
          (raw.customerId && raw.customerId === r.customerId) ||
          (raw.marketoId && raw.marketoId === r.marketoId) ||
          (raw.cookieId && raw.cookieId === r.cookieId) ||
          (raw.deviceId && raw.deviceId === r.deviceId)
      );
      return raw || r;
    });

    const hygieneExamples = [];
    records.forEach((r) => {
      if (r.originalPhone && r.phone) hygieneExamples.push({ field: 'Phone', before: r.originalPhone, after: r.phone, source: r.source || r.sourceId });
      if (r.originalEmail && r.email) hygieneExamples.push({ field: 'Email', before: r.originalEmail, after: r.email, source: r.source || r.sourceId });
      if (r.firstName) {
        const raw = rawForProfile.find((raw) => raw.firstName && raw.firstName !== r.firstName);
        if (raw) hygieneExamples.push({ field: 'First Name', before: raw.firstName, after: r.firstName, source: r.source || r.sourceId });
      }
    });

    const identityLinks = [];
    if (crmId && email) identityLinks.push({ from: `CRM ID: ${crmId}`, to: `Email: ${email}`, method: 'Email Match' });
    if (cookieId && email) identityLinks.push({ from: `Cookie: ${cookieId}`, to: `Email: ${email}`, method: 'Login Event' });
    if (deviceId && crmId) identityLinks.push({ from: `Device: ${deviceId}`, to: `CRM: ${crmId}`, method: 'Deterministic ID Stitch' });
    if (marketoId && email) identityLinks.push({ from: `Marketo: ${marketoId}`, to: `Email: ${email}`, method: 'Email Match' });
    if (loyaltyId && email) identityLinks.push({ from: `Loyalty: ${loyaltyId}`, to: `Email: ${email}`, method: 'Email Match' });
    if (masterId && crmId) identityLinks.push({ from: `MDM: ${masterId}`, to: `CRM: ${crmId}`, method: 'Master ID Link' });

    // Match confidence: based on how many distinct identity keys are linked
    const identityKeysPresent = [email, phone, crmId, customerId, marketoId, cookieId, deviceId, loyaltyId, masterId].filter(Boolean).length;
    const matchConfidence = identityKeysPresent >= 4 ? 'high' : identityKeysPresent >= 2 ? 'medium' : 'low';

    return {
      id: cluster.id, firstName, lastName, email, phone, city, state,
      crmId, customerId, marketoId, cookieId, deviceId, loyaltyId, masterId,
      leadScore, status,
      purchases: allPurchases, totalSpend, ltv: Math.round(ltv),
      touchpoints, sources, ingestionTypes, dataClasses,
      hygieneExamples, identityLinks, recordCount: records.length,
      matchConfidence,
    };
  });
}

// ─── AI Messages ─────────────────────────────────────────────────────────────

function getSourceSelectionMessage(sources) {
  if (sources.length === 0) {
    return "👋 Welcome to the Marketing Data Foundation Tool! Toggle on your data sources in the left panel to begin. I'll explain how the MDF processes and unifies your data.";
  }

  const catalog = SOURCE_CATALOG;
  const selected = sources.map((id) => catalog.find((s) => s.id === id)).filter(Boolean);
  const realtimeSources = selected.filter((s) => s.ingestionMode === 'realtime').map((s) => s.name);
  const batchSources = selected.filter((s) => s.ingestionMode === 'batch').map((s) => s.name);
  const categories = [...new Set(selected.map((s) => s.sourceCategory))];

  let msg = `📊 **Configuration Updated!** You've selected ${sources.length} source(s) across ${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}.\n\n`;
  if (realtimeSources.length > 0) msg += `**Realtime Ingestion:** ${realtimeSources.join(', ')}\n`;
  if (batchSources.length > 0) msg += `**Batch Ingestion:** ${batchSources.join(', ')}\n\n`;

  if (sources.length >= 3) {
    msg += `🔗 **Key Insight:** With ${sources.length} sources, the MDF's Identity Resolution will have multiple join keys to stitch cross-system records into unified Golden Records.\n\n`;
  }
  msg += `Hit **"Run MDF Simulation"** when ready!`;
  return msg;
}

function getStageMessages(stage, profileCount, storeState) {
  const { rawData, cleanedData, identityClusters, unifiedProfiles, selectedSources } = storeState || {};

  // Data-aware hygiene narration
  let hygieneDetail = '';
  if (cleanedData && cleanedData.length > 0 && rawData && rawData.length > 0) {
    const raw0 = rawData[0];
    const clean0 = cleanedData[0];
    if (raw0?.originalPhone && clean0?.phone) {
      hygieneDetail = `\n\nFor example, "${raw0.originalPhone}" was standardized to "${clean0.phone}".`;
    } else if (raw0?.originalEmail && clean0?.email) {
      hygieneDetail = `\n\nFor example, "${raw0.originalEmail}" was cleaned to "${clean0.email}".`;
    }
  }

  // Data-aware identity narration
  let identityDetail = '';
  if (identityClusters && identityClusters.length > 0) {
    identityDetail = `\n\nSo far, **${identityClusters.length} identity clusters** have been discovered across ${selectedSources?.length || 0} sources.`;
  }

  // Data-aware profiling narration
  let profileDetail = '';
  if (unifiedProfiles && unifiedProfiles.length > 0) {
    const first = unifiedProfiles[0];
    profileDetail = `\n\nFor example, **${first.firstName} ${first.lastName}** was created by merging **${first.recordCount} source records** from ${first.sources.join(', ')}.`;
  }

  const messages = {
    idle: null,
    ingesting: `⏳ **Ingesting data...** ${rawData?.length || 0} raw records are flowing into the MDF via Realtime and Batch pipelines. Notice how the data arrives messy — inconsistent phone formats, mixed-case names, scattered IDs across systems.`,
    hygiene: `🧹 **Data Hygiene in progress...** The MDF is standardizing every record:\n\n• Phone numbers → Normalized to (XXX) XXX-XXXX\n• Emails → Lowercased, trimmed\n• Names → Proper case applied\n\nThis is the foundation — you can't resolve identities with dirty data.${hygieneDetail}`,
    identity: `🔗 **Identity Resolution running...** This is where the magic happens. The MDF is scanning for matching keys across sources:\n\n• Email addresses linking CRM records to web sessions\n• Phone numbers connecting POS purchases to lead forms\n• Device IDs stitching anonymous browsing to known profiles${identityDetail}`,
    profiling: `👤 **Building Unified Profiles...** Each identity cluster is being merged into a single **Golden Record** — a 360° customer view combining all available data classes.${profileDetail}`,
    measurement: `📏 **Measurement & KPIs...** Calculating attribution metrics, LTV projections, and engagement scores on the clean, unified data.${unifiedProfiles?.length > 0 ? `\n\nAverage LTV across ${unifiedProfiles.length} profiles: **$${Math.round(unifiedProfiles.reduce((s, p) => s + p.ltv, 0) / unifiedProfiles.length).toLocaleString()}**` : ''}`,
    activating: `🚀 **Activating to MarTech Stack!** Clean, unified profiles are now flowing UP to the Composable MarTech layer:\n\n• **CDP** → Audience segments built on ${profileCount} Golden Records\n• **Journey Orchestration** → Multi-channel journeys triggered\n• **Campaign Management** → Personalized campaigns launched\n• **Personalization** → Real-time experiences tailored\n\nThe ultimate rule is enforced: *raw data never bypasses the MDF*.`,
    complete: `✅ **Simulation Complete!** ${profileCount} Unified Profiles (Golden Records) have been created.\n\nClick any customer below to see their **story** — how messy, disconnected records were cleaned and stitched into a single, rich profile.\n\n*This is the power of a Marketing Data Foundation.*`,
  };
  return messages[stage] || null;
}

// ─── The Store ───────────────────────────────────────────────────────────────

export const useMDFStore = create((set, get) => ({
  // ── Theme slice ────────────────────────────────────────────────────────────
  theme: 'light', // 'light' | 'dark'
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  // ── Sources slice ──────────────────────────────────────────────────────────
  selectedSources: [],

  // ── Profiles slice ─────────────────────────────────────────────────────────
  rawData: [],
  cleanedData: [],
  identityClusters: [],
  unifiedProfiles: [],
  selectedProfile: null,

  // ── Simulation slice ───────────────────────────────────────────────────────
  processingStage: 'idle',
  stageProgress: 0,
  simulationMode: 'auto', // 'auto' | 'step'
  stepPending: false, // true when paused waiting for user to advance

  // ── Scenario Presets slice ─────────────────────────────────────────────────
  activePreset: null,

  // ── Edge Cases slice ───────────────────────────────────────────────────────
  edgeCases: {
    missingEmail: false,
    duplicateCRM: false,
    mismatchedPhones: false,
  },

  // ── Identity Mode slice ────────────────────────────────────────────────────
  identityMode: 'deterministic', // 'deterministic' | 'probabilistic'

  // ── Hygiene Rules slice ────────────────────────────────────────────────────
  hygieneRules: {
    normalizePhone: true,
    lowercaseEmail: true,
    trimWhitespace: true,
    properCaseNames: true,
  },

  // ── Governance slice ───────────────────────────────────────────────────────
  governanceMode: false, // when true, shows compliance overlays

  // ── Chat slice ─────────────────────────────────────────────────────────────
  chatMessages: [
    { id: '1', role: 'assistant', content: "👋 Welcome to the Marketing Data Foundation Tool! Toggle on your data sources in the left panel to begin. I'll explain how the MDF processes and unifies your data.", timestamp: new Date().toISOString() },
  ],

  // ── Actions ────────────────────────────────────────────────────────────────
  toggleSource: (sourceId) => {
    const current = get().selectedSources;
    const updated = current.includes(sourceId) ? current.filter((s) => s !== sourceId) : [...current, sourceId];
    set({ selectedSources: updated });
    const msg = getSourceSelectionMessage(updated);
    const newMessage = { id: uuid(), role: 'assistant', content: msg, timestamp: new Date().toISOString() };
    set((state) => ({ chatMessages: [...state.chatMessages, newMessage] }));
  },

  selectProfile: (profile) => set({ selectedProfile: profile }),
  clearProfile: () => set({ selectedProfile: null }),

  // ── Scenario Preset Actions ────────────────────────────────────────────────
  applyPreset: (presetId) => {
    const PRESETS = {
      retail: ['webAppEvents', 'ga4', 'pos', 'crm', 'loyalty', 'emailEngagement', 'paidSocial'],
      b2bSaas: ['webAppEvents', 'productTelemetry', 'crm', 'billing', 'marketo', 'enrichment', 'attribution'],
      healthcare: ['crm', 'callCenter', 'support', 'customerMDM', 'edw', 'offlineCampaigns'],
      media: ['webAppEvents', 'mobileAppEvents', 'ga4', 'adImpressions', 'paidSocial', 'identityGraph', 'experimentation'],
    };
    const sources = PRESETS[presetId] || [];
    set({ selectedSources: sources, activePreset: presetId });
    const msg = getSourceSelectionMessage(sources);
    const aiMsg = { id: uuid(), role: 'assistant', content: `🎯 **Preset Applied: ${presetId.charAt(0).toUpperCase() + presetId.slice(1)}**\n\n${msg}`, timestamp: new Date().toISOString() };
    set((state) => ({ chatMessages: [...state.chatMessages, aiMsg] }));
  },
  clearPreset: () => set({ activePreset: null }),

  // ── Edge Case Actions ──────────────────────────────────────────────────────
  toggleEdgeCase: (key) => {
    set((state) => ({
      edgeCases: { ...state.edgeCases, [key]: !state.edgeCases[key] },
    }));
  },

  // ── Identity Mode Actions ──────────────────────────────────────────────────
  setIdentityMode: (mode) => set({ identityMode: mode }),

  // ── Hygiene Rule Actions ───────────────────────────────────────────────────
  toggleHygieneRule: (key) => {
    set((state) => ({
      hygieneRules: { ...state.hygieneRules, [key]: !state.hygieneRules[key] },
    }));
  },

  // ── Simulation Mode Actions ────────────────────────────────────────────────
  setSimulationMode: (mode) => set({ simulationMode: mode }),
  advanceStep: () => set({ stepPending: false }),

  // ── Governance Actions ─────────────────────────────────────────────────────
  toggleGovernance: () => set((state) => ({ governanceMode: !state.governanceMode })),

  addUserMessage: (content) => {
    const userMsg = { id: uuid(), role: 'user', content, timestamp: new Date().toISOString() };
    set((state) => ({ chatMessages: [...state.chatMessages, userMsg] }));

    setTimeout(() => {
      const { processingStage, selectedSources, unifiedProfiles } = get();
      let response = '';

      if (content.toLowerCase().includes('what is') || content.toLowerCase().includes('explain')) {
        response = `Great question! The **Marketing Data Foundation (MDF)** is an architectural layer that sits between your raw data infrastructure and your MarTech stack. Its 4 pillars ensure data quality:\n\n1. **Data Hygiene** — Standardization\n2. **Identity Resolution** — Cross-system matching\n3. **Unified Profile** — Golden Record creation\n4. **Measurement** — Clean analytics\n\nThe key rule: *no raw data bypasses the MDF*.`;
      } else if (content.toLowerCase().includes('identity') || content.toLowerCase().includes('resolution')) {
        response = `**Identity Resolution** is the process of linking disparate identifiers across systems. For example:\n\n• A web cookie from GA4 → matched to a CRM email via a login event\n• A phone number from Shopify POS → matched to Salesforce via phone normalization\n\nThis creates an **identity graph** — a cluster of IDs that all belong to the same person.`;
      } else if (content.toLowerCase().includes('hygiene') || content.toLowerCase().includes('clean')) {
        response = `**Data Hygiene** is the first step in the MDF pipeline. It standardizes:\n\n• Phone: "(555) 123-4567", "5551234567", "+15551234567" → all become "(555) 123-4567"\n• Email: " John.DOE@Gmail.com " → "john.doe@gmail.com"\n• Name: "JANE", "jane", "  Jane " → "Jane"\n\nWithout hygiene, identity resolution would miss matches due to formatting differences.`;
      } else if (content.toLowerCase().includes('golden') || content.toLowerCase().includes('record')) {
        response = `A **Golden Record** is the unified, clean, deduplicated profile that emerges after all MDF processing. It combines data from every source — behavioral (web analytics), transactional (commerce/CRM), marketing (email engagement), and event (support tickets) — into one authoritative customer view.`;
      } else if (processingStage === 'complete' && unifiedProfiles.length > 0) {
        response = `The simulation produced **${unifiedProfiles.length} Golden Records**. Click on any profile in the directory below to see how multiple source records were cleaned and merged. Try asking me about "identity resolution" or "data hygiene" for deeper explanations!`;
      } else if (selectedSources.length === 0) {
        response = `Start by selecting some data sources from the left panel! Each source represents a different part of your data infrastructure — from real-time web analytics to batch CRM uploads.`;
      } else {
        response = `I see you've selected ${selectedSources.length} source(s). Hit **"Run MDF Simulation"** to watch the MDF process your data through all 4 pillars. I'll narrate each stage!`;
      }

      const aiMsg = { id: uuid(), role: 'assistant', content: response, timestamp: new Date().toISOString() };
      set((state) => ({ chatMessages: [...state.chatMessages, aiMsg] }));
    }, 800);
  },

  runSimulation: async () => {
    const { selectedSources, edgeCases, hygieneRules, simulationMode } = get();
    if (selectedSources.length === 0) return;

    set({ processingStage: 'ingesting', stageProgress: 0, rawData: [], cleanedData: [], identityClusters: [], unifiedProfiles: [], selectedProfile: null, stepPending: false });

    // Generate raw data for ALL selected sources using the universal generator
    let allRaw = [];
    const count = 8;
    selectedSources.forEach((sourceId) => {
      allRaw.push(...generateDataForSource(sourceId, count));
    });

    // Apply edge cases
    if (edgeCases.missingEmail) {
      allRaw = allRaw.map((r, i) => i % 3 === 0 ? { ...r, email: undefined } : r);
    }
    if (edgeCases.duplicateCRM) {
      const crmRecords = allRaw.filter((r) => r.sourceId === 'crm');
      const dupes = crmRecords.slice(0, Math.ceil(crmRecords.length * 0.3)).map((r) => ({
        ...r,
        crmId: r.crmId + '-DUP',
        firstName: r.firstName ? r.firstName.toUpperCase() : r.firstName,
      }));
      allRaw.push(...dupes);
    }
    if (edgeCases.mismatchedPhones) {
      allRaw = allRaw.map((r) => {
        if (r.phone) {
          const digits = r.phone.replace(/\D/g, '');
          return { ...r, phone: randomPick([`+1-${digits}`, `   ${digits}   `, `(${digits.slice(0,3)})${digits.slice(3,6)}${digits.slice(6)}`]) };
        }
        return r;
      });
    }

    const addStageMsg = (stage, count) => {
      const msg = getStageMessages(stage, count, get());
      if (msg) {
        const aiMsg = { id: uuid(), role: 'assistant', content: msg, timestamp: new Date().toISOString() };
        set((state) => ({ chatMessages: [...state.chatMessages, aiMsg] }));
      }
    };

    // Helper: wait for step advance in step mode
    const waitForStep = async () => {
      if (simulationMode === 'step') {
        set({ stepPending: true });
        // Poll until stepPending is cleared by advanceStep()
        while (get().stepPending) {
          await new Promise((r) => setTimeout(r, 200));
        }
      } else {
        await new Promise((r) => setTimeout(r, 1500));
      }
    };

    // Stage 1: Ingesting
    addStageMsg('ingesting');
    set({ rawData: allRaw });
    await waitForStep();

    // Stage 2: Hygiene
    set({ processingStage: 'hygiene', stageProgress: 25 });
    addStageMsg('hygiene');
    await waitForStep();
    const cleaned = applyDataHygiene(allRaw, get().hygieneRules);
    set({ cleanedData: cleaned });

    // Stage 3: Identity Resolution
    set({ processingStage: 'identity', stageProgress: 50 });
    addStageMsg('identity');
    await waitForStep();
    const clusters = applyIdentityResolution(cleaned, get().identityMode);
    set({ identityClusters: clusters });

    // Stage 4: Profiling
    set({ processingStage: 'profiling', stageProgress: 65 });
    addStageMsg('profiling');
    await waitForStep();
    const profiles = buildUnifiedProfiles(clusters, allRaw);
    set({ unifiedProfiles: profiles });

    // Stage 5: Measurement
    set({ processingStage: 'measurement', stageProgress: 80 });
    addStageMsg('measurement');
    await waitForStep();

    // Stage 6: Activating
    set({ processingStage: 'activating', stageProgress: 90 });
    addStageMsg('activating');
    await waitForStep();

    // Complete
    set({ processingStage: 'complete', stageProgress: 100, stepPending: false });
    addStageMsg('complete', profiles.length);
  },
}));
