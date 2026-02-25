'use client';
// ─── Helpers ─────────────────────────────────────────────────────────────────

const firstNames = ['Jane', 'Marcus', 'Priya', 'Alejandro', 'Mei-Lin', 'Darius', 'Sofia', 'Tomasz', 'Aisha', 'Liam'];
const lastNames = ['Doe', 'Rivera', 'Sharma', 'Chen', 'Williams', 'Novak', 'Okafor', 'Kim', 'Petrov', 'Garcia'];
const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];
const products = [
  { name: '4K OLED TV 65"', price: 1299 },
  { name: 'Wireless Noise-Cancelling Headphones', price: 349 },
  { name: 'Smart Home Hub Pro', price: 199 },
  { name: 'Running Shoes Ultra Boost', price: 189 },
  { name: 'Espresso Machine Deluxe', price: 599 },
  { name: 'Organic Skincare Bundle', price: 89 },
  { name: 'Fitness Tracker Band', price: 129 },
  { name: 'Bluetooth Speaker Waterproof', price: 79 },
  { name: 'Laptop Stand Ergonomic', price: 59 },
  { name: 'Meal Prep Container Set', price: 34 },
];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Diego', 'Dallas', 'Austin', 'Denver', 'Seattle'];
const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'CA', 'TX', 'TX', 'CO', 'WA'];

export function randomPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
export function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
export function uuid() { return 'xxxxxxxx-xxxx-4xxx'.replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16)); }

