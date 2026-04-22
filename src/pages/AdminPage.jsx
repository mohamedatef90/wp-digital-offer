import { useId, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ExternalLink, Save, ChevronUp, ChevronDown, Plus, Trash2,
  LayoutGrid, CheckCircle2, BarChart2, TableProperties, Users,
  FileText, Building2, CreditCard, Package, ShieldCheck,
  Layers, Eye, EyeOff, List, Tag, LayoutList, Minus,
  Sun, Moon, Monitor, Upload,
} from 'lucide-react'
import useProposalStore from '../store/useProposalStore'
import sampleProposal from '../data/sampleProposal'
import { normalizeCompanyLogoObject } from '../lib/companyLogo'

// ── Constants ────────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  'Mail','Shield','Zap','Lock','Link2','Users','Globe','Headphones',
  'Target','ShieldCheck','Activity','Building2','Settings2','Check',
  'Star','Award','Database','Cloud','Server','Cpu','Wifi','Clock',
  'AlertCircle','BarChart2','Package','Layers','Key','FileText',
]

const LAYOUT_OPTIONS = {
  features: [
    { value: 'grid',    label: 'Grid',    Icon: LayoutGrid },
    { value: 'list',    label: 'List',    Icon: List },
    { value: 'compact', label: 'Compact', Icon: LayoutList },
  ],
  why_choose: [
    { value: 'list',  label: 'List',  Icon: List },
    { value: 'cards', label: 'Cards', Icon: LayoutGrid },
    { value: 'pills', label: 'Pills', Icon: Tag },
  ],
  highlights: [
    { value: 'strip', label: 'Strip', Icon: Minus },
    { value: 'cards', label: 'Cards', Icon: LayoutGrid },
  ],
  use_cases: [
    { value: 'cards', label: 'Cards', Icon: LayoutGrid },
    { value: 'list',  label: 'List',  Icon: List },
  ],
}

const BLOCK_CATALOG = [
  {
    type: 'features',
    label: 'Feature Cards',
    Icon: LayoutGrid,
    description: 'Icon + title + description cards in a responsive grid. Best for capability breakdowns.',
    defaultBlock: () => ({
      type: 'features',
      layout: 'grid',
      heading: 'Core Capabilities',
      items: [{ icon: 'Shield', title: 'Feature Name', description: 'Describe this feature in 1–2 sentences.' }],
    }),
  },
  {
    type: 'why_choose',
    label: 'Why Choose List',
    Icon: CheckCircle2,
    description: 'Bulleted list of differentiators. Best for competitive positioning.',
    defaultBlock: () => ({
      type: 'why_choose',
      layout: 'list',
      heading: 'Why Choose Us?',
      items: ['Key differentiator goes here.'],
    }),
  },
  {
    type: 'highlights',
    label: 'Key Metrics',
    Icon: BarChart2,
    description: 'Metric strip with quantified proof points. Best for showing numbers.',
    defaultBlock: () => ({
      type: 'highlights',
      layout: 'strip',
      heading: 'By the Numbers',
      items: [
        { icon: 'Target',      value: '—', label: 'Metric Label' },
        { icon: 'Zap',         value: '—', label: 'Metric Label' },
        { icon: 'ShieldCheck', value: '—', label: 'Metric Label' },
        { icon: 'Activity',    value: '—', label: 'Metric Label' },
      ],
    }),
  },
  {
    type: 'comparison',
    label: 'Comparison Table',
    Icon: TableProperties,
    description: 'Side-by-side comparison vs. competitors. First column is always your product.',
    defaultBlock: () => ({
      type: 'comparison',
      heading: 'How We Compare',
      columns: ['Our Product', 'Competitor A', 'Competitor B'],
      rows: [{ feature: 'Feature name', values: [true, false, false] }],
    }),
  },
  {
    type: 'use_cases',
    label: 'Use Cases',
    Icon: Users,
    description: 'Persona/scenario cards showing who benefits and how.',
    defaultBlock: () => ({
      type: 'use_cases',
      layout: 'cards',
      heading: 'Built For Your Team',
      items: [
        { icon: 'Building2',  title: 'Audience Title',   description: 'Describe how they benefit.' },
        { icon: 'ShieldCheck', title: 'Audience Title',  description: 'Describe how they benefit.' },
        { icon: 'Settings2',  title: 'Audience Title',   description: 'Describe how they benefit.' },
      ],
    }),
  },
  {
    type: 'pricing_comparison',
    label: 'Pricing Comparison',
    Icon: CreditCard,
    description: 'Side-by-side pricing table vs. competitors. Each cell holds a text value (price, %, Free, etc.).',
    defaultBlock: () => ({
      type: 'pricing_comparison',
      heading: 'How We Compare on Pricing',
      columns: ['Our Product', 'Competitor A', 'Competitor B'],
      rows: [
        { feature: 'Price per user / month', values: ['', '', ''] },
        { feature: 'Setup fee',              values: ['Free', '', ''] },
      ],
      note: '',
    }),
  },
]

const SECTIONS = [
  { id: 'offer',       label: 'Offer Info',    Icon: FileText,    description: 'Client details, proposal number, dates, currency, and tax note.' },
  { id: 'products',    label: 'Products',       Icon: Package,     description: 'Product name, description, and content blocks shown on the offer.' },
  { id: 'company',     label: 'Company',        Icon: Building2,   description: 'Company profile, key stats, certifications, and trusted logos.' },
  { id: 'commitments', label: 'Commitments',    Icon: ShieldCheck, description: 'SLA guarantees and risk-reduction cards shown before the signature.' },
  { id: 'sections',    label: 'Visibility',     Icon: Layers,      description: 'Toggle which sections appear on the client-facing offer page.' },
]

