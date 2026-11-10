import { useEffect, useMemo, useState } from 'react'
import { buildReply, wordCount, TONES, SCENARIOS, RESOLUTIONS } from './replies.js'

const KEY = 'complaint-reply-helper:v1'
const DEFAULTS = {
  customer: '', order: '', item: '', agent: '', note: '',
  tone: 'warm', scenario: 'late', resolution: 'refund',
}

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return DEFAULTS
  }
}

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

const input = 'w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

function Select({ id, value, onChange, options }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={input}>
      {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
    </select>
  )
}

export default function App() {
  const [f, setF] = useState(load)
  const [copied, setCopied] = useState(false)
  const [edited, setEdited] = useState(null) // manual edits override generated text

  const set = (k) => (v) => { setF((p) => ({ ...p, [k]: v })); setEdited(null) }
  const generated = useMemo(() => buildReply(f), [f])
  const text = edited ?? generated

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(f)) } catch { /* storage unavailable */ }
  }, [f])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      document.getElementById('reply')?.select()
    }
  }

  function reset() { setF(DEFAULTS); setEdited(null) }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Complaint Reply Helper</h1>
          <p className="text-sm text-slate-600">Pick the problem, the outcome and the tone. Edit the draft before you send it.</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid gap-6 md:grid-cols-2">
        <section aria-label="Details" className="space-y-4">
          <Field id="scenario" label="What went wrong"><Select id="scenario" value={f.scenario} onChange={set('scenario')} options={SCENARIOS} /></Field>
          <Field id="resolution" label="What you are offering"><Select id="resolution" value={f.resolution} onChange={set('resolution')} options={RESOLUTIONS} /></Field>
          <Field id="tone" label="Tone"><Select id="tone" value={f.tone} onChange={set('tone')} options={TONES} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field id="customer" label="Customer name"><input id="customer" className={input} value={f.customer} onChange={(e) => set('customer')(e.target.value)} /></Field>
            <Field id="order" label="Order number"><input id="order" className={input} value={f.order} onChange={(e) => set('order')(e.target.value)} /></Field>
            <Field id="item" label="Item (optional)"><input id="item" className={input} value={f.item} onChange={(e) => set('item')(e.target.value)} /></Field>
            <Field id="agent" label="Your name"><input id="agent" className={input} value={f.agent} onChange={(e) => set('agent')(e.target.value)} /></Field>
          </div>
          <Field id="note" label="Extra line (optional)">
            <textarea id="note" rows={3} className={input} value={f.note} onChange={(e) => set('note')(e.target.value)} placeholder="For example: I have passed your feedback to the store manager." />
          </Field>
          <button onClick={reset} className="text-sm text-slate-600 underline">Clear all fields</button>
        </section>

        <section aria-label="Reply" className="space-y-2">
          <label htmlFor="reply" className="block text-sm font-medium text-slate-700">Draft reply</label>
          <textarea id="reply" rows={16} className={`${input} font-mono leading-relaxed`} value={text} onChange={(e) => setEdited(e.target.value)} />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{wordCount(text)} words{edited !== null && ' (edited by hand)'}</span>
            <div className="flex gap-2">
              {edited !== null && <button onClick={() => setEdited(null)} className="rounded border border-slate-300 bg-white px-3 py-2 text-sm">Reset draft</button>}
              <button onClick={copy} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" aria-live="polite">{copied ? 'Copied' : 'Copy reply'}</button>
            </div>
          </div>
          <p className="text-xs text-slate-500">Check the details match what actually happened, and that you can really offer the outcome, before sending.</p>
        </section>
      </main>
    </div>
  )
}
