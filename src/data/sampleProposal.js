const sampleProposal = {
  id: '52ab6cd3-5b06-4fe3-b36f-d45adeb7554d',
  proposalNumber: 'WPC-2026-00111',
  theme: 'dark',            // 'dark' | 'light' | 'auto' — admin-set default
  clientName: 'ELC Energy',
  clientLogo: null,        // Set to an image URL to show the client's logo in the hero
  recipientName: 'ahmed',
  termMonths: 36,
  createdAt: '2026-04-19',
  validUntil: '2026-05-19',

  company: {
    name: 'WorldPosta Technology LLC',
    // Hero logo next to client: optional per theme; one URL is used for both if the other is empty
    logo: { light: null, dark: null },
    description:
      'WorldPosta is the leading provider of enterprise-grade email security, cloud infrastructure, and cybersecurity services worldwide, with presence in 35 countries. We protect 1M+ users with 99.9% uptime and 24/7 expert support.',
    stats: [
      { icon: 'Users', value: '1M+', label: 'Protected Users' },
      { icon: 'Zap', value: '99.9%', label: 'Average Uptime' },
      { icon: 'Globe', value: '35', label: 'Countries Worldwide' },
      { icon: 'Headphones', value: '24/7', label: 'Expert Support' },
    ],
    certifications: [
      'ISO 27001 Certified',
      'SOC 2 Type II',
      'NCA Compliant (KSA)',
      'NESA Aligned (UAE)',
      'GDPR Ready',
    ],
    trustedLogos: [
      {
        name: 'coca',
        url: '/storage/logos/1/logo_1776538299689_385811521.jpg',
      },
    ],
  },

  salesContact: {
    name: 'Ahmed Habib',
    initials: 'AH',
    title: 'Your dedicated account manager',
    email: 'ahmed.habib@worldposta.com',
    phone: '+201234567890',
    whatsapp: '201234567890',
  },

  // ---------------------------------------------------------------------------
  // products — each product can display up to 3 content blocks chosen from
  // 5 available block types. The admin panel controls which types are selected
  // and in what order. Block types:
  //   'features'    — icon + title + description cards grid
  //   'why_choose'  — bulleted differentiator list
  //   'highlights'  — key metric strip (value + label)
  //   'comparison'  — competitor comparison table
  //   'use_cases'   — scenario/persona cards
  // ---------------------------------------------------------------------------
  products: [
    {
      id: 1,
      name: 'Posta Email Hosting',
      icon: 'Mail',
      subtitle: 'Enterprise Email Security & Hosting',
      description:
        'Posta delivers bank-grade email security with 99.9% uptime, protecting your organization from phishing, malware, and ransomware while ensuring seamless communication across your team.',

      // Admin selects 3 of 5 block types — order determines render order
      contentBlocks: [
        // ── Block type: features ──────────────────────────────────────────
        {
          type: 'features',
          heading: 'Core Capabilities',
          items: [
            {
              icon: 'Shield',
              title: 'Advanced Threat Protection',
              description:
                'Multi-layer spam filtering with 99.9% accuracy, zero-day threat detection, phishing & malware protection, and ransomware prevention with AI-powered sandboxing.',
            },
            {
              icon: 'Zap',
              title: 'Business Continuity',
              description:
                '99.9% uptime SLA with automatic failover, email archiving & e-discovery tools, disaster recovery included, and geo-redundant data centers.',
            },
            {
              icon: 'Lock',
              title: 'Compliance & Security',
              description:
                'End-to-end encryption (TLS/SSL), Data Loss Prevention (DLP), comprehensive audit logs & reporting, GDPR/NCA/NESA compliance support, and 2FA.',
            },
            {
              icon: 'Link2',
              title: 'Seamless Integration',
              description:
                'Microsoft 365 & Outlook compatible, mobile apps for iOS & Android, ActiveSync support, free migration assistance, and API access for automation.',
            },
          ],
        },

        // ── Block type: pricing_comparison ───────────────────────────────
        {
          type: 'pricing_comparison',
          heading: 'How We Compare on Pricing',
          columns: ['WorldPosta', 'Microsoft 365', 'Google Workspace'],
          rows: [
            { feature: 'Price per user / month',     values: ['$3.47',     '$6.00',    '$5.40'   ] },
            { feature: 'Minimum seats',              values: ['1',         '1',        '1'       ] },
            { feature: 'Annual contract discount',   values: ['20%',       '10%',      '10%'     ] },
            { feature: 'Setup / migration fee',      values: ['Free',      '$150',     'Free'    ] },
            { feature: 'Dedicated account manager',  values: ['Included',  'Extra',    '—'       ] },
            { feature: 'Regional data center (ME)',  values: ['Included',  'Add-on',   '—'       ] },
          ],
          note: 'Prices are indicative and may vary by seat count. Contact us for a customised enterprise quote.',
        },

        // ── Block type: comparison ────────────────────────────────────────
        {
          type: 'comparison',
          heading: 'How We Compare',
          // First column is always the vendor (highlighted in brand-green)
          columns: ['WorldPosta', 'Microsoft 365', 'Google Workspace'],
          rows: [
            {
              feature: 'Regional data centers (Egypt, KSA, UAE)',
              values: [true, false, false],
            },
            {
              feature: 'NCA & NESA compliance expertise',
              values: [true, false, false],
            },
            {
              feature: 'Arabic interface & native-language support',
              values: [true, false, false],
            },
            {
              feature: '99.9% uptime SLA with auto-failover',
              values: [true, true, true],
            },
            {
              feature: 'Dedicated account manager included',
              values: [true, false, false],
            },
            {
              feature: '30% lower cost vs. international providers',
              values: [true, false, false],
            },
          ],
        },

        // ── Block type: why_choose ────────────────────────────────────────
        {
          type: 'why_choose',
          heading: 'Why WorldPosta?',
          items: [
            'Regional data centers in Egypt, KSA & UAE for low latency and compliance',
            'Full Arabic & English interface with native-speaking support team',
            'NCA and NESA compliance expertise — we handle the regulations so you don\'t have to',
            '30% lower cost than international providers like Microsoft or Google',
            'Dedicated account manager included with every subscription',
          ],
        },

        // ── Unused block types (available for admin to activate) ──────────
        // {
        //   type: 'highlights',
        //   heading: 'By the Numbers',
        //   items: [
        //     { icon: 'Target',      value: '99.9%', label: 'Detection Accuracy' },
        //     { icon: 'Zap',         value: '<50ms', label: 'Threat Response' },
        //     { icon: 'ShieldCheck', value: '0',     label: 'False Positives' },
        //     { icon: 'Activity',    value: '24/7',  label: 'SOC Monitoring' },
        //   ],
        // },
        // {
        //   type: 'use_cases',
        //   heading: 'Built For Your Team',
        //   items: [
        //     { icon: 'Building2', title: 'Enterprise Teams',   description: 'Centralised email security for 100+ seat organisations with audit trails and DLP.' },
        //     { icon: 'ShieldCheck', title: 'Security Teams',  description: 'Real-time threat intelligence, SIEM integration, and SOC-ready dashboards.' },
        //     { icon: 'Settings2',  title: 'IT Administrators', description: 'One-click provisioning, Active Directory sync, and API-first management.' },
        //   ],
        // },
      ],
    },
  ],

  commitments: [
    {
      title: '30-Day Money-Back Guarantee',
      description: 'Not satisfied? Full refund, no questions asked.',
    },
    {
      title: '99.9% Uptime SLA',
      description: 'We guarantee reliability. Downtime credits automatic.',
    },
    {
      title: 'Zero-Risk Migration',
      description: 'We handle everything. If migration fails, we pay.',
    },
    {
      title: 'No Long-Term Lock-In',
      description: 'Month-to-month available. Cancel anytime after trial.',
    },
    {
      title: 'Price Protection',
      description:
        'Your rate locked for contract term. No surprise increases.',
    },
  ],

  lineItems: [
    {
      id: 1,
      name: 'Posta Business Plan',
      quantity: 150,
      unitPrice: 3.47,
      billingCycle: 'mo',
    },
  ],

  addOns: [
    { id: 1, name: 'Test Cloud VM', price: 10.0, pricingModel: 'per unit' },
    { id: 2, name: 'Test Consulting', price: 30.0, pricingModel: null },
    { id: 3, name: 'Test SOC', price: 100.0, pricingModel: null },
    { id: 4, name: 'Test Firewall', price: 25.0, pricingModel: null },
    { id: 5, name: 'Test Plan', price: 10.0, pricingModel: null },
    { id: 6, name: 'Test SaaS', price: 15.0, pricingModel: null },
  ],

  currency: 'USD',
  taxNote:
    'Prices shown exclude VAT and applicable taxes. Accepted payment methods: Stripe, bank transfer, or agreed terms.',

  // ---------------------------------------------------------------------------
  // sections — admin controls which sections are visible on the offer page.
  // Hero, Navbar, and Footer are always shown and not toggleable.
  // ---------------------------------------------------------------------------
  sections: {
    trustedBy:       true,
    datesBar:        true,
    about:           true,
    productDetails:  true,
    commitments:     true,
    salesContact:    true,
    quoteDetails:    true,
    addOns:          true,
    negotiateButton: true,
    chatButton:      true,
  },
}

export default sampleProposal