// Sidebar navigation groups
const NAV_GROUPS = [
  { label: 'Proposal',    ids: ['offer', 'products'] },
  { label: 'Company',    ids: ['company'] },
  { label: 'Commitments', ids: ['commitments'] },
  { label: 'Settings',   ids: ['sections'] },
]

// Which sections the admin can toggle on/off, in proposal-page order
const SECTION_CATALOG = [
  {
    key: 'trustedBy',
    label: 'Trusted By Logos',
    description: 'Logo carousel showing partner and client organizations.',
    alwaysNote: null,
  },
  {
    key: 'datesBar',
    label: 'Dates Bar',
    description: 'Quote creation date, valid-until date, and validity progress.',
    alwaysNote: null,
  },
  {
    key: 'about',
    label: 'About Company',
    description: 'Company description, key stats, and certification badges.',
    alwaysNote: null,
  },
  {
    key: 'productDetails',
    label: 'Product Details',
    description: 'Product features, comparisons, and content blocks.',
    alwaysNote: null,
  },
  {
    key: 'commitments',
    label: 'Commitments',
    description: 'SLA guarantees and risk-reduction cards.',
    alwaysNote: null,
  },
  {
    key: 'salesContact',
    label: 'Sales Contact',
    description: 'Account manager card with email, phone, and WhatsApp.',
    alwaysNote: null,
  },
  {
    key: 'quoteDetails',
    label: 'Pricing Table',
    description: 'Line items, totals, term breakdown, and tax note.',
    alwaysNote: null,
  },
  {
    key: 'addOns',
    label: 'Add-ons',
    description: 'Recommended additional services and upsell items.',
    alwaysNote: null,
  },
  {
    key: 'negotiateButton',
    label: 'Counter-offer CTA',
    description: '"Not quite right?" negotiation prompt and button.',
    alwaysNote: null,
  },
  {
    key: 'chatButton',
    label: 'Chat Button',
    description: 'Floating chat support button (bottom-right corner).',
    alwaysNote: null,
  },
]

// ── Layout picker ────────────────────────────────────────────────────────────

