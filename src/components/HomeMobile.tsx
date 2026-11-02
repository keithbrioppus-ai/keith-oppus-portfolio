import { Link } from 'react-router-dom'
import { SealCheck, CaretRight, Stack, Quotes } from '@/components/slab'
import { profile } from '@/data/profile'
import QuickMenu from './QuickMenu'

/**
 * Home on a phone, the parts the rail and the bento used to carry:
 *
 *   HomeProfile  avatar, name, verified mark, handle and the QuickMenu
 *                (theme + accessibility) - the rail's identity block, laid flat
 *   HomeStats    three proof facts (profile.stats), each named by a glyph so
 *                it reads at a glance
 *   HomeExplore  one shelf card per rail view in a snap row, then the client
 *                who gave feedback
 */

export function HomeProfile() {
  return (
    <header className="hprofile">
      <img className="hprofile__avatar" src={profile.avatarSrc} alt="" width={56} height={56} />
      <div className="hprofile__who">
        <span className="hprofile__name">
          {profile.name}
          <SealCheck size={16} weight="fill" className="hprofile__verified" aria-label={profile.verifiedLabel} />
        </span>
        <span className="hprofile__handle">{profile.handle}</span>
      </div>
      <QuickMenu className="hprofile__menu" />
    </header>
  )
}

export function HomeStats() {
  return (
    <ul className="hstats" role="list">
      {profile.stats.map(({ value, label, Icon }, i) => (
        <li key={i}>
          <Icon className="hstats__icon" size={18} weight="duotone" aria-hidden="true" />
          <b className="hstats__value">{value}</b>
          <span className="hstats__label">{label}</span>
        </li>
      ))}
    </ul>
  )
}

const TILES = [
  {
    n: '01',
    label: 'Projects',
    to: '/projects',
    title: 'Automation projects I have built',
    desc: 'Explore practical workflow automations designed to reduce manual work and improve efficiency.',
    img: '/placeholders/lead-qualification.png',
  },
  {
    n: '02',
    label: 'Services',
    to: '/services',
    title: 'Virtual assistant support, with automation built in',
    desc: 'Daily admin and executive help, plus automation workflows for the tasks that repeat.',
    Icon: Stack,
  },
  {
    n: '03',
    label: 'Testimonials',
    to: '/testimonials',
    title: 'Feedback from my previous professional experience.',
    desc: 'Insurance Professional Agency Inc.',
    Icon: Quotes,
  },
  {
    n: '04',
    label: 'About',
    to: '/about',
    title: 'Meet Your Automation Partner',
    desc: `I'm ${profile.firstName}, an administrative support professional learning and building AI-powered workflows that help businesses work more efficiently.`,
    img: profile.avatarSrc,
  },
] as const

export function HomeExplore() {
  return (
    <>
      <div className="hsec">
        <h2 className="hsec__title">Explore</h2>
      </div>
      <ul className="htiles" role="list">
        {TILES.map((t) => (
          <li key={t.to}>
            <Link to={t.to} className="htile">
              {'img' in t ? (
                <span className="htile__media"><img className="htile__img" src={t.img} alt="" loading="lazy" /></span>
              ) : (
                <span className="htile__media htile__glyph"><t.Icon size={52} weight="duotone" aria-hidden="true" /></span>
              )}
              <span className="htile__body">
                <span className="htile__n">{t.n} {t.label}</span>
                <span className="htile__title">{t.title}</span>
                <span className="htile__desc">{t.desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* A header that links carries its chevron on the title itself. */}
      <div className="hsec">
        <h2 className="hsec__title">
          <Link to="/testimonials" className="hsec__link">
            What clients say
            <CaretRight size={16} weight="bold" aria-hidden="true" />
          </Link>
        </h2>
      </div>
      <Link
        to="/testimonials"
        className="hproof"
        aria-label="Client feedback from Insurance Professional Agency Inc., Abraham Boling, Owner."
      >
        <span className="hproof__stage">
          <img
            src="/icons/ipa-logo.svg"
            alt=""
            loading="lazy"
            style={{ objectFit: 'contain', padding: '14%', boxSizing: 'border-box', background: '#ffffff' }}
          />
        </span>
        <span className="hproof__copy">
          <span className="hproof__title">Insurance Professional Agency Inc.</span>
          <span className="hproof__meta">Abraham Boling, Owner · Executive Support · Admin · CRM</span>
        </span>
      </Link>
    </>
  )
}