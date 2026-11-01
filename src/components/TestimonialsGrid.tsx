import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Play, Gauge } from '@/components/slab'
import type { Icon } from '@/components/slab'

/**
 * TestimonialsGrid - the Testimonials view as a fixed viewport.
 *
 * Two columns inside one glass sheet: the proof on the left, the client
 * ledger on the right. The left panel shows a screenshot of the real
 * OnlineJobs.ph review (click it to enlarge).
 * To switch to a video later: drop the .mp4 in public/testimonials/ and set
 * its `src` below (e.g. '/testimonials/client-1.mp4').
 */

const REVIEW_SHOT = '/placeholders/onlinejobs-review.png'
const REVIEW_ALT =
  'Employer review on OnlineJobs.ph from Abraham B., dated August 27, 2026: Keith is excellent and worked for me for almost a year. Unfortunately we had to consolidate positions but he remains eligible for rehire and I would highly recommend him to anyone looking for a reliable VA who needs someone who is capable and willing to follow instructions.'

type Clip = {
  id: string
  index: string
  /** Leave empty until you have the video file. */
  src: string
  poster: string
  duration: string
  kicker: string
  width: number
  height: number
}

const CLIPS: Clip[] = [
  {
    id: 'clip-1',
    index: '01',
    src: '',
    poster: '/placeholders/testimonial-1.jpg',
    duration: '0:00',
    kicker: 'Client review',
    width: 720,
    height: 1080,
  },
]

/* The client ledger. `logoSrc` is optional - without it the medallion falls
   back to the icon. */

type Client = {
  index: string
  name: string
  role: string
  daily: string
  work: string[]
  logoSrc?: string
  Icon: Icon
}

const CLIENTS: Client[] = [
  {
    index: '01',
    name: 'Insurance Professional Agency Inc.',
    role: 'Abraham Boling, Owner',
    daily:
      'A year of U.S. executive and admin support: email management, CRM management, gathering client and lead information, research, and preparing daily call lists.',
    work: ['Executive Support', 'Administrative Support', 'CRM Management', 'Research'],
    logoSrc: '/icons/ipa-logo.svg',
    Icon: Gauge,
  },
]

/** Full-size view of the review screenshot. Click anywhere or press Escape to close. */
function ReviewZoom({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Client review screenshot"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(4px)',
        cursor: 'zoom-out',
      }}
    >
      <img
        src={REVIEW_SHOT}
        alt={REVIEW_ALT}
        style={{
          width: 'min(900px, 100%)',
          height: 'auto',
          display: 'block',
          borderRadius: 14,
          background: '#ffffff',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.45)',
        }}
      />
    </div>,
    document.body,
  )
}

export default function TestimonialsGrid() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [zoom, setZoom] = useState(false)
  const closeZoom = useCallback(() => setZoom(false), [])
  const clip = CLIPS[active]
  const hasVideo = clip.src !== ''
  const pick = (i: number) => {
    setActive(i)
    setPlaying(false)
  }

  return (
    <section className="pgrid tgrid" aria-labelledby="testimonials-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Testimonials</span>
        <h1 className="pgrid__title" id="testimonials-title">
          What clients say
        </h1>
        <p className="pgrid__lede">
          A real review from my past client, and the work I did for them.
        </p>
      </header>

      <div className="home__glass tgrid__glass">
        {/* Left: the real review as a screenshot. */}
        <div className="tgrid__reel">
          <div className="tgrid__stage">
            {playing && hasVideo ? (
              <video
                key={clip.id}
                className="tgrid__video"
                src={clip.src}
                poster={clip.poster}
                width={clip.width}
                height={clip.height}
                controls
                autoPlay
                playsInline
                aria-label={`Video testimonial ${clip.index} from a client`}
              />
            ) : (
              <button
                type="button"
                className="tgrid__cover"
                onClick={() => (hasVideo ? setPlaying(true) : setZoom(true))}
                aria-label={
                  hasVideo
                    ? `Play client testimonial ${clip.index}, ${clip.duration}`
                    : 'Enlarge the client review screenshot from Abraham Boling, Owner of Insurance Professional Agency Inc.'
                }
              >
                {hasVideo && (
                  <img
                    key={clip.id}
                    className="tgrid__cover-img"
                    src={clip.poster}
                    alt=""
                    decoding="async"
                  />
                )}
                <span className="tgrid__cover-shade" aria-hidden="true" />
                {!hasVideo && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 12,
                      padding: '1.25rem 1.25rem 5.5rem',
                      background: 'linear-gradient(160deg, #1e293b, #0f172a)',
                    }}
                  >
                    <img
                      src={REVIEW_SHOT}
                      alt=""
                      decoding="async"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: 12,
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Click to enlarge
                    </span>
                  </span>
                )}
                {hasVideo && (
                  <span className="tgrid__cover-play" aria-hidden="true">
                    <Play size={26} weight="fill" />
                  </span>
                )}
                <span className="tgrid__cover-meta" aria-hidden="true">
                  <span className="tgrid__cover-kicker">{clip.kicker}</span>
                  <span className="tgrid__cover-sub">
                    {hasVideo
                      ? `${clip.duration} · Tap to play`
                      : 'Abraham Boling, Owner · via OnlineJobs.ph'}
                  </span>
                </span>
              </button>
            )}
          </div>

          {CLIPS.length > 1 && (
            <div className="tgrid__picker" role="group" aria-label="Choose a testimonial">
              {CLIPS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className={`tgrid__pick${i === active ? ' is-active' : ''}`}
                  onClick={() => pick(i)}
                  aria-pressed={i === active}
                >
                  <span className="tgrid__pick-thumb" aria-hidden="true">
                    <img src={c.poster} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="tgrid__pick-copy">
                    <span className="tgrid__pick-kicker">Testimonial {c.index}</span>
                    <span className="tgrid__pick-meta">{c.duration}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: the client ledger, one row per client. */}
        <div className="tgrid__ledger">
          <div className="tgrid__ledger-head">
            <h2 className="tgrid__ledger-title">Past client.</h2>
            <p className="tgrid__ledger-sub">The work I handled, day to day.</p>
          </div>

          <ul className="tgrid__clients" role="list">
            {CLIENTS.map((c) => {
              const FallbackIcon = c.Icon
              return (
                <li key={c.index} className="tgrid__client">
                  <span className="tgrid__client-ghost" aria-hidden="true">{c.index}</span>
                  <span className="tgrid__client-mark" aria-hidden="true">
                    {c.logoSrc ? (
                      <img src={c.logoSrc} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <FallbackIcon size={22} weight="duotone" />
                    )}
                  </span>

                  <span className="tgrid__client-body">
                    <span className="tgrid__client-head">
                      <span className="tgrid__client-name">{c.name}</span>
                      <span className="tgrid__client-role">{c.role}</span>
                    </span>
                    <span className="tgrid__client-daily">{c.daily}</span>
                    <ul className="tgrid__client-tags" role="list">
                      {c.work.map((w, i) => (
                        <li key={`${w}-${i}`} className="tgrid__client-tag">
                          {w}
                        </li>
                      ))}
                    </ul>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {zoom && <ReviewZoom onClose={closeZoom} />}
    </section>
  )
}