function messyPhone() {
  const area = randomInt(200, 999), mid = randomInt(100, 999), last = randomInt(1000, 9999);
  return randomPick([`(${area}) ${mid}-${last}`, `${area}.${mid}.${last}`, `${area}${mid}${last}`, `+1 ${area}-${mid}-${last}`, `  ${area} ${mid} ${last}  `]);
}
export function cleanPhone(raw) {
  const digits = raw.replace(/\D/g, '');
  const d = digits.length > 10 ? digits.slice(-10) : digits;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
function canonicalEmail(first, last, i) { return `${first.toLowerCase()}.${last.toLowerCase()}@${domains[i % domains.length]}`; }
function messyEmail(first, last, i) {
  const domain = domains[i % domains.length];
  return randomPick([`${first}.${last}@${domain}`, `${first.toLowerCase()}${last.toUpperCase()}@${domain}`, ` ${first.toLowerCase()}.${last.toLowerCase()}@${domain} `, `  ${first}.${last}@${domain}`]);
}
export function cleanEmail(raw) { return raw.trim().toLowerCase(); }
function messyName(name) { return randomPick([name.toUpperCase(), name.toLowerCase(), name[0] + name.slice(1).toLowerCase(), `  ${name}  `, name]); }
export function cleanName(raw) { const t = raw.trim(); return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(); }

// ─── Generic Generator Wrapper ───────────────────────────────────────────────
// All generators produce records tagged with source, sourceCategory, ingestionMode, dataClass

function baseRecord(sourceId, sourceName, cat, mode, dc) {
  return { source: sourceName, sourceId, sourceCategory: cat, ingestionType: mode === 'realtime' ? 'Realtime' : 'Batch', dataClass: dc };
}

// ─── Specific generators (keyed by sourceId) ─────────────────────────────────

const generators = {
  // ── Digital Properties ──────────────────────────────────────────────────────
  webAppEvents: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    const hasLogin = i < Math.ceil(count * 0.6);
    return { ...baseRecord('webAppEvents', 'Web/App Events', 'Digital Property', 'realtime', 'behavioral'),
      deviceId: `web_${uuid()}`, cookieId: `_wa_${randomInt(100000, 999999)}`,
      ...(hasLogin ? { email: messyEmail(fn, ln, i) } : {}),
      eventName: randomPick(['click', 'scroll', 'form_submit', 'page_view', 'add_to_cart']),
      pageUrl: randomPick(['/products', '/checkout', '/blog', '/account', '/pricing']),
      timestamp: new Date(Date.now() - randomInt(0, 7 * 86400000)).toISOString(),
    };
  }),
  mobileAppEvents: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('mobileAppEvents', 'Mobile App', 'Digital Property', 'realtime', 'behavioral'),
      deviceId: `mob_${uuid()}`, pushToken: `pt_${uuid()}`,
      ...(i < Math.ceil(count * 0.5) ? { email: messyEmail(fn, ln, i) } : {}),
      screenName: randomPick(['Home', 'Feed', 'Profile', 'Settings', 'Cart']),
      action: randomPick(['tap', 'swipe', 'purchase', 'share', 'bookmark']),
      os: randomPick(['iOS 17', 'Android 14']),
      timestamp: new Date(Date.now() - randomInt(0, 7 * 86400000)).toISOString(),
    };
  }),
  productTelemetry: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('productTelemetry', 'Product Telemetry', 'Digital Property', 'batch', 'behavioral'),
      userId: `usr_${10000 + i * 111}`, email: messyEmail(fn, ln, i),
      featureName: randomPick(['Dashboard', 'Reports', 'API', 'Integrations', 'Settings']),
      usageCount: randomInt(1, 500), sessionDuration: randomInt(30, 3600),
      planTier: randomPick(['Free', 'Pro', 'Enterprise']),
    };
  }),

  // ── Data Infrastructure ─────────────────────────────────────────────────────
  edw: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('edw', 'EDW', 'Data Infrastructure', 'batch', 'transactional'),
      customerId: `EDW-${10000 + i * 111}`, email: messyEmail(fn, ln, i),
      firstName: messyName(fn), lastName: messyName(ln),
      revenue: randomInt(100, 50000), segment: randomPick(['Enterprise', 'Mid-Market', 'SMB']),
      region: randomPick(['AMER', 'EMEA', 'APAC']),
    };
  }),
  dataLake: (count) => Array.from({ length: count }, () => ({
    ...baseRecord('dataLake', 'Data Lake', 'Data Infrastructure', 'batch', 'behavioral'),
    cookieId: `_dl_${randomInt(100000, 999999)}`, deviceId: `dl_${uuid()}`,
    eventType: randomPick(['impression', 'click', 'conversion', 'video_view']),
    utmSource: randomPick(['google', 'facebook', 'email', 'direct']),
    timestamp: new Date(Date.now() - randomInt(0, 14 * 86400000)).toISOString(),
  })),
  loyalty: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('loyalty', 'Loyalty System', 'Data Infrastructure', 'batch', 'transactional'),
      loyaltyId: `LYL-${10000 + i * 111}`, email: messyEmail(fn, ln, i), phone: messyPhone(),
      firstName: messyName(fn), lastName: messyName(ln),
      pointsBalance: randomInt(100, 50000), tier: randomPick(['Bronze', 'Silver', 'Gold', 'Platinum']),
    };
  }),
  customerMDM: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length], ci = i % cities.length;
    return { ...baseRecord('customerMDM', 'Customer MDM', 'Data Infrastructure', 'batch', 'transactional'),
      masterId: `MDM-${10000 + i * 111}`, crmId: `SF-${100000 + i * 1111}`,
      email: messyEmail(fn, ln, i), phone: messyPhone(),
      firstName: messyName(fn), lastName: messyName(ln),
      city: cities[ci], state: states[ci], lifecycleStage: randomPick(['Prospect', 'Customer', 'Advocate', 'At-Risk']),
    };
  }),
  billing: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('billing', 'Billing', 'Data Infrastructure', 'batch', 'transactional'),
      customerId: `BIL-${10000 + i * 111}`, email: messyEmail(fn, ln, i),
      planName: randomPick(['Starter', 'Growth', 'Enterprise']),
      mrr: randomInt(29, 999), paymentStatus: randomPick(['Active', 'Past Due', 'Cancelled']),
    };
  }),
  oms: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('oms', 'OMS', 'Data Infrastructure', 'batch', 'transactional'),
      orderId: `ORD-${10000 + i * 111}`, customerId: `OMS-${10000 + i * 111}`,
      email: messyEmail(fn, ln, i), firstName: messyName(fn), lastName: messyName(ln),
      orderTotal: randomInt(20, 2000), status: randomPick(['Pending', 'Shipped', 'Delivered', 'Returned']),
    };
  }),

  // ── Customer-Centric ────────────────────────────────────────────────────────
  crm: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length], ci = i % cities.length;
    return { ...baseRecord('crm', 'Salesforce CRM', 'Customer Centric', 'batch', 'transactional'),
      crmId: `SF-${100000 + i * 1111}`, firstName: messyName(fn), lastName: messyName(ln),
      email: messyEmail(fn, ln, i), phone: messyPhone(),
      leadScore: randomInt(10, 100), status: randomPick(['Lead', 'MQL', 'SQL', 'Customer', 'Churned']),
      city: cities[ci], state: states[ci],
    };
  }),
  pos: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    const numPurchases = randomInt(1, 4);
    const purchases = Array.from({ length: numPurchases }, () => {
      const p = randomPick(products);
      return { product: p.name, price: p.price, date: new Date(Date.now() - randomInt(0, 90 * 86400000)).toISOString().split('T')[0] };
    });
    return { ...baseRecord('pos', 'Shopify POS', 'Customer Centric', 'batch', 'transactional'),
      customerId: `SHOP-${10000 + i * 111}`, firstName: messyName(fn), lastName: messyName(ln),
      email: messyEmail(fn, ln, i), phone: messyPhone(),
      purchases, totalSpend: purchases.reduce((a, p) => a + p.price, 0),
    };
  }),
  support: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('support', 'Zendesk Support', 'Customer Centric', 'batch', 'event'),
      email: messyEmail(fn, ln, i), phone: messyPhone(), customerId: `ZD-${10000 + i * 111}`,
      ticketId: `TKT-${randomInt(10000, 99999)}`, subject: randomPick(['Order issue', 'Billing question', 'Product defect', 'Returns', 'Account access']),
      priority: randomPick(['Low', 'Medium', 'High', 'Urgent']), csatScore: randomInt(1, 5),
    };
  }),
  callCenter: (count) => Array.from({ length: count }, (_, i) => ({
    ...baseRecord('callCenter', 'Call Center', 'Customer Centric', 'batch', 'event'),
    phone: messyPhone(), customerId: `CC-${10000 + i * 111}`,
    callDuration: randomInt(30, 1800), disposition: randomPick(['Resolved', 'Escalated', 'Callback', 'Abandoned']),
    agentId: `AGT-${randomInt(100, 999)}`, queueTime: randomInt(5, 300),
  })),

  // ── Marketing & Advertising ─────────────────────────────────────────────────
  emailEngagement: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('emailEngagement', 'Email Engagement', 'Marketing', 'batch', 'marketing'),
      email: messyEmail(fn, ln, i), subscriberId: `SUB-${10000 + i * 111}`,
      campaignId: randomPick(['Welcome', 'Product Launch', 'Newsletter', 'Winback']),
      opens: randomInt(0, 30), clicks: randomInt(0, 10), bounced: Math.random() > 0.9,
    };
  }),
  paidSocial: (count) => Array.from({ length: count }, () => ({
    ...baseRecord('paidSocial', 'Paid Social/Search', 'Marketing', 'realtime', 'marketing'),
    clickId: `gclid_${uuid()}`, deviceId: `ps_${uuid()}`,
    campaign: randomPick(['Summer Sale 2024', 'Black Friday Blitz', 'New Arrivals Q1', 'Retargeting']),
    adPlatform: randomPick(['Google Ads', 'Meta Ads', 'LinkedIn Ads']),
    spend: parseFloat((Math.random() * 50 + 0.5).toFixed(2)),
    impressions: randomInt(100, 10000), clicks: randomInt(1, 200),
  })),
  adImpressions: (count) => Array.from({ length: count }, () => ({
    ...baseRecord('adImpressions', 'Ad Impressions', 'Marketing', 'realtime', 'marketing'),
    deviceId: `ai_${uuid()}`, cookieId: `_ai_${randomInt(100000, 999999)}`,
    creativeId: `CR-${randomInt(1000, 9999)}`, placement: randomPick(['Banner', 'Interstitial', 'Native', 'Video']),
    viewability: randomInt(40, 100), ctr: parseFloat((Math.random() * 5).toFixed(2)),
  })),
  offlineCampaigns: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('offlineCampaigns', 'Offline Campaign', 'Marketing', 'batch', 'marketing'),
      email: messyEmail(fn, ln, i), phone: messyPhone(),
      firstName: messyName(fn), lastName: messyName(ln),
      campaignName: randomPick(['Direct Mail Q1', 'Trade Show NYC', 'Sponsorship Event', 'Print Ad']),
      responseFlag: Math.random() > 0.7,
    };
  }),
  marketo: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('marketo', 'Marketo', 'Marketing', 'batch', 'marketing'),
      marketoId: `MKT-${10000 + i * 111}`, firstName: messyName(fn), lastName: messyName(ln),
      email: messyEmail(fn, ln, i), emailOpens: randomInt(0, 40), emailClicks: randomInt(0, 15),
      lastCampaign: randomPick(['Welcome Series', 'Product Launch', 'Re-engagement', 'Loyalty Rewards']),
      subscribed: Math.random() > 0.2,
    };
  }),

  // ── Identity & Enrichment ───────────────────────────────────────────────────
  identityGraph: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('identityGraph', 'ID Graph', 'Identity & Enrichment', 'batch', 'event'),
      hashedEmail: `sha256_${uuid()}`, deviceId: `ig_${uuid()}`,
      email: messyEmail(fn, ln, i),
      idCluster: `CLU-${randomInt(1000, 9999)}`, confidence: randomPick(['high', 'medium', 'low']),
      linkType: randomPick(['deterministic', 'probabilistic']),
    };
  }),
  enrichment: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    return { ...baseRecord('enrichment', 'ZoomInfo Enrichment', 'Identity & Enrichment', 'batch', 'event'),
      email: messyEmail(fn, ln, i), domain: domains[i % domains.length],
      companyName: randomPick(['Acme Corp', 'TechFlow Inc', 'Global Retail', 'CloudNine']),
      industry: randomPick(['SaaS', 'Retail', 'Finance', 'Healthcare']),
      employeeCount: randomPick(['1-50', '51-200', '201-1000', '1000+']),
    };
  }),
  cleanRoom: (count) => Array.from({ length: count }, () => ({
    ...baseRecord('cleanRoom', 'Clean Room', 'Identity & Enrichment', 'batch', 'event'),
    hashedEmail: `sha256_${uuid()}`, segmentId: `SEG-${randomInt(1000, 9999)}`,
    partnerName: randomPick(['Retail Partner', 'Media Co', 'Financial Services']),
    audienceSegment: randomPick(['High-Value Shoppers', 'Auto Intenders', 'Frequent Travelers']),
    overlapCount: randomInt(1000, 50000), matchRate: randomInt(30, 90),
  })),

  // ── Analytics & Measurement ─────────────────────────────────────────────────
  ga4: (count) => Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length], ln = lastNames[i % lastNames.length];
    const hasLogin = i < Math.ceil(count * 0.6);
    return { ...baseRecord('ga4', 'GA4', 'Analytics & Measurement', 'realtime', 'behavioral'),
      deviceId: `ga_${uuid()}`, cookieId: `_ga_${randomInt(100000, 999999)}`,
      ipAddress: `${randomInt(10, 250)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
      ...(hasLogin ? { email: messyEmail(fn, ln, i) } : {}),
      pageViews: randomInt(1, 50), sessionDuration: randomInt(10, 600),
      lastPage: randomPick(['/products/tv', '/products/headphones', '/checkout', '/blog/deals', '/account/login']),
      timestamp: new Date(Date.now() - randomInt(0, 7 * 86400000)).toISOString(),
    };
  }),
  attribution: (count) => Array.from({ length: count }, (_, i) => ({
    ...baseRecord('attribution', 'Attribution Logs', 'Analytics & Measurement', 'batch', 'event'),
    customerId: `ATT-${10000 + i * 111}`, clickId: `attr_${uuid()}`,
    modelType: randomPick(['Last Touch', 'First Touch', 'Linear', 'Data-Driven']),
    channelCredit: parseFloat((Math.random() * 100).toFixed(1)),
    conversionId: `CONV-${randomInt(10000, 99999)}`,
  })),
  experimentation: (count) => Array.from({ length: count }, (_, i) => ({
    ...baseRecord('experimentation', 'A/B Tests', 'Analytics & Measurement', 'batch', 'event'),
    userId: `exp_${10000 + i * 111}`, deviceId: `exp_${uuid()}`,
    experimentId: randomPick(['EXP-001', 'EXP-002', 'EXP-003']),
    variant: randomPick(['Control', 'Variant A', 'Variant B']),
    metricValue: parseFloat((Math.random() * 10).toFixed(2)),
    significance: randomPick(['significant', 'not significant', 'trending']),
  })),
};

export function generateDataForSource(sourceId, count = 8) {
  const gen = generators[sourceId];
  if (!gen) return [];
  return gen(count);
}

// Additional non-inline exports for data constants used by store
export { firstNames, lastNames, cities, states, products, domains };
