import type { CSSProperties } from 'react'
import { ArrowUpRight, MapPin } from '@/components/slab'
import { profile } from '@/data/profile'

/**
 * AboutGrid - the About view as a fixed viewport.
 *
 * One glass sheet, two columns: who you are on the left, the illustration
 * on the right. Sized to the panel, so nothing here scrolls.
 *
 * The left column is a ladder, not a paragraph block: one display statement,
 * one line of context, then the four things you do - each carrying the marks
 * of the tools it is built with.
 */

const N8N = { src: '/icons/ai/n8n.svg', name: 'n8n' }
const MAKE = { src: '/icons/make.svg', name: 'Make' }
const ZAPIER = { src: '/icons/ai/zapier.svg', name: 'Zapier' }
const CLAUDE = { src: '/icons/ai/claude-color.svg', name: 'Claude' }
const CHATGPT = { src: '/icons/openai.svg', name: 'ChatGPT' }
const GEMINI = { src: '/icons/gemini.svg', name: 'Gemini' }
const DEEPSEEK = { src: '/icons/deepseek.svg', name: 'DeepSeek' }
const GMAIL = { src: '/icons/gmail.svg', name: 'Gmail' }
const GCAL = { src: '/icons/googlecalendar.svg', name: 'Google Calendar' }
const EXCEL = { src: '/icons/microsoft-excel.svg', name: 'Excel' }
const MS365 = { src: '/icons/microsoft.svg', name: 'Microsoft 365' }
const GWS = { src: '/icons/googleworkspace.svg', name: 'Google Workspace' }
const OUTLOOK = { src: '/icons/microsoft-outlook.svg', name: 'Outlook' }
const GSHEETS = { src: '/icons/googlesheets.svg', name: 'Google Sheets' }

type Capability = {
  index: string
  title: string
  marks: { src: string; name: string }[]
}

const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'Workflow Automation',
    marks: [N8N, MAKE, ZAPIER],
  },
  {
    index: '02',
    title: 'AI Workflow Setup',
    marks: [CLAUDE, CHATGPT, GEMINI, DEEPSEEK],
  },
  {
    index: '03',
    title: 'Executive Support',
    marks: [GMAIL, GCAL, OUTLOOK],
  },
  {
    index: '04',
    title: 'Administrative Support',
    marks: [EXCEL, GSHEETS, MS365, GWS],
  },
]

export default function AboutGrid() {
  return (
    <section className="pgrid agrid" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          {`Hi, I’m ${profile.firstName}.`}
        </h1>
        <p className="pgrid__lede">
          Virtual assistant who builds AI automations for repetitive works!
        </p>
      </header>

      <div className="home__glass agrid__glass">
        <div className="agrid__copy">
          <p className="agrid__lead">
            Same task every day? I turn it into a workflow.
            <span> Fast, reliable support that gives you your time back.</span>
          </p>

          <p className="agrid__note">
            <strong>A year of U.S. executive and admin support</strong> at an insurance agency. Now I build automation workflows that take that
            repetitive work off busy teams.
          </p>

          <ul className="agrid__caps" role="list">
            {CAPABILITIES.map((c) => (
              <li key={c.index} className="agrid__cap">
                <span className="agrid__cap-marks">
                  {c.marks.map((m, i) => (
                    <span
                      key={m.name}
                      className="agrid__mark"
                      style={{ '--i': c.marks.length - i } as CSSProperties}
                    >
                      <img src={m.src} alt={m.name} loading="lazy" decoding="async" />
                    </span>
                  ))}
                </span>
                <span className="agrid__cap-title">{c.title}</span>
                <span className="agrid__cap-index" aria-hidden="true">
                  {c.index}
                </span>
              </li>
            ))}
          </ul>

          {/* One plate, two cells sharing a mark / title / meta anatomy. */}
          <div className="agrid__bar">
            <span className="agrid__cell">
              <span className="agrid__cell-mark agrid__cell-mark--img">
                <img src="/placeholders/badge.svg" alt="" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Verified on OnlineJobs.ph</span>
                <span className="agrid__cell-meta">ID and Timeproof verified</span>
              </span>
            </span>

            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <MapPin size={16} weight="fill" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">{profile.location}</span>
                <span className="agrid__cell-meta">Full-time & Part-time · flexible hours</span>
              </span>
            </span>

            <a
              className="agrid__cell agrid__cell--wide"
              href="https://www.onlinejobs.ph/jobseekers/info/4284747"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="agrid__cell-mark agrid__cell-mark--plain">
                <img src="/icons/onlinejobs.png" alt="" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">OnlineJobs.ph profile</span>
                <span className="agrid__cell-meta">View my profile</span>
              </span>
              <ArrowUpRight className="agrid__cell-go" size={15} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>


<div
  className="agrid__portrait"
  style={{
    position: 'absolute',
    left: '76%',
    right: 'auto',
    bottom: '130px',
    transform: 'translateX(-50%)',
    width: 'clamp(320px, 32vw, 500px)',
    zIndex: 2,
  }}
>
  <img
    src="/proffesional-profile.jpg"
    alt="Portrait of Keith"
    loading="eager"
    decoding="async"
    style={{
      display: 'block',
      width: '100%',
      aspectRatio: '460 / 560',
      borderRadius: '48px 48px 0 0',
      objectFit: 'cover',
      objectPosition: 'center 15%',
      WebkitMaskImage:
        'linear-gradient(to bottom, #000 75%, transparent 100%)',
      maskImage:
        'linear-gradient(to bottom, #000 75%, transparent 100%)',
    }}
  />
</div>
</div>
</section>
)
}
