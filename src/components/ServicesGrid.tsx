import type { CSSProperties } from 'react'
import { MagnetStraight, Timer, Trophy, CheckCircle } from '@/components/slab'
import type { Icon } from '@/components/slab'
import Autopilot, { TOOLS } from '@/components/Autopilot'

/**
 * ServicesGrid - the Services view on one glass sheet.
 *
 * Three bands, top to bottom: your three-step method (on a dark plate so it
 * is the first thing the eye lands on), the four services as cards that carry
 * the marks of what each one is built with, and the live automation demo
 * scaled into whatever height is left.
 */

/* ---------- The method ---------- */

type Stage = {
  index: string
  label: string
  body: string
  Icon: Icon
  chips: string[]
}

const STAGES: Stage[] = [
  {
    index: '01',
    label: 'Listen',
    body: 'I learn your tasks and where your time goes.',
    Icon: MagnetStraight,
    chips: ['Questions', 'Task list', 'Priorities'],
  },
  {
    index: '02',
    label: 'Build',
    body: 'I set up the support or workflow, and test it.',
    Icon: Timer,
    chips: ['Setup', 'Automation', 'Testing'],
  },
  {
    index: '03',
    label: 'Deliver',
    body: 'You get work done on time and running smoothly.',
    Icon: Trophy,
    chips: ['Result', 'Updates', 'Support'],
  },
]

/* ---------- The services ---------- */

const N8N = '/icons/ai/n8n.svg'
const MAKE = '/icons/make.svg'
const ZAPIER = '/icons/ai/zapier.svg'
const CLAUDE = '/icons/ai/claude-color.svg'
const CHATGPT = '/icons/openai.svg'
const GEMINI = '/icons/gemini.svg'
const DEEPSEEK = '/icons/deepseek.svg'
const GMAIL = '/icons/gmail.svg'
const GCAL = '/icons/googlecalendar.svg'
const GSHEETS = '/icons/googlesheets.svg'
const GWS = '/icons/googleworkspace.svg'
const OUTLOOK = '/icons/microsoft-outlook.svg'
const EXCEL = '/icons/microsoft-excel.svg'
const MS365 = '/icons/microsoft.svg'

type Service = {
  index: string
  title: string
  description: string
  chip: string
  logos: string[]
  bullets: string[]
}

const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Workflow Automation',
    description:
      'I build workflows that connect your apps through APIs and webhooks, and handle repeat tasks for you.',
    chip: 'Automation',
    logos: [N8N, MAKE, ZAPIER],
    bullets: [
      'Apps connected through APIs and webhooks',
      'Fewer manual, repeat tasks',
      'Tested before it goes live',
    ],
  },
  {
    index: '02',
    title: 'AI Workflow Setup',
    description: 'I add AI to your workflows to sort, summarize, and score incoming information.',
    chip: 'AI',
    logos: [CLAUDE, CHATGPT, GEMINI, DEEPSEEK],
    bullets: [
      'Emails and leads sorted for you',
      'Important items flagged right away',
      'Results logged in a spreadsheet',
    ],
  },
  {
    index: '03',
    title: 'Executive Support',
    description: 'Day-to-day support so owners and executives can focus on the business.',
    chip: 'Support',
    logos: [GMAIL, GCAL, OUTLOOK],
    bullets: [
      'Inbox managed and organized',
      'Follow-ups and priorities tracked',
      'Calendar and scheduling handled',
    ],
  },
  {
    index: '04',
    title: 'Administrative Support',
    description: 'Reliable help with documents, spreadsheets, and daily office tasks.',
    chip: 'Support',
    logos: [GSHEETS, EXCEL, MS365, GWS],
    bullets: [
      'Spreadsheets and reports kept current',
      'Client records and CRM entries kept accurate',
      'Daily call lists prepared',
    ],
  },
]

/** The tool marks, stacked horizontally on white tiles (same as Projects). */
function Marks({ logos }: { logos: string[] }) {
  return (
    <span className="bento__logos" aria-hidden="true">
      {logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/* ---------- The page ---------- */

export default function ServicesGrid() {
  return (
     <section className="pgrid sgrid" aria-labelledby="services-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Services</span>
        <h1 className="pgrid__title" id="services-title">
          Virtual assistant support, with automation built in
        </h1>
        <p className="pgrid__lede">
          Daily admin and executive help, plus automation workflows for the tasks that repeat.
        </p>
      </header>

                  <div className="home__glass sgrid__glass">
        <div className="sgrid__method" aria-labelledby="method-title">
                    <div className="sgrid__method-copy">
            <span className="sgrid__method-eyebrow">How I Work</span>
            <h2 className="sgrid__method-title" id="method-title">
              Listen. Build. Deliver.
              <br />
              <span>A simple way to work together.</span>
            </h2>
            <p className="sgrid__method-sub">
              A clear process from your first message to work that runs smoothly.
            </p>
          </div>

          <ol className="sgrid__stages" role="list">
            {STAGES.map((s, i) => {
              const StageIcon = s.Icon
              return (
                <li key={s.index} className="sgrid__stage" style={{ '--i': i } as CSSProperties}>
                  <span className="sgrid__stage-ghost" aria-hidden="true">{s.index}</span>
                  <span className="sgrid__stage-icon" aria-hidden="true">
                    <StageIcon size={22} weight="duotone" />
                  </span>
                  <h3 className="sgrid__stage-label">{s.label}.</h3>
                  <p className="sgrid__stage-body">{s.body}</p>
                  <ul className="sgrid__stage-chips" role="list" aria-label={`${s.label} touches`}>
                    {s.chips.map((c) => (
                      <li key={c} className="sgrid__stage-chip">{c}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="sgrid__offers">
          <div className="sgrid__offers-head">
            <h2 className="sgrid__offers-title">What I can help with.</h2>
            <p className="sgrid__offers-sub">Pick what you need, or message me to mix them.</p>
          </div>
                    <ul
            className="bento sgrid__services"
            role="list"
            style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
          >
            {SERVICES.map((s) => (
              <li key={s.title} className="bento__card sgrid__service">
                <span className="bento__head">
                  <span className="sgrid__service-top">
                    <Marks logos={s.logos} />
                    <span className="sgrid__service-index" aria-hidden="true">{s.index} / 04</span>
                  </span>
                  <span className="bento__title">{s.title}</span>
                  <span className="bento__desc">{s.description}</span>
                </span>
                <span className="sgrid__chip" aria-hidden="true">{s.chip}</span>
                <ul className="sgrid__bullets" role="list">
                  {s.bullets.map((b) => (
                    <li key={b} className="sgrid__bullet">
                      <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="sgrid__flow">
          <header className="sgrid__flow-head">
            <div className="sgrid__flow-copy">
              <span className="sgrid__flow-eyebrow">Live automation</span>
                            <h2 className="sgrid__flow-title">See AI automation in action</h2>
              <p className="sgrid__flow-sub">
                An example flow: a form comes in, AI helps decide the next step, and follow-ups run on their own.
              </p>
            </div>
            <ul className="sgrid__flow-tools" role="list" aria-label="Tools that power this flow">
              {TOOLS.map(({ Icon: ToolIcon, label }) => (
                <li key={label} className="sgrid__flow-tool">
                  <ToolIcon size={14} weight="duotone" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </header>
          <div className="sgrid__flow-main">
            <Autopilot compact maxScale={1.08} />
          </div>
        </div>
      </div>
    </section>
  )
}