function LayoutPicker({ blockType, value, onChange }) {
  const options = LAYOUT_OPTIONS[blockType]
  if (!options) return null
  const current = value || options[0].value
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.07em] mb-2">Layout</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => {
          const active = current === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 ${
                active
                  ? 'bg-brand-green/10 border-brand-green/40 text-brand-green'
                  : 'bg-[#f8f8f8] border-gray-200 text-gray-500 hover:border-brand-green/30 hover:text-brand-green/80'
              }`}
            >
              <opt.Icon size={13} strokeWidth={2} />
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Shared UI primitives ─────────────────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-[0.07em] mb-1.5">
        {label}
        {hint && <span className="ml-2 text-[10px] font-normal normal-case tracking-normal text-gray-500/60">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-[#f8f8f8] border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#293c51] placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50 focus:border-brand-green/40 transition-colors'

function Input({ label, hint, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <input className={inputCls} {...props} />
    </Field>
  )
}

function Textarea({ label, hint, rows = 3, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className={inputCls + ' resize-none leading-relaxed'} rows={rows} {...props} />
    </Field>
  )
}

/** URL or local upload (data URL) for a single theme’s company logo in the hero */
function CompanyLogoUrlField({ label, hint, value, onUrlChange, onFileAsDataUrl }) {
  const id = useId()
  const fileInputId = `company-logo-file-${id}`

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-stretch">
        <input
          className={inputCls + ' flex-1 min-w-0'}
          value={value}
          placeholder="https://… or upload"
          onChange={(e) => onUrlChange(e.target.value || null)}
        />
        <label
          htmlFor={fileInputId}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#293c51] transition-colors hover:bg-gray-50"
          title="Upload (saved as a data URL in the browser; prefer a hosted URL for large files)"
        >
          <Upload size={15} />
          Upload
        </label>
        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (!file || !file.type.startsWith('image/')) return
            if (file.size > 2 * 1024 * 1024) {
              toast.error('File must be under 2 MB. Use a link for larger images.')
              return
            }
            const reader = new FileReader()
            reader.onload = () => onFileAsDataUrl(String(reader.result))
            reader.readAsDataURL(file)
          }}
        />
      </div>
    </Field>
  )
}

function SelectField({ label, hint, options, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <select className={inputCls + ' cursor-pointer'} {...props}>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </Field>
  )
}

function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-[14px] overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-[#293c51]">{title}</h3>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function IconBtn({ onClick, title, children, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${danger ? 'text-red-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  )
}

function AddBtn({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-green-light transition-colors mt-2"
    >
      <Plus size={13} strokeWidth={2.5} />
      {label}
    </button>
  )
}

// ── Block editors ────────────────────────────────────────────────────────────

function FeaturesEditor({ block, onChange }) {
  const set = (items) => onChange({ ...block, items })
  return (
    <div className="flex flex-col gap-3">
      {block.items.map((item, i) => (
        <div key={i} className="bg-[#f8f8f8] border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-500">Item {i + 1}</span>
            <IconBtn danger title="Remove item" onClick={() => set(block.items.filter((_, j) => j !== i))}>
              <Trash2 size={13} />
            </IconBtn>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Icon"
              options={ICON_OPTIONS}
              value={item.icon}
              onChange={(e) => set(block.items.map((it, j) => j === i ? { ...it, icon: e.target.value } : it))}
            />
            <Input
              label="Title"
              value={item.title}
              onChange={(e) => set(block.items.map((it, j) => j === i ? { ...it, title: e.target.value } : it))}
            />
          </div>
          <Textarea
            label="Description"
            rows={2}
            value={item.description}
            onChange={(e) => set(block.items.map((it, j) => j === i ? { ...it, description: e.target.value } : it))}
          />
        </div>
      ))}
      <AddBtn label="Add feature" onClick={() => set([...block.items, { icon: 'Shield', title: '', description: '' }])} />
    </div>
  )
}

function WhyChooseEditor({ block, onChange }) {
  const set = (items) => onChange({ ...block, items })
  return (
    <div className="flex flex-col gap-2">
      {block.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-5 shrink-0 text-center">{i + 1}</span>
          <input
            className={inputCls}
            value={item}
            placeholder="Differentiator text…"
            onChange={(e) => set(block.items.map((it, j) => j === i ? e.target.value : it))}
          />
          <IconBtn danger title="Remove" onClick={() => set(block.items.filter((_, j) => j !== i))}>
            <Trash2 size={13} />
          </IconBtn>
        </div>
      ))}
      <AddBtn label="Add item" onClick={() => set([...block.items, ''])} />
    </div>
  )
}

function HighlightsEditor({ block, onChange }) {
  const set = (items) => onChange({ ...block, items })
  return (
    <div className="flex flex-col gap-3">
      {block.items.map((item, i) => (
        <div key={i} className="bg-[#f8f8f8] border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Metric {i + 1}</span>
            <IconBtn danger title="Remove" onClick={() => set(block.items.filter((_, j) => j !== i))}>
              <Trash2 size={13} />
            </IconBtn>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <SelectField
              label="Icon"
              options={ICON_OPTIONS}
              value={item.icon}
              onChange={(e) => set(block.items.map((it, j) => j === i ? { ...it, icon: e.target.value } : it))}
            />
            <Input
              label="Value"
              placeholder="99.9%"
              value={item.value}
              onChange={(e) => set(block.items.map((it, j) => j === i ? { ...it, value: e.target.value } : it))}
            />
            <Input
              label="Label"
              placeholder="Uptime"
              value={item.label}
              onChange={(e) => set(block.items.map((it, j) => j === i ? { ...it, label: e.target.value } : it))}
            />
          </div>
        </div>
      ))}
      <AddBtn label="Add metric" onClick={() => set([...block.items, { icon: 'Target', value: '', label: '' }])} />
    </div>
  )
}

function ComparisonEditor({ block, onChange }) {
  const setBlock = (patch) => onChange({ ...block, ...patch })

  const updateColumn = (i, val) => {
    const cols = block.columns.map((c, j) => j === i ? val : c)
    setBlock({ columns: cols })
  }

  const addColumn = () => {
    const cols = [...block.columns, 'Competitor']
    const rows = block.rows.map((r) => ({ ...r, values: [...r.values, false] }))
    setBlock({ columns: cols, rows })
  }

  const removeColumn = (i) => {
    if (block.columns.length <= 2) return
    const cols = block.columns.filter((_, j) => j !== i)
    const rows = block.rows.map((r) => ({ ...r, values: r.values.filter((_, j) => j !== i) }))
    setBlock({ columns: cols, rows })
  }

  const updateRow = (ri, patch) => {
    setBlock({ rows: block.rows.map((r, j) => j === ri ? { ...r, ...patch } : r) })
  }

  const toggleValue = (ri, vi) => {
    const row = block.rows[ri]
    const values = row.values.map((v, j) => j === vi ? !v : v)
    updateRow(ri, { values })
  }

  const addRow = () => {
    setBlock({ rows: [...block.rows, { feature: '', values: block.columns.map(() => false) }] })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Column headers */}
      <div>
        <Field label="Competitor columns" hint="First column is your product (always highlighted)">
          <div className="flex flex-col gap-2 mt-1">
            {block.columns.map((col, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`text-xs w-4 shrink-0 text-center font-bold ${i === 0 ? 'text-brand-green' : 'text-gray-500'}`}>{i + 1}</span>
                <input
                  className={inputCls + (i === 0 ? ' border-brand-green/30' : '')}
                  value={col}
                  onChange={(e) => updateColumn(i, e.target.value)}
                />
                {i > 0 && (
                  <IconBtn danger title="Remove column" onClick={() => removeColumn(i)}>
                    <Trash2 size={13} />
                  </IconBtn>
                )}
              </div>
            ))}
          </div>
        </Field>
        {block.columns.length < 4 && (
          <AddBtn label="Add competitor column" onClick={addColumn} />
        )}
      </div>

      {/* Feature rows */}
      <div>
        <Field label="Feature rows">
          <div className="flex flex-col gap-2 mt-1">
            {block.rows.map((row, ri) => (
              <div key={ri} className="bg-[#f8f8f8] border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    className={inputCls}
                    placeholder="Feature name…"
                    value={row.feature}
                    onChange={(e) => updateRow(ri, { feature: e.target.value })}
                  />
                  <IconBtn danger title="Remove row" onClick={() => setBlock({ rows: block.rows.filter((_, j) => j !== ri) })}>
                    <Trash2 size={13} />
                  </IconBtn>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {block.columns.map((col, vi) => (
                    <button
                      key={vi}
                      type="button"
                      onClick={() => toggleValue(ri, vi)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        row.values[vi]
                          ? vi === 0
                            ? 'bg-brand-green/15 border-brand-green/30 text-brand-green'
                            : 'bg-white/[0.06] border-gray-300 text-gray-500'
                          : 'bg-transparent border-gray-200 text-gray-400'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-sm border flex items-center justify-center ${row.values[vi] ? vi === 0 ? 'bg-brand-green border-brand-green' : 'bg-gray-300 border-gray-400' : 'border-gray-300'}`}>
                        {row.values[vi] && <span className="text-[8px] font-extrabold text-white leading-none">✓</span>}
                      </span>
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Field>
        <AddBtn label="Add feature row" onClick={addRow} />
      </div>
    </div>
  )
}

