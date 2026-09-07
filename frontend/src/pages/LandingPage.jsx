import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Rocket,
  Activity,
  Check,
  Terminal,
  Copy,
  FileText,
  Image as ImageIcon,
  Play,
  ArrowUp,
  Zap,
  Clock,
} from 'lucide-react'
import PipelineDemo from './PipelineDemo.jsx'
import { TICKER_ITEMS, TIERS, STACK_ROWS, CAPABILITIES, QUICKSTART, REPO_URL } from '../data/landingData.js'

function GithubIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}

function PriorityMark({ className = 'h-[18px] w-[18px]' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <rect x="1" y="2" width="18" height="3" fill="#FF5C5C" />
      <rect x="1" y="7" width="13" height="3" fill="#FFB224" />
      <rect x="1" y="12" width="8" height="3" fill="#34D877" />
      <rect x="1" y="17" width="4" height="2" fill="#8FA39A" />
    </svg>
  )
}

function SectionHead({ idx, title, lead }) {
  return (
    <div className="rv mb-14 grid grid-cols-1 items-start gap-2.5 md:grid-cols-[120px_1fr] md:gap-6">
      <span className="pt-3.5 font-mono text-xs tracking-[0.2em] text-accent">
        <span className="mb-3 block h-px w-[22px] bg-accent" />
        {idx}
      </span>
      <div>
        <h2 className="text-[clamp(32px,4.4vw,56px)] font-bold leading-[1.04] tracking-[-0.02em] [font-stretch:110%]">
          {title}
        </h2>
        {lead && <p className="mt-4 max-w-[620px] text-[16.5px] text-body">{lead}</p>}
      </div>
    </div>
  )
}

