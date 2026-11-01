/**
 * YOUR IDENTITY - start here.
 *
 * Everything that says who you are lives in this file: name, handle, photo,
 * socials, email and the Home headline. Every value below is a PLACEHOLDER.
 * Replace the text, or hand this file to your AI assistant and tell it what
 * to put in each field.
 *
 * Page-specific copy (projects, services, testimonials, FAQs) lives in the
 * other files in src/data/ and at the top of each view component.
 */

import { Briefcase, SealCheck, Clock, type Icon } from '@/components/slab'

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

/** A proof fact on the phone's Home: a glyph, a short value, a caption. */
export type Stat = { value: string; label: string; Icon: Icon }

export type Profile = {
  name: string
  /** First name, used in "Hi, I'm ___." on About. */
  firstName: string
  handle: string
  /** Short role line under the handle on phones. */
  role: string
  /** Square image. An SVG, WebP or PNG with a transparent background looks best. */
  avatarSrc: string
  /** Tooltip / screen-reader label on the verified tick next to your name. */
  verifiedLabel: string
  email: string
  location: string
  /** Three short proof facts shown on phones under the Home lede. */
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'Keith Brian Oppus',
  firstName: 'Keith',
  handle: 'AI Automation Specialist',
  role: 'Executive Assistant / Administrative Support with AI Automation',
  avatarSrc: '/proffesional-profile.jpg',
  verifiedLabel: 'Verified profile on OnlineJobs.ph',
  email: 'keithbri.oppus@gmail.com',
  location: 'General Santos City, Philippines',
  // Pick any icon from https://phosphoricons.com and import it above.
  stats: [
    { value: '1 yr', label: 'U.S. admin experience', Icon: Briefcase },
    { value: '2', label: 'Automations built', Icon: SealCheck },
    { value: 'GMT+8', label: 'Philippines', Icon: Clock },
  ],
  // The intro types this line, then flies it into the Home headline.
  // Keep it short: two halves, 5-8 words total.
  displayName: { line1: 'Work Smarter', line2: 'with AI Automation' },
  hero: {
    body: 'I build practical AI-powered workflows that reduce repetitive tasks and improve everyday business processes!',
    portraitSrc: '/proffesional-profile.jpg',
    portraitAlt: 'Portrait of Keith',
  },
  socials: [
    { label: 'Facebook profile', href: 'https://www.facebook.com/keith.brian.oppus', iconPath: '/icons/facebook.svg' },
    { label: 'LinkedIn profile', href: 'https://www.linkedin.com/in/keith-brian-support', iconPath: '/icons/linkedin.svg' },
    { label: 'OnlineJobs.ph profile', href: 'https://www.onlinejobs.ph/jobseekers/info/4284747', iconPath: '/icons/onlinejobs.png' },
  ],
}