import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Zap, Check, X, Send, Archive, Sparkles } from 'lucide-react'
import { SCENARIOS, AVCOLORS, AUTO, PRIO_TEXT, PRIO_CHIP, PRIO_DOT } from '../data/landingData.js'

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const initials = (n) =>
  n
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function shuffle(a) {
  const out = a.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function PipelineDemo({ toast }) {
  const [feed, setFeed] = useState([])
  const [logs, setLogs] = useState([])
  const [stamp, setStamp] = useState(null) // { id, p, conf }
  const [draft, setDraft] = useState('')
  const [drafting, setDrafting] = useState(false)
  const [sent, setSent] = useState([])
  const [queue, setQueue] = useState([]) // { id, sc, status: 'pending' | 'done' | 'rej' }
  const [stats, setStats] = useState({ proc: 0, auto: 0, q: 0, lat: 0, latN: 0 })
  const [paused, setPaused] = useState(false)

  const pausedRef = useRef(false)
  const skipRef = useRef(false)
  const fastRef = useRef(false)
  const nextRef = useRef(null)

  // pause-aware, skippable sleep (rAF-based like the original)
  const sleep = (ms) =>
    new Promise((res) => {
      let acc = 0
      let last = performance.now()
      const step = (t) => {
        if (skipRef.current) {
          skipRef.current = false
          res()
          return
        }
        if (!pausedRef.current) acc += t - last
        last = t
        if (acc >= ms) res()
        else requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })

  useEffect(() => {
    let alive = true
    let pool = shuffle(SCENARIOS)
    let poolIdx = 0
    const pick = () => {
      if (poolIdx >= pool.length) {
        pool = shuffle(SCENARIOS)
        poolIdx = 0
      }
      return pool[poolIdx++]
    }

    const pushLog = (node) => setLogs((l) => [...l.slice(-13), { id: Date.now() + Math.random(), node }])

    const runScenario = async (sc) => {
      setStamp(null)
      setDraft('')
      setDrafting(false)

      setFeed((f) => [...f.slice(-3), { id: sc.c + Math.random(), sc, time: nowTime() }])
      pushLog(
        <span>
          <span className="text-mut">webhook</span> <span className="text-inktext">POST /api/webhook/message</span>{' '}
          <span className="text-accent">200</span>
        </span>
      )
      await sleep(520)
      if (!alive) return
      pushLog(
        <span>
          <span className="text-mut">memory</span>{' '}
          <span className="text-inktext">history for {sc.c.toLowerCase().replace(' ', '.')}</span> ·{' '}
          {5 + (Math.random() * 12 | 0)} turns
        </span>
      )
      await sleep(480)
      if (!alive) return
      setStamp({ id: Date.now(), p: sc.p, conf: (0.86 + Math.random() * 0.12).toFixed(2) })
      pushLog(
        <span>
          <span className="text-mut">classify</span>{' '}
          <span className={`font-bold ${PRIO_TEXT[sc.p]}`}>{sc.p}</span> · p=
          {(0.86 + Math.random() * 0.12).toFixed(2)} · {140 + (Math.random() * 160 | 0)}ms
        </span>
      )
      await sleep(760)
      if (!alive) return
      setDrafting(true)
      pushLog(
        <span>
          <span className="text-mut">generate</span> <span className="text-inktext">vllm · ROCm</span> streaming…
        </span>
      )
      await sleep(340)
      if (!alive) return
      setDraft('')
      for (const ch of sc.r) {
        if (!alive) return
        setDraft((d) => d + ch)
        await sleep(fastRef.current ? 0 : 13)
      }
      await sleep(420)
      if (!alive) return

      const lat = (0.9 + Math.random() * 1.3).toFixed(2)
      setStats((s) => ({ ...s, proc: s.proc + 1 }))
      if (AUTO[sc.p]) {
        setStats((s) => ({ ...s, auto: s.auto + 1 }))
        pushLog(
          <span>
            <span className="text-mut">decision</span> <span className="text-accent">AUTO-REPLY — sent ✓</span> · total{' '}
            {lat}s
          </span>
        )
        setSent((l) => [{ id: Date.now() + Math.random(), sc, lat }, ...l].slice(0, 6))
      } else {
        setStats((s) => ({ ...s, q: s.q + 1 }))
        pushLog(
          <span>
            <span className="text-mut">decision</span>{' '}
            <span className="text-warn">APPROVAL QUEUE — held for human</span>
          </span>
        )
        setQueue((qq) => [{ id: Date.now() + Math.random(), sc, status: 'pending' }, ...qq].slice(0, 4))
      }
      setStats((s) => ({ ...s, lat: s.lat + +lat, latN: s.latN + 1 }))
    }

    const run = async () => {
      pushLog(
        <span>
          <span className="text-mut">system</span> <span className="text-inktext">agent core online</span> · vllm/ROCm{' '}
          <span className="text-accent">ready</span>
        </span>
      )
      await sleep(900)
      while (alive) {
        const sc = nextRef.current || pick()
        nextRef.current = null
        await runScenario(sc)
        fastRef.current = false
        await sleep(1700)
      }
    }
    run()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const togglePause = () => {
    pausedRef.current = !pausedRef.current
    setPaused(pausedRef.current)
  }

  const injectUrgent = () => {
    const urgents = SCENARIOS.filter((s) => s.p === 'URGENT')
    nextRef.current = urgents[Math.random() * urgents.length | 0]
    skipRef.current = true
    fastRef.current = true
    toast(`Injected: "${nextRef.current.t.slice(0, 34)}…"`, 'red')
  }

  const resolveQueue = (id, act) => {
    setQueue((qq) =>
      qq.map((item) => {
        if (item.id !== id || item.status !== 'pending') return item
        if (act === 'approve') {
          toast(`Reply approved & sent to ${item.sc.c}`)
          return { ...item, status: 'done' }
        }
        toast(`Rejected — ${item.sc.c} flagged for follow-up`, 'amber')
        return { ...item, status: 'rej' }
      })
    )
  }

  const latDisplay = stats.latN ? (stats.lat / stats.latN).toFixed(2) + 's' : '—'
  const stampTone = stamp ? PRIO_CHIP[stamp.p] : ''

  return (
    <div>
      {/* controls */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          onClick={togglePause}
          className="inline-flex items-center gap-2 rounded-md border border-line2 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-inktext transition-colors hover:border-accent hover:text-accent"
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          {paused ? 'Resume loop' : 'Pause loop'}
        </button>
        <button
          onClick={injectUrgent}
          className="inline-flex items-center gap-2 rounded-md border border-line2 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-inktext transition-colors hover:border-alert hover:text-alert"
        >
          <Zap size={14} />
          Inject urgent message
        </button>
        <div className="ml-auto flex w-full flex-wrap justify-between border border-line bg-line sm:ml-0 sm:w-auto">
          {[
            [stats.proc, 'processed'],
            [stats.auto, 'auto-replied'],
            [stats.q, 'queued'],
            [latDisplay, 'avg latency'],
          ].map(([v, label]) => (
            <div key={label} className="bg-panel px-4 py-2 text-right">
              <b className="block font-mono text-base font-bold leading-tight text-accent">{v}</b>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-mut">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* pipeline grid */}
      <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-[300px_1fr_300px]">
        {/* inbound feed */}
        <div className="flex min-h-0 flex-col bg-panel md:col-span-2 xl:col-span-1 xl:min-h-[540px]">
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-sub">
            <span>Inbound — WhatsApp webhook</span>
            <span className="text-mut">live feed</span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden p-4 xl:max-h-[480px]">
            {feed.map((m) => (
              <div
                key={m.id}
                className="mb-2.5 animate-msgin rounded-lg border border-line border-l-2 border-l-line2 bg-panel2 p-3"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold text-[#08110C]"
                    style={{ backgroundColor: AVCOLORS[m.sc.c.length % AVCOLORS.length] }}
                  >
                    {initials(m.sc.c)}
                  </span>
                  <span className="font-mono text-[11px] font-medium text-inktext">{m.sc.c}</span>
                  <span className="ml-auto font-mono text-[10px] text-mut">{m.time}</span>
                </div>
                <div className="text-[13px] leading-relaxed text-body">{m.sc.t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* agent core */}
        <div className="flex min-h-0 flex-col bg-panel xl:min-h-[540px]">
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-sub">
            <span>Agent core — vLLM · ROCm</span>
            <span className={`inline-flex items-center gap-1.5 ${paused ? 'text-warn' : 'text-accent'}`}>
              <i className={`h-1.5 w-1.5 rounded-full ${paused ? 'bg-warn' : 'animate-blink bg-accent'}`} />
              {paused ? 'PAUSED' : 'LIVE'}
            </span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden p-4">
            <div className="mt-auto flex min-h-0 flex-1 flex-col justify-end">
              {logs.map((l) => (
                <div
                  key={l.id}
                  className="animate-msgin overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11.5px] leading-[1.9] text-sub"
                >
                  <span className="text-mut">▸</span> {l.node}
                </div>
              ))}
            </div>
            <div className="mt-3 shrink-0 border-t border-line pt-3.5">
              <div className="flex min-h-[38px] items-center">
                {stamp && (
                  <span
                    key={stamp.id}
                    className={`inline-flex animate-stampin items-baseline gap-2.5 rounded border bg-opacity-10 px-4 py-2 font-mono text-[15px] font-bold tracking-[0.16em] opacity-0 ${stampTone}`}
                    style={{ transform: 'scale(1.5) rotate(-3deg)' }}
                  >
                    {stamp.p}
                    <small className="text-[10px] font-normal tracking-[0.08em] opacity-75">p={stamp.conf}</small>
                  </span>
                )}
              </div>
              {drafting && (
                <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                  <Sparkles size={12} />
                  Generating contextual reply
                </div>
              )}
              <div className="mt-2 min-h-[44px] rounded-lg border border-accent/25 bg-accentd p-3 text-[13px] leading-relaxed text-[#D8ECDE]">
                {draft}
                {drafting && <span className="ml-0.5 inline-block h-3.5 w-[7px] animate-blink bg-accent align-[-2px]" />}
              </div>
            </div>
          </div>
        </div>

        {/* lanes */}
        <div className="grid min-h-0 grid-rows-2 gap-px bg-line xl:min-h-[540px]">
          {/* sent */}
          <div className="flex min-h-0 flex-col bg-panel">
            <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-sub">
              <span>Sent by agent</span>
              <span className="text-mut">{stats.auto}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3.5">
              {sent.map((s) => (
                <div
                  key={s.id}
                  className="flex animate-msgin items-center gap-2 border-b border-dashed border-line py-2 font-mono text-[11px] text-sub"
                >
                  <span className="flex text-accent">
                    <Check size={14} />
                  </span>
                  <b className="font-medium text-inktext">{s.sc.c}</b>
                  <span className={PRIO_TEXT[s.sc.p]}>{s.sc.p}</span>
                  <span className="ml-auto text-[10px]">{s.lat}s</span>
                </div>
              ))}
            </div>
          </div>
          {/* queue */}
          <div className="flex min-h-0 flex-col bg-panel">
            <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-sub">
              <span>Human approval queue</span>
              <span className="text-mut">{stats.q}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3.5">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className={`mb-2.5 animate-msgin rounded-lg border p-3 bg-panel2 transition-all duration-300 ${
                    item.status === 'done'
                      ? 'border-accent/35 opacity-50'
                      : item.status === 'rej'
                        ? 'border-line opacity-35 saturate-0'
                        : 'border-line'
                  }`}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="font-mono text-[11px] font-medium text-inktext">{item.sc.c}</span>
                    <span
                      className={`rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.12em] ${PRIO_CHIP[item.sc.p]}`}
                    >
                      {item.sc.p}
                    </span>
                  </div>
                  <div className="mb-2 line-clamp-2 text-[12px] leading-relaxed text-body">{item.sc.r}</div>
                  {item.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => resolveQueue(item.id, 'approve')}
                        className="inline-flex items-center gap-1.5 rounded border border-line2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-sub transition-colors hover:border-accent hover:text-accent"
                      >
                        <Check size={12} />
                        Approve
                      </button>
                      <button
                        onClick={() => resolveQueue(item.id, 'reject')}
                        className="inline-flex items-center gap-1.5 rounded border border-line2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-sub transition-colors hover:border-alert hover:text-alert"
                      >
                        <X size={12} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-1.5 font-mono text-[10px] tracking-wider ${item.status === 'done' ? 'text-accent' : 'text-mut'}`}
                    >
                      {item.status === 'done' ? <Send size={12} /> : <Archive size={12} />}
                      {item.status === 'done'
                        ? `approved — sent to ${item.sc.c.split(' ')[0]}`
                        : 'rejected — flagged for follow-up'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