function ArchitectureSvg() {
  return (
    <svg viewBox="0 0 1040 470" xmlns="http://www.w3.org/2000/svg" className="block w-full min-w-[940px]" aria-label="Architecture diagram">
      <defs>
        <marker id="arw" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" fill="#4A5C52" />
        </marker>
        <marker id="arwG" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" fill="#34D877" />
        </marker>
        <marker id="arwR" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" fill="#FF4A3D" />
        </marker>
      </defs>

      {/* edges */}
      <path className="stroke-[#4A5C52] fill-none" strokeWidth="1" d="M208,233 L300,233" markerEnd="url(#arw)" />
      <text x="216" y="222" className="fill-mut font-mono text-[9px] tracking-wider">webhook</text>
      <path className="stroke-[#4A5C52] fill-none" strokeWidth="1" d="M468,233 L556,233" markerEnd="url(#arw)" />
      <text x="482" y="222" className="fill-mut font-mono text-[9px] tracking-wider">payload</text>
      <path className="stroke-amd/60 fill-none" strokeWidth="1" strokeDasharray="4 3" d="M792,168 C830,152 838,128 866,114" markerEnd="url(#arwR)" />
      <text x="778" y="132" className="fill-amd font-mono text-[9px] tracking-wider">openai sdk</text>
      <path className="stroke-[#4A5C52] fill-none" strokeWidth="1" d="M792,302 C830,314 836,332 866,350" markerEnd="url(#arw)" />
      <text x="800" y="338" className="fill-mut font-mono text-[9px] tracking-wider">queue / approve</text>
      <path className="stroke-[#4A5C52] fill-none" strokeWidth="1" d="M674,342 L674,392" markerStart="url(#arw)" markerEnd="url(#arw)" />
      <text x="688" y="372" className="fill-mut font-mono text-[9px] tracking-wider">store / fetch ctx</text>
      <path className="stroke-accent/50 fill-none" strokeWidth="1" d="M556,150 C420,64 244,66 120,186" markerEnd="url(#arwG)" />
      <text x="252" y="82" className="fill-accent font-mono text-[9px] tracking-wider">auto-reply &lt; 2s</text>

      {/* pulses */}
      <circle r="3" fill="#34D877">
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M208,233 L300,233" />
      </circle>
      <circle r="3" fill="#34D877">
        <animateMotion dur="2.2s" begin="0.5s" repeatCount="indefinite" path="M468,233 L556,233" />
      </circle>
      <circle r="3" fill="#FF4A3D">
        <animateMotion dur="1.7s" begin="0.2s" repeatCount="indefinite" path="M792,168 C830,152 838,128 866,114" />
      </circle>
      <circle r="3" fill="#FFB224">
        <animateMotion dur="2s" begin="0.8s" repeatCount="indefinite" path="M792,302 C830,314 836,332 866,350" />
      </circle>
      <circle r="3" fill="#8FA39A">
        <animateMotion dur="1.9s" begin="0.1s" repeatCount="indefinite" path="M674,342 L674,392" />
      </circle>
      <circle r="3" fill="#34D877">
        <animateMotion dur="2.6s" begin="0.6s" repeatCount="indefinite" path="M556,150 C420,64 244,66 120,186" />
      </circle>

      {/* nodes */}
      <rect x="28" y="190" width="180" height="86" rx="10" className="fill-panel2 stroke-line2" />
      <text x="48" y="226" className="fill-inktext font-mono text-[13px] font-bold">WhatsApp</text>
      <text x="48" y="244" className="fill-inktext font-mono text-[13px] font-bold">Business</text>
      <text x="48" y="262" className="fill-mut font-mono text-[9.5px]">inbound · outbound</text>

      <rect x="300" y="190" width="168" height="86" rx="10" className="fill-panel2 stroke-line2" />
      <text x="320" y="222" className="fill-inktext font-mono text-[13px] font-bold">FastAPI</text>
      <text x="320" y="242" className="fill-mut font-mono text-[9.5px]">POST /api/webhook/</text>
      <text x="320" y="258" className="fill-mut font-mono text-[9.5px]">message · :8000</text>

      <rect x="556" y="130" width="236" height="212" rx="12" className="fill-panel2 stroke-accent/40" />
      <text x="580" y="162" className="fill-inktext font-mono text-[13px] font-bold">Agent Core</text>
      <rect x="580" y="180" width="188" height="40" rx="6" className="fill-veil stroke-line" />
      <text x="596" y="204" className="fill-body font-mono text-[10.5px]">1 · priority classify</text>
      <rect x="580" y="228" width="188" height="40" rx="6" className="fill-veil stroke-line" />
      <text x="596" y="252" className="fill-body font-mono text-[10.5px]">2 · reply generation</text>
      <rect x="580" y="276" width="188" height="40" rx="6" className="fill-veil stroke-line" />
      <text x="596" y="300" className="fill-body font-mono text-[10.5px]">3 · route &amp; memory</text>

      <rect x="866" y="70" width="150" height="86" rx="10" className="fill-panel2 stroke-amd/55" />
      <text x="886" y="102" className="fill-inktext font-mono text-[13px] font-bold">vLLM</text>
      <text x="886" y="122" className="fill-mut font-mono text-[9.5px]">AMD Radeon Cloud</text>
      <text x="886" y="138" className="fill-amd font-mono text-[9.5px]">ROCm · private</text>

      <rect x="576" y="392" width="196" height="58" rx="10" className="fill-panel2 stroke-line2" />
      <text x="596" y="418" className="fill-inktext font-mono text-[13px] font-bold">PostgreSQL</text>
      <text x="596" y="436" className="fill-mut font-mono text-[9.5px]">history · local RAG</text>

      <rect x="866" y="306" width="150" height="98" rx="10" className="fill-panel2 stroke-line2" />
      <text x="886" y="338" className="fill-inktext font-mono text-[13px] font-bold">React</text>
      <text x="886" y="356" className="fill-inktext font-mono text-[13px] font-bold">Dashboard</text>
      <text x="886" y="376" className="fill-mut font-mono text-[9.5px]">approval queue</text>
      <text x="886" y="392" className="fill-mut font-mono text-[9.5px]">Recharts metrics</text>
    </svg>
  )
}

const NAV_LINKS = [
  ['#pipeline', 'Pipeline'],
  ['#rules', 'Rules'],
  ['#system', 'System'],
  ['#quickstart', 'Quickstart'],
  ['#capabilities', 'Capabilities'],
]

