import type React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FolderOpen,
  User,
  Robot,
  Stack,
  Quotes,
  Gear,
  AddressBook,
  EnvelopeSimple,
  PaperPlaneTilt,
} from '@/components/slab'
import { profile } from '@/data/profile'

/**
 * Home's showcase: one card per rail view, each an index of what that view
 * holds. Every card is a link. Motion is transform-only on a clipped inner
 * track, so a card never adds height and Home stays a single viewport.
 */

const PROJECT_SHOTS = [
  '/placeholders/lead-qualification.png',
  '/placeholders/customer-triage.png',
  '/placeholders/zapier-lead-pipeline-reel.png',
  '/placeholders/zapier-invoice-reel.png',
  '/placeholders/make-telegram-faq-chatbot.png',
  '/placeholders/make-client-onboarding.png',
]

const OFFERS = [
  { Icon: Gear, title: 'Workflow Automation', note: 'Apps connected, repeat tasks handled' },
  { Icon: Robot, title: 'AI Workflow Setup', note: 'AI sorts and scores incoming info' },
  { Icon: AddressBook, title: 'Executive Support', note: 'Inbox, follow-ups, and calendar' },
  { Icon: Stack, title: 'Administrative Support', note: 'Spreadsheets, CRM, and call lists' },
] as const

const CLIENTS = [
  {
    name: 'Insurance Professional Agency Inc.',
    role: 'Abraham Boling, Owner',
    work: 'Executive Support · Admin · CRM',
    logo: '/icons/ipa-logo.svg',
  },
]

// Three photos of you, fanned. Small copies are fine - the fan shows them under 100px.
const PHOTOS = [profile.avatarSrc, '/proffesional-profile.jpg?2', '/proffesional-profile.jpg?3']

const AI_BUILDS = [
  'n8n Workflows',
  'AI Lead Scoring',
  'Email Sorting',
  'Slack Alerts',
  'Reply Drafts',
  'APIs & Webhooks',
  'Auto Logging',
  'App Integrations',
]

/**
 * Always-on motion for the Projects reel and the AI Builds chip rows.
 * The lists are doubled in the JSX, so moving the track by exactly half its
 * size loops without a visible jump. Spacing is a margin on each item (not a
 * flex gap) so that half is exact. The reel pauses while the card is hovered.
 * The reel duration is 10s per screenshot (6 screenshots = 60s), so the pace
 * stays the same when screenshots are added or removed.
 */
const motionCss = `
@keyframes hb-reel-up{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@keyframes hb-chips-left{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes hb-chips-right{from{transform:translateX(-50%)}to{transform:translateX(0)}}

.bento__card--projects .bento__reel-track{
  display:flex !important;flex-direction:column !important;gap:0 !important;
  height:max-content !important;
  animation:hb-reel-up 60s linear infinite !important;
  animation-play-state:running !important;
  will-change:transform;
}
.bento__card--projects:hover .bento__reel-track{animation-play-state:paused !important}
.bento__card--projects .bento__shot{display:block;margin-bottom:12px}

.bento__card--ai .bento__chip-track{
  display:flex !important;width:max-content !important;gap:0 !important;
  animation:hb-chips-left 30s linear infinite !important;
  animation-play-state:running !important;
  will-change:transform;
}
.bento__card--ai .bento__chip-row[data-dir="right"] .bento__chip-track{
  animation-name:hb-chips-right !important;
}
.bento__card--ai .bento__chip{margin-right:8px;flex:none;white-space:nowrap}
`

function CardHead({
  Icon,
  title,
  desc,
}: {
  Icon: typeof FolderOpen
  title: string
  desc: string
}) {
  return (
    <header className="bento__head">
      <span className="bento__label">
        <span className="bento__icon">
          <Icon size={20} weight="fill" aria-hidden="true" />
        </span>
        <h3 className="bento__title">{title}</h3>
      </span>
      <p className="bento__desc">{desc}</p>
      <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
    </header>
  )
}

