export type QA = { q: string; a: string }

/**
 * The questions people ask before they email. One list, used by the FAQ
 * accordion on the Contact view (and the legacy long-scroll FAQ section).
 * Five questions, two or three sentences each: the accordion sits in a
 * fixed panel and more than that pushes the email row off the plate.
 */
export const FAQS: QA[] = [
  {
    q: 'What do you do?',
    a: 'I support busy owners and teams with the day-to-day work, so they can focus on growing their business. I also build workflows that automate repeat tasks and make work easier and more efficient.',
  },
  {
    q: 'How fast can you start?',
    a: 'I can usually start within a week. I am flexible to U.S. hours, so we can set a schedule that fits your day.',
  },
  {
    q: 'How much do you charge?',
    a: 'It depends on the tasks and how much support you need. Send me a message about your work, and I will reply with a clear quote.',
  },
  {
    q: 'Where are you based?',
    a: 'I am based in General Santos City, Philippines (GMT+8). I am flexible to U.S. hours, so I can overlap with your workday.',
  },
  {
    q: 'What happens after I write?',
    a: 'I reply within one business day. I will ask a few questions about your tasks and suggest where to start.',
  },
]