function PricingComparisonEditor({ block, onChange }) {
  const setBlock = (patch) => onChange({ ...block, ...patch })

  const updateColumn = (i, val) => {
    const cols = block.columns.map((c, j) => j === i ? val : c)
    // keep row values length in sync
    setBlock({ columns: cols })
  }

  const addColumn = () => {
    if (block.columns.length >= 4) return
    const cols = [...block.columns, 'Competitor']
    const rows = block.rows.map((r) => ({ ...r, values: [...r.values, ''] }))
    setBlock({ columns: cols, rows })
  }

  const removeColumn = (i) => {
    if (block.columns.length <= 2) return
    const cols = block.columns.filter((_, j) => j !== i)
    const rows = block.rows.map((r) => ({ ...r, values: r.values.filter((_, j) => j !== i) }))
    setBlock({ columns: cols, rows })
  }

  const updateRowFeature = (ri, val) => {
    setBlock({ rows: block.rows.map((r, j) => j === ri ? { ...r, feature: val } : r) })
  }

  const updateCellValue = (ri, vi, val) => {
    const rows = block.rows.map((r, j) => {
      if (j !== ri) return r
      return { ...r, values: r.values.map((v, k) => k === vi ? val : v) }
    })
    setBlock({ rows })
  }

  const addRow = () => {
    setBlock({ rows: [...block.rows, { feature: '', values: block.columns.map(() => '') }] })
  }

  const removeRow = (ri) => {
    setBlock({ rows: block.rows.filter((_, j) => j !== ri) })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Columns */}
      <div>
        <Field label="Competitor columns" hint="First column is your product (highlighted in green)">
          <div className="flex flex-col gap-2 mt-1">
            {block.columns.map((col, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`text-xs w-4 shrink-0 text-center font-bold ${i === 0 ? 'text-brand-green' : 'text-gray-400'}`}>{i + 1}</span>
                <input
                  className={inputCls + (i === 0 ? ' border-brand-green/30' : '')}
                  value={col}
                  placeholder={i === 0 ? 'Your product name' : `Competitor ${i}`}
                  onChange={(e) => updateColumn(i, e.target.value)}
                />
                {i > 0 && (
                  <IconBtn danger title="Remove column" onClick={() => removeColumn(i)}>
                    <Trash2 size={13} />
                  </IconBtn>
                )}
              </div>
            ))}
          </div>
        </Field>
        {block.columns.length < 4 && (
          <AddBtn label="Add competitor column" onClick={addColumn} />
        )}
      </div>

      {/* Rows */}
      <div>
        <Field label="Pricing rows">
          <div className="flex flex-col gap-2 mt-1">
            {block.rows.map((row, ri) => (
              <div key={ri} className="bg-[#f8f8f8] border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    className={inputCls + ' flex-1'}
                    placeholder="Row label (e.g. Price per user / month)"
                    value={row.feature}
                    onChange={(e) => updateRowFeature(ri, e.target.value)}
                  />
                  <IconBtn danger title="Remove row" onClick={() => removeRow(ri)}>
                    <Trash2 size={13} />
                  </IconBtn>
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${block.columns.length}, 1fr)` }}>
                  {block.columns.map((col, vi) => (
                    <div key={vi}>
                      <div className={`text-[10px] font-semibold mb-1 truncate ${vi === 0 ? 'text-brand-green' : 'text-gray-400'}`}>{col || `Col ${vi + 1}`}</div>
                      <input
                        className={inputCls + (vi === 0 ? ' border-brand-green/30 font-semibold' : '')}
                        placeholder="e.g. $3.47 or Free or —"
                        value={row.values[vi] ?? ''}
                        onChange={(e) => updateCellValue(ri, vi, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Field>
        <AddBtn label="Add pricing row" onClick={addRow} />
      </div>

      {/* Note */}
      <Textarea
        label="Footer note (optional)"
        hint="Appears below the table in small text"
        rows={2}
        value={block.note || ''}
        onChange={(e) => setBlock({ note: e.target.value })}
      />
    </div>
  )
}

function UseCasesEditor({ block, onChange }) {
  const set = (items) => onChange({ ...block, items })
  return (
    <div className="flex flex-col gap-3">
      {block.items.map((item, i) => (
        <div key={i} className="bg-[#f8f8f8] border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Use Case {i + 1}</span>
            <IconBtn danger title="Remove" onClick={() => set(block.items.filter((_, j) => j !== i))}>
              <Trash2 size={13} />
            </IconBtn>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Icon"
              options={ICON_OPTIONS}
              value={item.icon}
              onChange={(e) => set(block.items.map((it, j) => j === i ? { ...it, icon: e.target.value } : it))}
            />
            <Input
              label="Title"
              value={item.title}
              onChange={(e) => set(block.items.map((it, j) => j === i ? { ...it, title: e.target.value } : it))}
            />
          </div>
          <Textarea
            label="Description"
            rows={2}
            value={item.description}
            onChange={(e) => set(block.items.map((it, j) => j === i ? { ...it, description: e.target.value } : it))}
          />
        </div>
      ))}
      <AddBtn label="Add use case" onClick={() => set([...block.items, { icon: 'Building2', title: '', description: '' }])} />
    </div>
  )
}

const BLOCK_EDITORS = {
  features:           FeaturesEditor,
  why_choose:         WhyChooseEditor,
  highlights:         HighlightsEditor,
  comparison:         ComparisonEditor,
  pricing_comparison: PricingComparisonEditor,
  use_cases:          UseCasesEditor,
}

// ── Block type selector + ordered block list ─────────────────────────────────

function BlockTypeSelector({ contentBlocks, onChange }) {
  const [addPickerOpen, setAddPickerOpen] = useState(false)
  const selectedTypes = contentBlocks.map((b) => b.type)

  // Toggle: clicking a catalog card adds or removes that block type.
  // All 5 types may be selected simultaneously.
  const toggle = (catalog) => {
    const idx = selectedTypes.indexOf(catalog.type)
    if (idx !== -1) {
      onChange(contentBlocks.filter((b) => b.type !== catalog.type))
    } else {
      onChange([...contentBlocks, catalog.defaultBlock()])
    }
  }

  // Add another instance of a block type (duplicate allowed via the "+ Add Section" picker)
  const addBlock = (catalog) => {
    onChange([...contentBlocks, catalog.defaultBlock()])
    setAddPickerOpen(false)
  }

  const moveUp = (i) => {
    if (i === 0) return
    const next = [...contentBlocks]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next)
  }

  const moveDown = (i) => {
    if (i === contentBlocks.length - 1) return
    const next = [...contentBlocks]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    onChange(next)
  }

  const updateBlock = (i, updated) => {
    onChange(contentBlocks.map((b, j) => j === i ? updated : b))
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Block type picker — click to toggle, all 5 selectable */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.07em] mb-3">
          Select content blocks — {contentBlocks.length} chosen
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BLOCK_CATALOG.map((catalog) => {
            const isSelected = selectedTypes.includes(catalog.type)
            // Count how many times this type appears (for duplicate display)
            const count = contentBlocks.filter((b) => b.type === catalog.type).length
            return (
              <button
                key={catalog.type}
                type="button"
                onClick={() => toggle(catalog)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-green/[0.08] border-brand-green/40 shadow-[0_0_0_1px_rgba(103,154,65,0.15)]'
                    : 'bg-[#f8f8f8] border-gray-200 hover:border-brand-green/25 hover:bg-gray-100 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-brand-green/20 text-brand-green' : 'bg-gray-100 text-gray-500'}`}>
                    <catalog.Icon size={14} strokeWidth={2} />
                  </div>
                  {isSelected && (
                    <span className="text-[11px] font-extrabold text-brand-green bg-brand-green/15 border border-brand-green/30 rounded-full min-w-5 h-5 px-1 flex items-center justify-center shrink-0">
                      {count > 1 ? `×${count}` : '✓'}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-[#293c51] mb-1">{catalog.label}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{catalog.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected blocks in order with editors */}
      {contentBlocks.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.07em]">
            Configure selected blocks
          </p>
          {contentBlocks.map((block, i) => {
            const catalog = BLOCK_CATALOG.find((c) => c.type === block.type)
            const Editor = BLOCK_EDITORS[block.type]
            return (
              <div key={`${block.type}-${i}`} className="bg-[#f8f8f8] border border-gray-200 rounded-xl overflow-hidden">
                {/* Block header */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-200 bg-gray-100/40">
                  <span className="text-[11px] font-extrabold text-brand-green bg-brand-green/15 border border-brand-green/30 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="p-1 rounded-md bg-brand-green/10 text-brand-green">
                    {catalog && <catalog.Icon size={13} strokeWidth={2} />}
                  </div>
                  <span className="text-sm font-bold text-[#293c51] flex-1">{catalog?.label}</span>
                  <div className="flex items-center gap-1">
                    <IconBtn title="Move up" onClick={() => moveUp(i)} disabled={i === 0}>
                      <ChevronUp size={14} />
                    </IconBtn>
                    <IconBtn title="Move down" onClick={() => moveDown(i)} disabled={i === contentBlocks.length - 1}>
                      <ChevronDown size={14} />
                    </IconBtn>
                    <IconBtn danger title="Remove block" onClick={() => onChange(contentBlocks.filter((_, j) => j !== i))}>
                      <Trash2 size={13} />
                    </IconBtn>
                  </div>
                </div>

                {/* Block content editor */}
                <div className="p-5 flex flex-col gap-4">
                  <LayoutPicker
                    blockType={block.type}
                    value={block.layout}
                    onChange={(layout) => updateBlock(i, { ...block, layout })}
                  />
                  <Input
                    label="Section heading"
                    hint="optional"
                    value={block.heading || ''}
                    placeholder="e.g. Core Capabilities"
                    onChange={(e) => updateBlock(i, { ...block, heading: e.target.value })}
                  />
                  {Editor && <Editor block={block} onChange={(updated) => updateBlock(i, updated)} />}
                </div>
              </div>
            )
          })}

          {/* Add another section */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAddPickerOpen((v) => !v)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:border-brand-green/40 hover:text-brand-green hover:bg-brand-green/[0.04] transition-all duration-200"
            >
              <Plus size={15} />
              Add another section
            </button>

            {addPickerOpen && (
              <div className="mt-2 bg-gray-100 border border-gray-300 rounded-xl overflow-hidden shadow-xl">
                <p className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.07em] border-b border-gray-200">
                  Choose block type
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
                  {BLOCK_CATALOG.map((catalog) => (
                    <button
                      key={catalog.type}
                      type="button"
                      onClick={() => addBlock(catalog)}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-[#f8f8f8] text-left transition-colors duration-150"
                    >
                      <div className="p-1.5 rounded-lg bg-[#f8f8f8] text-gray-500 shrink-0">
                        <catalog.Icon size={13} strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#293c51]">{catalog.label}</p>
                        <p className="text-[11px] text-gray-500">{catalog.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state: no blocks selected yet — show add picker inline */}
      {contentBlocks.length === 0 && (
        <p className="text-[13px] text-gray-500 text-center py-4">
          Select one or more block types above to build the product section.
        </p>
      )}
    </div>
  )
}

// ── Section form components ──────────────────────────────────────────────────

function OfferInfoSection({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val })
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Client">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Client Name" value={data.clientName} onChange={(e) => set('clientName', e.target.value)} />
          <Input label="Recipient Name" value={data.recipientName} onChange={(e) => set('recipientName', e.target.value)} />
          <CompanyLogoUrlField
            label="Client Logo"
            hint="leave blank for placeholder"
            value={data.clientLogo || ''}
            onUrlChange={(val) => set('clientLogo', val)}
            onFileAsDataUrl={(val) => set('clientLogo', val)}
          />
          <Input label="Proposal Number" value={data.proposalNumber} onChange={(e) => set('proposalNumber', e.target.value)} />
        </div>
      </SectionCard>

      <SectionCard title="Terms & Dates">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Term (months)" type="number" min="1" value={data.termMonths} onChange={(e) => set('termMonths', Number(e.target.value))} />
          <SelectField label="Currency" options={['USD', 'EUR', 'GBP', 'SAR', 'AED', 'EGP']} value={data.currency} onChange={(e) => set('currency', e.target.value)} />
          <Input label="Created Date" type="date" value={data.createdAt} onChange={(e) => set('createdAt', e.target.value)} />
          <Input label="Valid Until" type="date" value={data.validUntil} onChange={(e) => set('validUntil', e.target.value)} />
        </div>
      </SectionCard>

      <SectionCard title="Tax Note">
        <Textarea
          label="Tax / payment note"
          hint="shown below the pricing table"
          rows={2}
          value={data.taxNote}
          onChange={(e) => set('taxNote', e.target.value)}
        />
      </SectionCard>
    </div>
  )
}

function ProductsSection({ data, onChange }) {
  const setProducts = (products) => onChange({ ...data, products })

  const updateProduct = (i, patch) =>
    setProducts(data.products.map((p, j) => j === i ? { ...p, ...patch } : p))

  return (
    <div className="flex flex-col gap-6">
      {data.products.map((product, i) => (
        <div key={product.id} className="flex flex-col gap-4">
          <SectionCard title={`Product: ${product.name}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Product Name" value={product.name} onChange={(e) => updateProduct(i, { name: e.target.value })} />
              <SelectField label="Icon" options={ICON_OPTIONS} value={product.icon} onChange={(e) => updateProduct(i, { icon: e.target.value })} />
              <div className="sm:col-span-2">
                <Input label="Subtitle" value={product.subtitle} onChange={(e) => updateProduct(i, { subtitle: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Textarea label="Description" rows={3} value={product.description} onChange={(e) => updateProduct(i, { description: e.target.value })} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Content Blocks">
            <BlockTypeSelector
              contentBlocks={product.contentBlocks || []}
              onChange={(blocks) => updateProduct(i, { contentBlocks: blocks })}
            />
          </SectionCard>
        </div>
      ))}
    </div>
  )
}

function CompanySection({ data, onChange }) {
  const co = data.company
  const setCo = (patch) => onChange({ ...data, company: { ...co, ...patch } })

  const updateStat = (i, patch) =>
    setCo({ stats: co.stats.map((s, j) => j === i ? { ...s, ...patch } : s) })

  const updateCert = (i, val) =>
    setCo({ certifications: co.certifications.map((c, j) => j === i ? val : c) })

  const updateLogo = (i, patch) =>
    setCo({ trustedLogos: co.trustedLogos.map((l, j) => j === i ? { ...l, ...patch } : l) })

  const removeLogo = (i) =>
    setCo({ trustedLogos: co.trustedLogos.filter((_, j) => j !== i) })

  const addLogo = () =>
    setCo({ trustedLogos: [...co.trustedLogos, { name: '', url: '' }] })

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Company Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Company Name" value={co.name} onChange={(e) => setCo({ name: e.target.value })} />
          <div className="sm:col-span-2 text-[12px] text-gray-500 leading-relaxed -mt-1 mb-0">
            Your company logo in the offer hero: set light and/or dark. If you only set one, it is used in both
            themes.
          </div>
          {(() => {
            const logo = normalizeCompanyLogoObject(co.logo)
            const setLogo = (patch) => {
              const merged = { ...logo, ...patch }
              const l =
                merged.light && String(merged.light).trim() ? String(merged.light).trim() : null
              const d =
                merged.dark && String(merged.dark).trim() ? String(merged.dark).trim() : null
              setCo({ logo: l == null && d == null ? null : { light: l, dark: d } })
            }
            return (
              <>
                <CompanyLogoUrlField
                  label="Your logo — light theme"
                  hint="hero, next to client"
                  value={logo.light || ''}
                  onUrlChange={(v) => setLogo({ light: v })}
                  onFileAsDataUrl={(u) => setLogo({ light: u })}
                />
                <CompanyLogoUrlField
                  label="Your logo — dark theme"
                  hint="optional; same as light if empty"
                  value={logo.dark || ''}
                  onUrlChange={(v) => setLogo({ dark: v })}
                  onFileAsDataUrl={(u) => setLogo({ dark: u })}
                />
              </>
            )
          })()}
          <div className="sm:col-span-2">
            <Textarea label="Description" rows={4} value={co.description} onChange={(e) => setCo({ description: e.target.value })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Stats">
        <div className="flex flex-col gap-3">
          {co.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-end">
              <SelectField label="Icon" options={ICON_OPTIONS} value={stat.icon} onChange={(e) => updateStat(i, { icon: e.target.value })} />
              <Input label="Value" value={stat.value} onChange={(e) => updateStat(i, { value: e.target.value })} />
              <Input label="Label" value={stat.label} onChange={(e) => updateStat(i, { label: e.target.value })} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Certifications">
        <div className="flex flex-col gap-2">
          {co.certifications.map((cert, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={inputCls} value={cert} onChange={(e) => updateCert(i, e.target.value)} />
              <IconBtn danger title="Remove" onClick={() => setCo({ certifications: co.certifications.filter((_, j) => j !== i) })}>
                <Trash2 size={13} />
              </IconBtn>
            </div>
          ))}
          <AddBtn label="Add certification" onClick={() => setCo({ certifications: [...co.certifications, ''] })} />
        </div>
      </SectionCard>

      <SectionCard title="Trusted Logos">
        <div className="flex flex-col gap-3">
          {co.trustedLogos.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-2">
              No logos yet. Add client or partner logos to show the Trusted By strip.
            </p>
          )}
          {co.trustedLogos.map((logo, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#f8f8f8] border border-gray-200 rounded-xl p-3">
              {/* Live preview */}
              <div className="w-14 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                {logo.url ? (
                  <img
                    src={logo.url}
                    alt={logo.name || 'logo'}
                    className="max-h-8 max-w-[48px] object-contain"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider select-none">Logo</span>
                )}
              </div>

              {/* Inputs */}
              <div className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0">
                <input
                  className={inputCls + ' flex-1'}
                  placeholder="Name (e.g. Coca-Cola)"
                  value={logo.name}
                  onChange={(e) => updateLogo(i, { name: e.target.value })}
                />
                <input
                  className={inputCls + ' flex-[2]'}
                  placeholder="Image URL or /storage/logos/…"
                  value={logo.url}
                  onChange={(e) => updateLogo(i, { url: e.target.value })}
                />
              </div>

              <IconBtn danger title="Remove logo" onClick={() => removeLogo(i)}>
                <Trash2 size={13} />
              </IconBtn>
            </div>
          ))}
          <AddBtn label="Add logo" onClick={addLogo} />
        </div>
      </SectionCard>
    </div>
  )
}

function CommitmentsSection({ data, onChange }) {
  const set = (commitments) => onChange({ ...data, commitments })
  return (
    <SectionCard title="Commitment Cards">
      <div className="flex flex-col gap-3">
        {data.commitments.map((c, i) => (
          <div key={i} className="bg-[#f8f8f8] border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Commitment {i + 1}</span>
              <IconBtn danger title="Remove" onClick={() => set(data.commitments.filter((_, j) => j !== i))}>
                <Trash2 size={13} />
              </IconBtn>
            </div>
            <Input label="Title" value={c.title} onChange={(e) => set(data.commitments.map((it, j) => j === i ? { ...it, title: e.target.value } : it))} />
            <Textarea label="Description" rows={2} value={c.description} onChange={(e) => set(data.commitments.map((it, j) => j === i ? { ...it, description: e.target.value } : it))} />
          </div>
        ))}
        <AddBtn label="Add commitment" onClick={() => set([...data.commitments, { title: '', description: '' }])} />
      </div>
    </SectionCard>
  )
}

// ── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60 ${
        checked ? 'bg-brand-green border-brand-green' : 'bg-gray-100 border-gray-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out mt-[2px] ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

// ── Sections visibility manager ───────────────────────────────────────────────

const THEME_OPTIONS = [
  { value: 'dark',  label: 'Dark',  Icon: Moon,    description: 'Dark background — best for focused reading.' },
  { value: 'light', label: 'Light', Icon: Sun,     description: 'Light background — clean and familiar.' },
  { value: 'auto',  label: 'Auto',  Icon: Monitor, description: 'Follows the client\'s system preference.' },
]

function SectionsSection({ data, onChange }) {
  const sections = data.sections ?? {}
  const currentTheme = data.theme ?? 'dark'
  const setSection = (key, val) =>
    onChange({ ...data, sections: { ...sections, [key]: val } })

  const allOn  = SECTION_CATALOG.every((c) => sections[c.key] !== false)

  const toggleAll = () => {
    const next = allOn ? false : true
    const updated = {}
    SECTION_CATALOG.forEach((c) => { updated[c.key] = next })
    onChange({ ...data, sections: { ...sections, ...updated } })
  }

  const visibleCount = SECTION_CATALOG.filter((c) => sections[c.key] !== false).length

  return (
    <div className="flex flex-col gap-4">

      {/* ── Default theme ── */}
      <div className="bg-white border border-gray-200 rounded-[14px] px-6 py-5">
        <p className="text-sm font-bold text-[#293c51] mb-0.5">Default Page Theme</p>
        <p className="text-xs text-gray-500 mb-4">
          Clients can always override this using the theme toggle in the offer page header.
        </p>
        <div className="flex gap-2 flex-wrap">
          {THEME_OPTIONS.map(({ value, label, Icon, description }) => {
            const active = currentTheme === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...data, theme: value })}
                title={description}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-[#293c51] border-[#293c51] text-white'
                    : 'bg-[#f8f8f8] border-gray-200 text-gray-500 hover:border-[#293c51]/30 hover:text-[#293c51]'
                }`}
              >
                <Icon size={14} strokeWidth={2} />
                {label}
              </button>
            )
          })}
        </div>
      </div>
      {/* Summary bar */}
      <div className="bg-white border border-gray-200 rounded-[14px] px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-bold text-[#293c51]">
            {visibleCount} of {SECTION_CATALOG.length} sections visible
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Hero, Sign, and Footer are always shown.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs font-semibold text-gray-500 hover:text-[#293c51] transition-colors border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          {allOn ? 'Hide all' : 'Show all'}
        </button>
      </div>

      {/* Always-visible note */}
      <div className="flex flex-col gap-2">
        {['Hero Section', 'Sign / Accept', 'Footer'].map((name) => (
          <div key={name} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4 opacity-50">
            <div>
              <p className="text-sm font-semibold text-[#293c51]">{name}</p>
              <p className="text-xs text-gray-500 mt-0.5">Always visible — cannot be hidden.</p>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={13} className="text-gray-500" />
              <span className="text-xs text-gray-500 font-medium">Always on</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toggleable sections */}
      <div className="flex flex-col gap-2">
        {SECTION_CATALOG.map((catalog) => {
          const isVisible = sections[catalog.key] !== false
          return (
            <div
              key={catalog.key}
              className={`bg-white border rounded-xl px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 ${
                isVisible ? 'border-gray-200' : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`shrink-0 ${isVisible ? 'text-brand-green' : 'text-gray-500'}`}>
                  {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#293c51]">{catalog.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{catalog.description}</p>
                </div>
              </div>
              <Toggle
                checked={isVisible}
                label={`Toggle ${catalog.label}`}
                onChange={(val) => setSection(catalog.key, val)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main AdminPage ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { proposal: storedProposal, setProposal } = useProposalStore()
  const [draft, setDraft] = useState(() => {
    const source = storedProposal ?? sampleProposal
    return JSON.parse(JSON.stringify(source))
  })
  const [activeSection, setActiveSection] = useState('offer')

  // Detect unsaved changes by comparing draft to the last saved state
  const hasChanges = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(storedProposal ?? sampleProposal),
    [draft, storedProposal]
  )

  const handleSave = () => {
    setProposal(draft)
    toast.success('Offer updated — changes are live.')
  }

  const SECTION_COMPONENTS = {
    offer:       <OfferInfoSection    data={draft} onChange={setDraft} />,
    products:    <ProductsSection     data={draft} onChange={setDraft} />,
    company:     <CompanySection      data={draft} onChange={setDraft} />,
    commitments: <CommitmentsSection  data={draft} onChange={setDraft} />,
    sections:    <SectionsSection     data={draft} onChange={setDraft} />,
  }

  const activeInfo = SECTIONS.find((s) => s.id === activeSection)

  return (
    <div className="min-h-dvh bg-[#fcfcfc] text-[#293c51]">

      {/* ── Top bar ── */}
      <header className="fixed top-0 left-0 right-0 z-[200] h-14 bg-[#293c51] flex items-center px-6 gap-4">
        <div className="flex items-center gap-2.5 mr-auto">
          <img src="/wp-logo-white.png" alt="WorldPosta" className="h-7 w-auto shrink-0" />
          <span className="font-bold text-[13px] text-white/90">Admin Panel</span>
          <span className="hidden sm:block text-[11px] text-white/50 bg-white/10 border border-white/20 px-2 py-0.5 rounded-md font-mono">
            {draft.proposalNumber}
          </span>
          {hasChanges && (
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              Unsaved
            </span>
          )}
        </div>

        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white/90 transition-colors"
        >
          <ExternalLink size={13} />
          Preview Offer
        </Link>

        <button
          onClick={handleSave}
          className={`relative flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-[10px] transition-colors focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${
            hasChanges
              ? 'bg-brand-green hover:bg-brand-green-light shadow-[0_0_16px_rgba(103,154,65,0.4)]'
              : 'bg-brand-green/70 hover:bg-brand-green'
          }`}
        >
          <Save size={13} strokeWidth={2.5} />
          Save & Publish
          {hasChanges && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 border-2 border-[#293c51]" />
          )}
        </button>
      </header>

      {/* ── Sidebar (desktop) ── */}
      <aside className="fixed left-0 top-14 bottom-0 w-56 bg-white border-r border-gray-200 hidden lg:flex flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 py-5">
          {NAV_GROUPS.map((group) => {
            const groupSections = group.ids.map((id) => SECTIONS.find((s) => s.id === id)).filter(Boolean)
            return (
              <div key={group.label}>
                <p className="px-5 mb-1.5 text-[10px] font-bold text-gray-500/60 uppercase tracking-[0.1em]">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {groupSections.map((sec) => {
                    const NavIcon = sec.Icon
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
                          activeSection === sec.id
                            ? 'bg-brand-green/15 text-brand-green'
                            : 'text-gray-500 hover:text-[#293c51] hover:bg-gray-100'
                        }`}
                      >
                        <NavIcon size={15} strokeWidth={2} className="shrink-0" />
                        {sec.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── Mobile tab strip ── */}
      <div className="lg:hidden fixed top-14 left-0 right-0 z-[100] bg-white border-b border-gray-200 flex overflow-x-auto scrollbar-hide">
        {NAV_GROUPS.map((group, gi) => {
          const groupSections = group.ids.map((id) => SECTIONS.find((s) => s.id === id)).filter(Boolean)
          return (
            <div key={group.label} className={`flex shrink-0 ${gi > 0 ? 'border-l border-gray-200' : ''}`}>
              <div className="flex items-center px-2 text-[9px] font-bold text-gray-500/40 uppercase tracking-wider self-stretch border-r border-gray-100 py-2">
                {group.label}
              </div>
              {groupSections.map((sec) => {
                const TabIcon = sec.Icon
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                      activeSection === sec.id
                        ? 'border-brand-green text-brand-green'
                        : 'border-transparent text-gray-500 hover:text-[#293c51] hover:bg-gray-50'
                    }`}
                  >
                    <TabIcon size={12} strokeWidth={2} />
                    {sec.label}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ── Main content ── */}
      <main className="lg:ml-56 pt-14 lg:pt-0">
        <div className="max-w-[900px] mx-auto px-5 py-8 mt-10 lg:mt-0">

          {/* Section heading */}
          {activeInfo && (
            <div className="mb-7 pb-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shrink-0">
                  <activeInfo.Icon size={15} strokeWidth={2} className="text-brand-green" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-[#293c51] leading-tight">{activeInfo.label}</h1>
                  <p className="text-xs text-gray-500 mt-0.5">{activeInfo.description}</p>
                </div>
              </div>
            </div>
          )}

          {SECTION_COMPONENTS[activeSection]}

          {/* Bottom save bar */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              {hasChanges ? (
                <span className="flex items-center gap-1.5 text-amber-400/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  You have unsaved changes.
                </span>
              ) : (
                'All changes saved.'
              )}
            </p>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-[10px] transition-colors whitespace-nowrap ${
                hasChanges ? 'bg-brand-green hover:bg-brand-green-light' : 'bg-brand-green/60 hover:bg-brand-green'
              }`}
            >
              <Save size={13} strokeWidth={2.5} />
              Save & Publish
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