export default function HomeBento() {
  const half = Math.ceil(AI_BUILDS.length / 2)
  const toolRows = [AI_BUILDS.slice(0, half), AI_BUILDS.slice(half)]

  return (
    <>
      <style>{motionCss}</style>
      <nav className="bento" aria-label="Explore the portfolio">
        {/* Projects: the workflow screenshots drift upward on a looped track. */}
        <Link to="/projects" className="bento__card bento__card--projects">
          <CardHead
            Icon={FolderOpen}
            title="Automation Projects"
            desc="Explore practical workflow automations designed to reduce manual work and improve efficiency."
          />
          <div className="bento__media bento__reel" aria-hidden="true">
            <div className="bento__reel-track">
              {[...PROJECT_SHOTS, ...PROJECT_SHOTS].map((src, i) => (
                <span key={i} className="bento__shot">
                  <img src={src} alt="" loading="lazy" decoding="async" />
                </span>
              ))}
            </div>
          </div>
        </Link>

        {/* About: a fanned stack of photos. */}
        <Link to="/about" className="bento__card bento__card--about">
          <CardHead
            Icon={User}
            title="Meet Your Automation Partner"
            desc="I'm Keith, an administrative support professional learning and building AI-powered workflows that help businesses work more efficiently."
          />
          <div className="bento__media bento__fan" aria-hidden="true">
            {PHOTOS.map((src, i) => (
              <span key={src} className="bento__photo" style={{ ['--i' as string]: i }}>
                <img src={src} alt="" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </Link>

        {/* AI builds: two chip rows scrolling against each other. */}
        <Link to="/projects" className="bento__card bento__card--ai">
          <CardHead
            Icon={Robot}
            title="AI Builds"
            desc="Examples of what I can automate for you."
          />
          <div className="bento__media bento__chips" aria-hidden="true">
            {toolRows.map((row, r) => (
              <div key={r} className="bento__chip-row" data-dir={r ? 'right' : 'left'}>
                <div className="bento__chip-track">
                  {[...row, ...row].map((name, i) => (
                    <span key={`${name}-${i}`} className="bento__chip">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Link>

        {/* Contact: takes the slot Credentials used to hold, so the grid stays
            whole. Swap Credentials back in here when there is one to show. */}
        <Link to="/contact" className="bento__card bento__card--creds">
          <CardHead
            Icon={EnvelopeSimple}
            title="Contact"
            desc="Let's explore how automation can help your business."
          />
          <div className="bento__media bento__badge" aria-hidden="true">
            <span className="bento__badge-ring">
              <EnvelopeSimple size={42} weight="duotone" />
            </span>
            <span className="bento__badge-tag">
              <PaperPlaneTilt size={14} weight="fill" />
              Get in touch
            </span>
          </div>
        </Link>

        {/* Services: the four offers as a compact index. */}
        <Link to="/services" className="bento__card bento__card--services">
          <CardHead Icon={Stack} title="Services" desc="" />
          <ul className="bento__media bento__offers" role="list">
            {OFFERS.map(({ Icon, title, note }, i) => (
              <li key={title} className="bento__offer" style={{ '--i': i } as React.CSSProperties}>
                <span className="bento__offer-tile">
                  <Icon size={15} weight="duotone" aria-hidden="true" />
                </span>
                <span className="bento__offer-text">
                  <span className="bento__offer-title">{title}</span>
                  <span className="bento__offer-note">{note}</span>
                </span>
                <span className="bento__offer-num" aria-hidden="true">
                  0{i + 1}
                </span>
              </li>
            ))}
          </ul>
        </Link>

        {/* Testimonials: one client for now, so the loop animation is off. */}
        <Link to="/testimonials" className="bento__card bento__card--quotes">
          <CardHead Icon={Quotes} title="Testimonials" desc="Feedback from my previous professional experience." />
          <div className="bento__media bento__reviews" aria-hidden="true">
            <div className="bento__reviews-track" style={{ animation: 'none' }}>
              {CLIENTS.map((c, i) => (
                <span key={i} className="bento__review">
                  <span className="bento__review-top">
                    {c.logo ? (
                      <img src={c.logo} alt="" width={18} height={18} />
                    ) : (
                      <Quotes size={14} weight="fill" />
                    )}
                    <b>{c.name}</b>
                  </span>
                  <span className="bento__review-role">{c.role}</span>
                  <span className="bento__review-work">{c.work}</span>
                </span>
              ))}
            </div>
          </div>
        </Link>
      </nav>
    </>
  )
}