export default function LandingPage() {
  const shellRef = useRef(null)
  const [toasts, setToasts] = useState([])
  const [tab, setTab] = useState(0)

  const toast = useCallback((msg, tone) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  useEffect(() => {
    const els = shellRef.current.querySelectorAll('.rv')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('rv-in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const copyCommands = () => {
    const cmds = QUICKSTART[tab].lines
      .filter((l) => l[0] === 'x')
      .map((l) => l[1])
      .join('\n')
    navigator.clipboard
      .writeText(cmds)
      .then(() => toast('Commands copied — paste into your terminal'))
      .catch(() => toast('Clipboard blocked by browser', 'red'))
  }

  return (
    <div ref={shellRef} className="landing-shell min-h-screen bg-ink text-inktext antialiased">
      {/* dotted background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(214,232,222,0.045) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ================= NAV ================= */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-[1200px] items-center gap-7 px-5 md:px-8">
          <a href="#top" className="flex items-center gap-3 font-mono text-xs font-bold tracking-[0.14em]">
            <PriorityMark />
            PRIORITY&nbsp;AGENT <small className="font-normal tracking-[0.1em] text-mut">/ v1.0</small>
          </a>
          <div className="ml-auto hidden items-center gap-6 md:flex">
            {NAV_LINKS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-sub transition-colors hover:text-accent"
              >
                {label}
              </a>
            ))}
          </div>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-md border border-accent/50 px-3.5 py-2 font-mono text-[11px] tracking-wider text-accent transition-colors hover:bg-accent/10"
          >
            <Rocket size={14} />
            Launch app
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener"
            className="hidden inline-flex items-center gap-2 rounded-md border border-line2 px-3.5 py-2 font-mono text-[11px] tracking-wider text-inktext transition-colors hover:border-accent hover:text-accent sm:inline-flex"
          >
            <GithubIcon size={14} />
            GitHub
          </a>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <header id="top" className="relative z-1 pt-[148px]">
        <div className="relative z-1 mx-auto max-w-[1200px] px-5 md:px-8">
          <p className="mb-[30px] flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-[34px] bg-accent" />
            Track 2 · Private AI Agents — AMD AI DevMaster Hackathon 2026
          </p>
          <h1 className="text-[clamp(38px,5.8vw,68px)] font-extrabold leading-[1.02] tracking-[-0.02em] [font-stretch:112%]">
            <span className="block overflow-hidden">
              <span className="inline-block translate-y-[112%] animate-rise">
                WhatsApp <em className="not-italic text-accent">Priority</em> Agent
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-[640px] text-[17px] text-body opacity-0 animate-fadein [animation-delay:0.45s]">
            AI triage for WhatsApp Business — urgent messages get instant LLM replies, everything else waits for human
            approval. Private inference on AMD Radeon Cloud (ROCm).
          </p>

          <div className="mt-9 flex flex-wrap gap-3.5 opacity-0 animate-fadein [animation-delay:0.6s]">
            <Link
              to="/app"
              className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-[22px] py-3 text-sm font-semibold tracking-tight text-[#06130B] transition-all hover:-translate-y-px hover:bg-[#4BE78B]"
            >
              <Rocket size={15} />
              Get started
            </Link>
            <a
              href="#pipeline"
              className="inline-flex items-center gap-2.5 rounded-lg border border-line2 px-[22px] py-3 text-sm font-semibold tracking-tight text-inktext transition-colors hover:border-accent hover:text-accent"
            >
              <Activity size={15} />
              Watch it triage
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2.5 rounded-lg border border-line2 px-[22px] py-3 text-sm font-semibold tracking-tight text-inktext transition-colors hover:border-accent hover:text-accent"
            >
              <GithubIcon size={15} />
              View on GitHub
            </a>
          </div>

          <div className="mt-[52px] flex flex-wrap border-y border-line opacity-0 animate-fadein [animation-delay:0.75s]">
            {[
              ['4', 'priority tiers'],
              ['<2s', 'median auto-reply'],
              ['100%', 'local inference'],
              ['ROCm', 'accelerated'],
            ].map(([v, label]) => (
              <div key={label} className="mr-7 py-4 pr-7 font-mono text-[11px] uppercase tracking-[0.14em] text-sub">
                <b className="mr-2 font-bold text-inktext">{v}</b>
                {label}
              </div>
            ))}
          </div>

          {/* triage spectrum */}
          <div className="mb-0 mt-[60px] opacity-0 animate-fadein [animation-delay:0.85s]">
            <div className="mb-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-mut">
              <span>Triage matrix</span>
              <span>Classifier scan — live loop</span>
            </div>
            <div className="relative grid grid-cols-1 gap-px border border-line bg-line min-[480px]:grid-cols-2 lg:grid-cols-4">
              <div className="pointer-events-none absolute bottom-0 top-0 z-2 w-px animate-sweep bg-inktext/85">
                <span className="absolute -left-[3px] top-0 border-x-[3.5px] border-t-[5px] border-x-transparent border-t-inktext/85" />
              </div>
              {[
                ['URGENT', 'auto-reply · 0s wait', 'bg-alert', 'text-alert'],
                ['HIGH', 'auto-reply · <2s', 'bg-warn', 'text-warn'],
                ['NORMAL', 'human approval', 'bg-accent', 'text-accent'],
                ['LOW', 'human approval', 'bg-grayt', 'text-grayt'],
              ].map(([name, desc, bar, text]) => (
                <div key={name} className="bg-ink px-4 pb-3 pt-3.5">
                  <i className={`mb-2.5 block h-[3px] w-[26px] ${bar}`} />
                  <b className={`block font-mono text-xs tracking-[0.14em] ${text}`}>{name}</b>
                  <span className="mt-1 block font-mono text-[10px] tracking-[0.08em] text-mut">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ticker */}
        <div className="mt-[76px] overflow-hidden whitespace-nowrap border-y border-line py-3">
          <div className="inline-block w-max animate-tick font-mono text-[11px] uppercase tracking-[0.22em] text-mut hover:[animation-play-state:paused]">
            {[0, 1].map((i) => (
              <span key={i}>
                {TICKER_ITEMS.split('·').map((chunk, j) => (
                  <span key={j}>
                    <b className="mx-1.5 font-medium text-accent">▸</b>
                    {chunk.trim()}
                    <span className="ml-2">·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ================= 01 PIPELINE ================= */}
      <section id="pipeline" className="relative z-1 border-t border-line pb-28 pt-[104px]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead
            idx="01 / LIVE"
            title="Watch the agent think."
            lead={
              <>
                A faithful simulation of the production loop — webhook in, priority stamp, streamed reply, route
                decision. Hit <b>inject</b> to fire an urgent ticket at it, or pause the loop entirely.
              </>
            }
          />
          <div className="rv">
            <PipelineDemo toast={toast} />
          </div>
        </div>
      </section>

      {/* ================= 02 RULES ================= */}
      <section id="rules" className="relative z-1 border-t border-line pb-28 pt-[104px]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="rv grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <div className="lg:sticky lg:top-[110px]">
              <span className="font-mono text-xs tracking-[0.2em] text-accent">
                <span className="mb-3 block h-px w-[22px] bg-accent" />
                02 / RULES
              </span>
              <h2 className="text-[clamp(32px,4.4vw,56px)] font-bold leading-[1.04] tracking-[-0.02em] [font-stretch:110%]">
                Four tiers.
                <br />
                Two speeds.
              </h2>
              <p className="mt-4 max-w-[620px] text-[16.5px] text-body">
                Every inbound message lands in one of four priority classes. Two of them never touch a human queue. Two
                of them never skip one. That single rule is the whole product — the LLM just enforces it, every second
                of every day.
              </p>
              <p className="mt-3.5 font-mono text-xs text-mut">classify → generate → store → route</p>
            </div>
            <div className="rv">
              {TIERS.map((t) => (
                <div
                  key={t.num}
                  className="group relative grid grid-cols-[56px_1fr] gap-5 border-t border-line py-[30px] transition-colors last:border-b hover:bg-veil"
                >
                  <span
                    className={`absolute -bottom-px -top-px left-0 w-0.5 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100 ${t.bar}`}
                  />
                  <span className="pt-1.5 font-mono text-xs text-mut">{t.num}</span>
                  <div>
                    <div className={`flex flex-wrap items-center gap-3.5 text-2xl font-bold tracking-[-0.01em] [font-stretch:110%] ${t.tone}`}>
                      {t.name}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[9px] tracking-[0.16em] ${
                          t.instant ? 'border-accent/40 text-accent' : 'border-line2 text-sub'
                        }`}
                      >
                        <i className={`h-[5px] w-[5px] rounded-full bg-current ${t.instant ? 'animate-blink' : ''}`} />
                        {t.sla}
                      </span>
                    </div>
                    <p className="my-2.5 mb-3 mt-2 text-[14.5px] text-body">{t.act}</p>
                    <span className="inline-block rounded-lg border border-line bg-panel px-3.5 py-2.5 font-mono text-xs text-sub">
                      <span className={t.tone}>“</span>
                      {t.q}
                      <span className={t.tone}>”</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 03 SYSTEM ================= */}
      <section id="system" className="relative z-1 border-t border-line pb-28 pt-[104px]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead
            idx="03 / SYSTEM"
            title={
              <>
                One private pipeline.
                <br />
                Zero third-party APIs.
              </>
            }
            lead="Inference stays on a dedicated vLLM instance in AMD Radeon Cloud (ROCm). Memory, routing and approvals all live in your own stack — the context window is filled from your own Postgres, nothing else."
          />
          <div className="rv">
            <div className="overflow-x-auto border border-line bg-panel px-[18px] py-[26px]">
              <ArchitectureSvg />
            </div>
            <div className="border border-t-0 border-line">
              {STACK_ROWS.map((row) => (
                <div
                  key={row.layer}
                  className="grid grid-cols-1 items-baseline gap-1.5 border-b border-line px-6 py-[17px] transition-colors last:border-b-0 hover:bg-veil md:grid-cols-[150px_1fr_1fr] md:gap-5"
                >
                  <b className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{row.layer}</b>
                  <span className="font-mono text-[13px] text-inktext">{row.tech}</span>
                  <span className="text-[13.5px] text-sub">{row.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 04 QUICKSTART ================= */}
      <section id="quickstart" className="relative z-1 border-t border-line pb-28 pt-[104px]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead
            idx="04 / RUN IT"
            title={
              <>
                From clone to triage
                <br />
                in four steps.
              </>
            }
            lead="Postgres locally, vLLM on Radeon Cloud, dashboard on Vite. Click a step to load its commands, then copy the whole block straight into your terminal."
          />
          <div className="rv grid grid-cols-1 gap-px border border-line bg-line lg:grid-cols-[340px_1fr]">
            <div className="flex scroll-smooth flex-col bg-panel max-lg:flex-row max-lg:overflow-x-auto">
              {QUICKSTART.map((step, i) => (
                <button
                  key={step.key}
                  onClick={() => setTab(i)}
                  className={`grid flex-1 grid-cols-[52px_1fr] items-start gap-3.5 border-b border-line p-6 text-left transition-colors last:border-b-0 max-lg:min-w-[210px] max-lg:border-r max-lg:last:border-r-0 ${
                    tab === i ? 'bg-panel2' : 'hover:bg-panel2'
                  }`}
                >
                  <span className={`pt-0.5 font-mono text-xs ${tab === i ? 'text-accent' : 'text-mut'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className={`block text-base font-semibold tracking-[-0.01em] ${tab === i ? 'text-accent' : ''}`}>
                      {step.label}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] leading-relaxed text-mut">{step.hint}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="flex min-h-[430px] flex-col bg-term">
              <div className="flex items-center gap-3 border-b border-line px-[18px] py-3">
                <Terminal size={15} className="text-accent" />
                <span className="font-mono text-[11px] tracking-wider text-sub">bash — {QUICKSTART[tab].title}</span>
                <button
                  onClick={copyCommands}
                  className="ml-auto inline-flex items-center gap-1.5 rounded border border-line2 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-sub transition-colors hover:border-accent hover:text-accent"
                >
                  <Copy size={12} />
                  Copy commands
                </button>
              </div>
              <div className="flex-1 overflow-x-auto px-[22px] py-5 font-mono text-[12.5px] leading-[2.05]">
                {QUICKSTART[tab].lines.map(([type, text], i) => (
                  <span key={i} className="block whitespace-pre">
                    <span className="mr-[18px] text-[#31413A]">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={
                        type === 'c' ? 'text-[#5E7A6C]' : type === 'o' ? 'text-accent' : 'text-inktext'
                      }
                    >
                      {text}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 05 CAPABILITIES ================= */}
      <section id="capabilities" className="relative z-1 border-t border-line pb-28 pt-[104px]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead
            idx="05 / TRACK 2"
            title="Requirement by requirement."
            lead="How the build maps to the hackathon's agent checklist — no hand-waving, each capability points at code that ships in the repo."
          />
          <div className="rv">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.id}
                className="grid grid-cols-1 items-center gap-2 border-b border-line py-5 transition-colors first:border-t hover:bg-veil md:grid-cols-[90px_1.1fr_1.6fr_50px] md:gap-6 md:py-6"
              >
                <span className="font-mono text-[11px] tracking-[0.14em] text-mut">{cap.id}</span>
                <span className="text-[17px] font-semibold tracking-[-0.01em]">{cap.name}</span>
                <span className="text-sm leading-relaxed text-sub">{cap.desc}</span>
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-accent/40 text-accent">
                  <Check size={15} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-1 border-t border-line pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <p className="rv max-w-[820px] text-[clamp(30px,4.6vw,60px)] font-extrabold leading-[1.05] tracking-[-0.02em] [font-stretch:110%]">
            Answer in seconds.
            <br />
            Escalate with <em className="not-italic text-accent">judgment</em>.
          </p>

          <div className="rv mt-16 grid grid-cols-1 gap-9 pb-16 md:grid-cols-[1.2fr_1fr_1fr] md:gap-12">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-mut">Team</p>
              <p className="text-[21px] font-bold">Sandeep Kumar</p>
              <p className="mt-1 text-sm text-sub">Full-stack development &amp; AI integration</p>
              <div className="mt-[22px] flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-sub">
                <i className="inline-block h-[7px] w-[7px] rounded-full bg-amd" />
                INFERENCE ON AMD RADEON CLOUD · ROCm
              </div>
              <button
                onClick={() => toast('Demo video lands before final submission — the README links it when ready.')}
                className="mt-1.5 flex w-full max-w-[340px] cursor-pointer items-center gap-4 rounded-xl border border-dashed border-line2 p-6 text-left transition-all hover:border-accent hover:bg-accent/5"
              >
                <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-line2 text-accent">
                  <Play size={16} />
                </span>
                <span>
                  <b className="block font-mono text-xs tracking-[0.14em]">DEMO VIDEO</b>
                  <span className="font-mono text-[11px] text-mut">coming soon — drops before final submission</span>
                </span>
              </button>
            </div>
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-mut">Repository</p>
              <div className="flex flex-col">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 py-1.5 font-mono text-xs tracking-wide text-sub transition-colors hover:text-accent"
                >
                  <GithubIcon size={14} />
                  github.com/Qisanxi/Whatsapp_priority_agent
                </a>
                {[
                  ['docs/SPEC.md', FileText],
                  ['docs/DEPLOYMENT.md', Rocket],
                  ['docs/architecture.png', ImageIcon],
                ].map(([doc, Icon]) => (
                  <button
                    key={doc}
                    onClick={() => toast(`${doc} ships inside the repository`)}
                    className="flex items-center gap-2.5 py-1.5 text-left font-mono text-xs tracking-wide text-sub transition-colors hover:text-accent"
                  >
                    <Icon size={14} />
                    {doc}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-mut">Built for</p>
              <p className="text-[14.5px] leading-relaxed text-body">
                AMD AI DevMaster Hackathon 2026
                <br />
                <span className="text-mut">Track 2 — Development &amp; Local Deployment of Private AI Agents</span>
              </p>
              <a
                href="#pipeline"
                className="mt-[22px] inline-flex items-center gap-2.5 rounded-lg border border-line2 px-[22px] py-3 text-sm font-semibold text-inktext transition-colors hover:border-accent hover:text-accent"
              >
                <ArrowUp size={15} />
                Back to the loop
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-[22px] font-mono text-[10.5px] uppercase tracking-[0.14em] text-mut">
            <span>© 2026 Sandeep Kumar</span>
            <span>WhatsApp Priority Agent</span>
            <span>classify → generate → store → route</span>
          </div>
        </div>
      </footer>

      {/* ================= TOASTS ================= */}
      <div className="fixed bottom-6 right-6 z-[99] flex max-w-[340px] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex animate-msgin items-center gap-2.5 rounded-md border border-line2 border-l-2 bg-[#101813] px-4 py-3 font-mono text-xs text-inktext ${
              t.tone === 'red' ? 'border-l-alert' : t.tone === 'amber' ? 'border-l-warn' : 'border-l-accent'
            }`}
          >
            {t.tone === 'red' ? <Zap size={14} /> : t.tone === 'amber' ? <Clock size={14} /> : <Check size={14} />}
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
