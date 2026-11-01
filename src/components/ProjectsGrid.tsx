import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowUpRight,
  X,
  CursorClick,
  Gear,
  Robot,
  Stack,
  Timer,
  CheckCircle,
  User,
  EnvelopeSimple,
} from '@/components/slab'
import ProjectFlow, { type FlowSpec } from './ProjectFlow'

/**
 * Projects: n8n workflows, Zapier pipelines and Make scenarios. Each card
 * previews the workflow and opens a larger view with the full screenshot(s),
 * a description, stats and the steps. Click any screenshot in the pop-up to
 * open the zoom viewer.
 */

type Stat = { value: string; label: string }
type Step = { title: string; body: string }
type GalleryImage = { src: string; caption: string; ratio: number }

type Workflow = {
  id: string
  index: string
  title: string
  tagline: string
  description: string
  imageSrc: string
  /** Optional: several screenshots shown side by side in the pop-up. */
  gallery?: GalleryImage[]
  /** Optional: show the single screenshot in the same fixed-size box the galleries use, so cards line up. */
  fixedPreview?: boolean
  logos: string[]
  badge: string
  stats: Stat[]
  steps: Step[]
}

const N8N = '/icons/ai/n8n.svg'
const GMAIL = '/icons/gmail.svg'
const OPENAI = '/icons/openai.svg'
const SLACK = '/icons/ai/slack-color.svg'
const GSHEETS = '/icons/googlesheets.svg'
const ZAPIER = 'https://cdn.simpleicons.org/zapier'
// Online brand icons (full color), so no local files are needed. Swap for local files any time.
const HUBSPOT = 'https://cdn.simpleicons.org/hubspot'
const CALENDLY = 'https://cdn.simpleicons.org/calendly'
const GDRIVE = 'https://cdn.simpleicons.org/googledrive'
const MAKE = 'https://cdn.simpleicons.org/make'
const TELEGRAM = 'https://cdn.simpleicons.org/telegram'

const WORKFLOWS: Workflow[] = [
  {
    id: 'lead-qualification',
    index: '01',
    title: 'AI Lead Qualification & Alerts',
    tagline: 'Alerts you to the leads that matter, and logs the rest.',
    description:
      'An n8n workflow that captures leads from email and a website form, scores their urgency with AI, and sends a Slack alert only for high-intent leads. Every lead is logged in Google Sheets.',
    imageSrc: '/placeholders/lead-qualification.png',
    logos: [N8N, GMAIL, OPENAI, SLACK, GSHEETS],
    badge: 'n8n workflow',
    stats: [
      { value: '2', label: 'Lead sources' },
      { value: '1', label: 'AI scoring step' },
      { value: '2', label: 'Outputs (Slack, Sheets)' },
    ],
    steps: [
      {
        title: 'Multi-source intake',
        body: 'A Gmail trigger and a website webhook feed one shared format, so everything after works the same.',
      },
      {
        title: 'AI scoring',
        body: 'AI reads each lead and rates it high or low intent from urgency signals in the message.',
      },
      {
        title: 'Route by intent',
        body: 'High-intent leads trigger an immediate Slack alert. Everything else is logged quietly.',
      },
      {
        title: 'Complete audit trail',
        body: 'Every lead is logged in Google Sheets, with a column showing which ones were alerted.',
      },
    ],
  },
  {
    id: 'inquiry-triage',
    index: '02',
    title: 'AI Customer Inquiry Triage & Reply Drafts',
    tagline: 'Sorts every inquiry and drafts replies for review.',
    description:
      'An n8n workflow that classifies incoming support emails by category and urgency with AI. It escalates urgent ones to a human, notifies sales about leads, and drafts a reply that you review before it is sent.',
    imageSrc: '/placeholders/customer-triage.png',
    logos: [N8N, GMAIL, OPENAI, SLACK, GSHEETS],
    badge: 'n8n workflow',
    stats: [
      { value: '5', label: 'Routing paths' },
      { value: '2', label: 'AI steps' },
      { value: '4', label: 'Outputs (Slack, Sheets)' },
    ],
    steps: [
      {
        title: 'AI-powered triage',
        body: 'AI classifies each inquiry by category, sentiment, and urgency, then routes it down one of five paths.',
      },
      {
        title: 'Escalate or notify',
        body: 'Urgent inquiries go to a human in Slack. Sales leads notify the sales team.',
      },
      {
        title: 'Human in the loop',
        body: 'For technical and billing questions, AI drafts a reply but never sends it. It is prompted not to invent details it does not know, and it flags uncertainty to a human.',
      },
      {
        title: 'Unified logging',
        body: 'All five paths feed one shared Google Sheets log, with the action taken recorded for each inquiry.',
      },
    ],
  },
  {
    id: 'lead-to-booking',
    index: '03',
    title: 'Lead-to-Booking Pipeline',
    tagline: 'From first inquiry to booked call, with no manual follow-up.',
    description:
      'Three connected Zapier Zaps that run one business pipeline. New inquiries are qualified by AI and added to HubSpot, quiet leads get an automatic follow-up, and every Calendly booking updates the CRM and notifies the team.',
    imageSrc: '/placeholders/zapier-lead-qualification-crm.png',
    gallery: [
      {
        src: '/placeholders/zapier-lead-qualification-crm.png',
        caption: 'Zap 1: AI Lead Qualification & CRM Automation',
        ratio: 668 / 782,
      },
      {
        src: '/placeholders/zapier-automated-lead-follow-up.png',
        caption: 'Zap 2: Automated Lead Follow-Up',
        ratio: 364 / 785,
      },
      {
        src: '/placeholders/zapier-appointment-booking-crm.png',
        caption: 'Zap 3: Appointment Booking & CRM Update',
        ratio: 411 / 717,
      },
    ],
    logos: [ZAPIER, HUBSPOT, CALENDLY, GMAIL],
    badge: 'Zapier automation',
    stats: [
      { value: '3', label: 'Connected Zaps' },
      { value: '1', label: 'AI scoring step' },
      { value: '2', label: 'Priority paths' },
    ],
    steps: [
      {
        title: 'Qualify and route new leads',
        body: 'A Zapier Form feeds AI by Zapier, which classifies each inquiry as High or Standard priority. Paths route it, HubSpot creates or updates the contact, and Gmail sends the right email with a Calendly booking link. High-priority leads also alert the team.',
      },
      {
        title: 'Follow up automatically',
        body: 'When a lead is marked Follow-up in HubSpot, Zapier waits 24 hours, rechecks the contact, and sends a friendly follow-up email with a booking link if the lead is still eligible.',
      },
      {
        title: 'Track every booking',
        body: 'When someone books or reschedules in Calendly, HubSpot finds or creates the contact and sets the Lead Status to Connected. Gmail then notifies the team with the customer details, appointment type, and the date and time in Philippine time.',
      },
    ],
  },
  {
    id: 'invoice-processing',
    index: '04',
    title: 'AI Invoice Processing & Validation',
    tagline: 'Reads, checks, and sorts every invoice that lands in your inbox.',
    description:
      'A Zapier workflow that reads invoice PDFs from email, extracts the key fields with AI, and saves the file to Google Drive. It validates each invoice, flags duplicates, sends questionable ones to review, and logs clean ones as approved.',
    imageSrc: '/placeholders/zapier-invoice-part-1.png',
    gallery: [
      {
        src: '/placeholders/zapier-invoice-part-1.png',
        caption: 'Part 1: Intake, extraction and checks',
        ratio: 523 / 864,
      },
      {
        src: '/placeholders/zapier-invoice-part-2.png',
        caption: 'Part 2: Validation and routing paths',
        ratio: 943 / 809,
      },
    ],
    logos: [ZAPIER, GMAIL, GSHEETS, GDRIVE],
    badge: 'Zapier automation',
    stats: [
      { value: '18', label: 'Automated steps' },
      { value: '3', label: 'Routing paths' },
      { value: '2', label: 'AI steps' },
    ],
    steps: [
      {
        title: 'Capture and read the invoice',
        body: 'Gmail receives the invoice email and a filter allows PDF files only. PDF.co converts the PDF to text, and AI by Zapier extracts the invoice fields.',
      },
      {
        title: 'Calculate and check',
        body: 'Formatter calculates the subtotal and tax, Google Sheets checks for a duplicate invoice, and the PDF is saved to Google Drive.',
      },
      {
        title: 'Validate and route',
        body: 'Formatter calculates the total difference, then Paths routes each invoice by its validation result: Duplicate, Needs Review, or Approved.',
      },
      {
        title: 'Act on each result',
        body: 'Duplicates trigger an alert email. Invoices that need review get an AI-written review reason, are logged as Needs Review, and trigger a review alert. Approved invoices are logged as Approved and get a confirmation email.',
      },
    ],
  },
  {
    id: 'telegram-faq-chatbot',
    index: '05',
    title: 'Telegram FAQ Chatbot',
    tagline: 'Answers common questions instantly, and logs every chat.',
    description:
      'A Make scenario built for an example business, Keith Dental Clinic. People message a Telegram bot and get an instant answer from a Google Sheets knowledge base, matched by keyword. New users get a welcome message, unmatched questions get a fallback reply, and every conversation is logged.',
    imageSrc: '/placeholders/make-telegram-faq-chatbot.png',
    fixedPreview: true,
    logos: [MAKE, TELEGRAM, GSHEETS],
    badge: 'Make automation',
    stats: [
      { value: '10', label: 'Automated steps' },
      { value: '3', label: 'Reply paths' },
      { value: '2', label: 'Connected apps' },
    ],
    steps: [
      {
        title: 'Receive the message',
        body: 'A Telegram trigger catches every message sent to the bot. A router sends the /start command to a welcome message and everything else to the question route.',
      },
      {
        title: 'Find the answer',
        body: 'Google Sheets searches the Knowledge Base tab for a keyword match, and a text aggregator combines the matching answer.',
      },
      {
        title: 'Reply or fall back',
        body: 'A second router sends the answer when one is found. When nothing matches, the bot sends a fallback reply instead of going silent.',
      },
      {
        title: 'Log every conversation',
        body: 'Both the answer path and the fallback path add a row to the Chat Log sheet, so every conversation is recorded.',
      },
    ],
  },
  {
    id: 'client-onboarding',
    index: '06',
    title: 'Client Onboarding Automation',
    tagline: 'Sets up every new client and sends the right welcome email.',
    description:
      'A Make scenario that runs as soon as a client submits the intake form. It creates a Google Drive folder for the client, logs them in a tracker sheet, sends a welcome email matched to their package (Starter, Standard or Premium), and alerts you in Telegram.',
    imageSrc: '/placeholders/make-client-onboarding.png',
    fixedPreview: true,
    logos: [MAKE, GSHEETS, GDRIVE, GMAIL, TELEGRAM],
    badge: 'Make automation',
    stats: [
      { value: '10', label: 'Automated steps' },
      { value: '3', label: 'Package routes' },
      { value: '4', label: 'Connected apps' },
    ],
    steps: [
      {
        title: 'Capture the intake',
        body: 'A Google Form feeds a Google Sheet, and Make watches for each new response.',
      },
      {
        title: 'Set up the client',
        body: 'A Google Drive folder is created for the client inside a Clients folder, and the client is logged in the Client Tracker sheet.',
      },
      {
        title: 'Match the package',
        body: 'A router checks which package the client chose (Starter, Standard or Premium), and Gmail sends the matching welcome email.',
      },
      {
        title: 'Alert the owner',
        body: 'Every package route ends with a Telegram alert, so you know right away when a new client comes in.',
      },
    ],
  },
]

/* ---------- Live automation flows (one per project, keyed by project id) ---------- */

const FLOWS: Record<string, FlowSpec> = {
  'lead-qualification': {
    title: 'AI Lead Qualification & Alerts',
    cols: 6,
    rows: 3,
    nodes: [
      { id: 'gmail', label: 'Gmail Trigger', sub: 'New lead email', col: 0, row: 0, logo: GMAIL, tone: 'start' },
      { id: 'hook', label: 'Website Webhook', sub: 'Form submitted', col: 0, row: 2, logo: N8N, tone: 'start' },
      { id: 'merge', label: 'Merge and Normalize', sub: 'One shared format', col: 1, row: 1, Icon: Stack },
      { id: 'ai', label: 'AI Scoring', sub: 'High or low intent', col: 2, row: 1, Icon: Robot },
      { id: 'route', label: 'Route by Intent', sub: 'High intent?', col: 3, row: 1, Icon: Gear },
      { id: 'slack', label: 'Slack Alert', sub: 'High intent only', col: 4, row: 0, logo: SLACK },
      { id: 'log-hot', label: 'Log to Sheets', sub: 'Marked as alerted', col: 5, row: 0, logo: GSHEETS },
      { id: 'log-cold', label: 'Log to Sheets', sub: 'Logged quietly', col: 4, row: 2, logo: GSHEETS },
    ],
    edges: [
      { from: 'gmail', to: 'merge' },
      { from: 'hook', to: 'merge' },
      { from: 'merge', to: 'ai' },
      { from: 'ai', to: 'route' },
      { from: 'route', to: 'slack' },
      { from: 'slack', to: 'log-hot' },
      { from: 'route', to: 'log-cold' },
    ],
  },
  'inquiry-triage': {
    title: 'AI Customer Inquiry Triage & Reply Drafts',
    cols: 7,
    rows: 4,
    nodes: [
      { id: 'inquiry', label: 'New Support Inquiry', sub: 'Gmail Trigger', col: 0, row: 1, logo: GMAIL, tone: 'start' },
      { id: 'normalize', label: 'Normalize Email Data', sub: 'Edit Fields', col: 1, row: 1, Icon: Stack },
      { id: 'classify', label: 'AI: Classify Inquiry', sub: 'OpenAI: category, sentiment, urgency', col: 2, row: 1, logo: OPENAI },
      { id: 'parse', label: 'Parse AI Classification', sub: 'Code', col: 3, row: 1, Icon: Gear },
      { id: 'route', label: 'Route by Category & Urgency', sub: 'Switch, 5 outputs', col: 4, row: 1, Icon: Gear },
      { id: 'escalate', label: 'Alert: Escalate to Human', sub: 'Slack message', col: 5, row: 0, logo: SLACK },
      { id: 'sales', label: 'Alert: Notify Sales', sub: 'Slack message', col: 5, row: 1, logo: SLACK },
      { id: 'log', label: 'Log All Inquiries', sub: 'Google Sheets, Action Taken set per path', col: 5, row: 2, logo: GSHEETS },
      { id: 'draft', label: 'AI: Draft Reply', sub: 'OpenAI, never auto-sends', col: 5, row: 3, logo: OPENAI },
      { id: 'post', label: 'Post Draft for Review', sub: 'Slack, a human checks it', col: 6, row: 3, logo: SLACK },
    ],
    edges: [
      { from: 'inquiry', to: 'normalize' },
      { from: 'normalize', to: 'classify' },
      { from: 'classify', to: 'parse' },
      { from: 'parse', to: 'route' },
      { from: 'route', to: 'escalate', label: 'Angry, High Urgency' },
      { from: 'route', to: 'sales', label: 'Sales Lead' },
      { from: 'route', to: 'log', label: 'All 5 paths' },
      { from: 'route', to: 'draft', label: 'Technical, billing' },
      { from: 'draft', to: 'post' },
    ],
  },
  'lead-to-booking': {
    title: 'Lead-to-Booking Pipeline',
    cols: 6,
    rows: 3,
    lanes: [
      { row: 0, label: 'Zap 1: Qualify and route new leads' },
      { row: 1, label: 'Zap 2: Follow up automatically' },
      { row: 2, label: 'Zap 3: Track every booking' },
    ],
    nodes: [
      { id: 'z1-form', label: 'Zapier Form', sub: 'New lead submitted', col: 0, row: 0, logo: ZAPIER, tone: 'start' },
      { id: 'z1-ai', label: 'AI Qualification', sub: 'High or Standard priority', col: 1, row: 0, Icon: Robot },
      { id: 'z1-paths', label: 'Route by Priority', sub: 'Paths', col: 2, row: 0, Icon: Gear },
      { id: 'z1-hub', label: 'HubSpot Contact', sub: 'Create or update', col: 3, row: 0, logo: HUBSPOT },
      { id: 'z1-mail', label: 'Send Email', sub: 'With Calendly link', col: 4, row: 0, logo: GMAIL },
      { id: 'z1-team', label: 'Alert Team', sub: 'High priority only', col: 5, row: 0, Icon: EnvelopeSimple },
      { id: 'z2-hub', label: 'Marked Follow-up', sub: 'HubSpot lead status', col: 0, row: 1, logo: HUBSPOT, tone: 'start' },
      { id: 'z2-wait', label: 'Wait 24 Hours', sub: 'Delay', col: 1, row: 1, Icon: Timer },
      { id: 'z2-check', label: 'Recheck Contact', sub: 'Still eligible?', col: 2, row: 1, logo: HUBSPOT },
      { id: 'z2-mail', label: 'Follow-Up Email', sub: 'With booking link', col: 3, row: 1, logo: GMAIL },
      { id: 'z3-cal', label: 'Calendly Booking', sub: 'Booked or rescheduled', col: 0, row: 2, logo: CALENDLY, tone: 'start' },
      { id: 'z3-hub', label: 'Update HubSpot', sub: 'Find or create, set Connected', col: 1, row: 2, logo: HUBSPOT },
      { id: 'z3-mail', label: 'Notify Team', sub: 'Details and Philippine time', col: 2, row: 2, logo: GMAIL },
    ],
    edges: [
      { from: 'z1-form', to: 'z1-ai' },
      { from: 'z1-ai', to: 'z1-paths' },
      { from: 'z1-paths', to: 'z1-hub' },
      { from: 'z1-hub', to: 'z1-mail' },
      { from: 'z1-mail', to: 'z1-team' },
      { from: 'z2-hub', to: 'z2-wait' },
      { from: 'z2-wait', to: 'z2-check' },
      { from: 'z2-check', to: 'z2-mail' },
      { from: 'z3-cal', to: 'z3-hub' },
      { from: 'z3-hub', to: 'z3-mail' },
    ],
  },
  'invoice-processing': {
    title: 'AI Invoice Processing & Validation',
    cols: 6,
    rows: 4,
    lanes: [
      { row: 0, label: 'Part 1: Intake, extraction and checks' },
      { row: 1, label: 'Part 2: Validation and routing' },
    ],
    nodes: [
      { id: 'mail', label: 'Invoice Email', sub: 'Arrives in Gmail', col: 0, row: 0, logo: GMAIL, tone: 'start' },
      { id: 'filter', label: 'PDF Files Only', sub: 'Filter', col: 1, row: 0, Icon: Gear },
      { id: 'text', label: 'PDF to Text', sub: 'PDF.co', col: 2, row: 0, Icon: Stack },
      { id: 'extract', label: 'AI Extraction', sub: 'Invoice fields', col: 3, row: 0, Icon: Robot },
      { id: 'check', label: 'Calculate and Check', sub: 'Subtotal, tax, duplicate lookup', col: 4, row: 0, logo: GSHEETS },
      { id: 'drive', label: 'Save to Drive', sub: 'PDF stored', col: 5, row: 0, logo: GDRIVE },
      { id: 'validate', label: 'Validate Total', sub: 'Total difference', col: 0, row: 2, Icon: CheckCircle },
      { id: 'route', label: 'Route by Result', sub: 'Paths', col: 1, row: 2, Icon: Gear },
      { id: 'dup', label: 'Duplicate', sub: 'Invoice already logged', col: 2, row: 1, Icon: Stack },
      { id: 'dup-mail', label: 'Alert Email', sub: 'Duplicate flagged', col: 3, row: 1, Icon: EnvelopeSimple },
      { id: 'review', label: 'Needs Review', sub: 'Questionable invoice', col: 2, row: 2, Icon: User },
      { id: 'review-ai', label: 'AI Review Reason', sub: 'Why it needs review', col: 3, row: 2, Icon: Robot },
      { id: 'review-log', label: 'Log as Needs Review', sub: 'Invoice tracker', col: 4, row: 2, logo: GSHEETS },
      { id: 'review-mail', label: 'Review Alert', sub: 'Sent for review', col: 5, row: 2, Icon: EnvelopeSimple },
      { id: 'ok', label: 'Approved', sub: 'Clean invoice', col: 2, row: 3, Icon: CheckCircle, tone: 'good' },
      { id: 'ok-log', label: 'Log as Approved', sub: 'Invoice tracker', col: 3, row: 3, logo: GSHEETS },
      { id: 'ok-mail', label: 'Confirmation Email', sub: 'Approved', col: 4, row: 3, logo: GMAIL },
    ],
    edges: [
      { from: 'mail', to: 'filter' },
      { from: 'filter', to: 'text' },
      { from: 'text', to: 'extract' },
      { from: 'extract', to: 'check' },
      { from: 'check', to: 'drive' },
      { from: 'validate', to: 'route' },
      { from: 'route', to: 'dup' },
      { from: 'dup', to: 'dup-mail' },
      { from: 'route', to: 'review' },
      { from: 'review', to: 'review-ai' },
      { from: 'review-ai', to: 'review-log' },
      { from: 'review-log', to: 'review-mail' },
      { from: 'route', to: 'ok' },
      { from: 'ok', to: 'ok-log' },
      { from: 'ok-log', to: 'ok-mail' },
    ],
  },
  'telegram-faq-chatbot': {
    title: 'Telegram FAQ Chatbot',
    cols: 7,
    rows: 4,
    nodes: [
      { id: 'recv', label: 'Receive Message', sub: 'Telegram trigger', col: 0, row: 1, logo: TELEGRAM, tone: 'start' },
      { id: 'router1', label: 'Welcome or Question', sub: 'Router', col: 1, row: 1, Icon: Gear },
      { id: 'welcome', label: 'Send Welcome Message', sub: '/start command', col: 2, row: 0, logo: TELEGRAM },
      { id: 'search', label: 'Search Knowledge Base', sub: 'Keyword match', col: 2, row: 2, logo: GSHEETS },
      { id: 'combine', label: 'Combine Matching Answer', sub: 'Text aggregator', col: 3, row: 2, Icon: Stack },
      { id: 'router2', label: 'Has Answer or No Match', sub: 'Router', col: 4, row: 2, Icon: Gear },
      { id: 'answer', label: 'Send Answer', sub: 'Has answer', col: 5, row: 1, logo: TELEGRAM, tone: 'good' },
      { id: 'log1', label: 'Log Conversation', sub: 'Chat Log sheet', col: 6, row: 1, logo: GSHEETS },
      { id: 'fallback', label: 'Send Fallback Reply', sub: 'No match', col: 5, row: 3, logo: TELEGRAM },
      { id: 'log2', label: 'Log Conversation', sub: 'Chat Log sheet', col: 6, row: 3, logo: GSHEETS },
    ],
    edges: [
      { from: 'recv', to: 'router1' },
      { from: 'router1', to: 'welcome' },
      { from: 'router1', to: 'search' },
      { from: 'search', to: 'combine' },
      { from: 'combine', to: 'router2' },
      { from: 'router2', to: 'answer' },
      { from: 'answer', to: 'log1' },
      { from: 'router2', to: 'fallback' },
      { from: 'fallback', to: 'log2' },
    ],
  },
  'client-onboarding': {
    title: 'Client Onboarding Automation',
    cols: 6,
    rows: 3,
    nodes: [
      { id: 'form', label: 'New Intake Form Response', sub: 'Google Form to Sheets', col: 0, row: 1, logo: GSHEETS, tone: 'start' },
      { id: 'folder', label: 'Create Client Folder', sub: 'Google Drive', col: 1, row: 1, logo: GDRIVE },
      { id: 'tracker', label: 'Log Client in Tracker', sub: 'Client Tracker sheet', col: 2, row: 1, logo: GSHEETS },
      { id: 'pkg', label: 'Route by Package', sub: 'Starter, Standard, Premium', col: 3, row: 1, Icon: Gear },
      { id: 'starter', label: 'Send Starter Welcome Email', sub: 'Starter', col: 4, row: 0, logo: GMAIL },
      { id: 'standard', label: 'Send Standard Welcome Email', sub: 'Standard', col: 4, row: 1, logo: GMAIL },
      { id: 'premium', label: 'Send Premium Welcome Email', sub: 'Premium', col: 4, row: 2, logo: GMAIL },
      { id: 'tg-starter', label: 'Alert Me in Telegram', sub: 'New client', col: 5, row: 0, logo: TELEGRAM },
      { id: 'tg-standard', label: 'Alert Me in Telegram', sub: 'New client', col: 5, row: 1, logo: TELEGRAM },
      { id: 'tg-premium', label: 'Alert Me in Telegram', sub: 'New client', col: 5, row: 2, logo: TELEGRAM },
    ],
    edges: [
      { from: 'form', to: 'folder' },
      { from: 'folder', to: 'tracker' },
      { from: 'tracker', to: 'pkg' },
      { from: 'pkg', to: 'starter' },
      { from: 'pkg', to: 'standard' },
      { from: 'pkg', to: 'premium' },
      { from: 'starter', to: 'tg-starter' },
      { from: 'standard', to: 'tg-standard' },
      { from: 'premium', to: 'tg-premium' },
    ],
  },
}

/** The tool marks, stacked horizontally on white tiles. */
function Marks({ logos }: { logos: string[] }) {
  return (
    <span className="bento__logos" aria-hidden="true">
      {logos.map((src) => (
        <span key={src} className="bento__logo">
          <img
            src={src}
            alt=""
            width={22}
            height={22}
            decoding="async"
            onError={(e) => {
              const tile = e.currentTarget.parentElement
              if (tile) tile.style.display = 'none'
            }}
          />
        </span>
      ))}
    </span>
  )
}

/* ---------- Zoom viewer ---------- */

type ZoomTarget = { src: string; alt: string }

const MAX_ZOOM = 6
const DOUBLE_CLICK_ZOOM = 2.5

const toolBtn: CSSProperties = {
  minWidth: 40,
  height: 40,
  padding: '0 14px',
  borderRadius: 999,
  border: 'none',
  background: '#ffffff',
  color: '#0f172a',
  fontSize: 18,
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

/**
 * Full-screen viewer for one screenshot. Scroll or use the buttons to zoom,
 * drag to move around once zoomed in, double-click to jump in and out.
 * Escape closes only the viewer, not the project pop-up behind it.
 */
function ZoomViewer({ target, onClose }: { target: ZoomTarget; onClose: () => void }) {
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const viewRef = useRef(view)
  viewRef.current = view
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)

  /** Zoom by a factor around a point (relative to the stage centre). */
  const zoomAt = useCallback((factor: number, px = 0, py = 0) => {
    setView((v) => {
      const next = Math.min(MAX_ZOOM, Math.max(1, v.scale * factor))
      if (next === 1) return { scale: 1, x: 0, y: 0 }
      const k = next / v.scale
      return { scale: next, x: px - (px - v.x) * k, y: py - (py - v.y) * k }
    })
  }, [])

  const reset = useCallback(() => setView({ scale: 1, x: 0, y: 0 }), [])

  const centreOffset = (clientX: number, clientY: number) => {
    const r = stageRef.current?.getBoundingClientRect()
    if (!r) return { px: 0, py: 0 }
    return { px: clientX - (r.left + r.width / 2), py: clientY - (r.top + r.height / 2) }
  }

  // Wheel zoom needs a non-passive listener so the page behind never scrolls.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const r = el.getBoundingClientRect()
      zoomAt(
        Math.exp(-e.deltaY * 0.0018),
        e.clientX - (r.left + r.width / 2),
        e.clientY - (r.top + r.height / 2),
      )
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  // Capture phase, so Escape closes this viewer before the pop-up behind sees it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === '+' || e.key === '=') {
        zoomAt(1.4)
      } else if (e.key === '-') {
        zoomAt(1 / 1.4)
      } else if (e.key === '0') {
        reset()
      }
    }
    document.addEventListener('keydown', onKey, true)
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => document.removeEventListener('keydown', onKey, true)
  }, [onClose, zoomAt, reset])

  const { scale, x, y } = view

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Zoomed view: ${target.alt}`}
      data-lenis-prevent
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        ref={stageRef}
        onPointerDown={(e) => {
          if (viewRef.current.scale <= 1) return
          e.currentTarget.setPointerCapture(e.pointerId)
          drag.current = {
            sx: e.clientX,
            sy: e.clientY,
            ox: viewRef.current.x,
            oy: viewRef.current.y,
          }
          setDragging(true)
        }}
        onPointerMove={(e) => {
          const d = drag.current
          if (!d) return
          setView((v) => ({ ...v, x: d.ox + e.clientX - d.sx, y: d.oy + e.clientY - d.sy }))
        }}
        onPointerUp={() => {
          drag.current = null
          setDragging(false)
        }}
        onPointerCancel={() => {
          drag.current = null
          setDragging(false)
        }}
        onDoubleClick={(e) => {
          if (viewRef.current.scale > 1) {
            reset()
          } else {
            const { px, py } = centreOffset(e.clientX, e.clientY)
            zoomAt(DOUBLE_CLICK_ZOOM, px, py)
          }
        }}
        onClick={(e) => {
          // A click on empty space closes the viewer, but only when not zoomed in.
          if (e.target === e.currentTarget && viewRef.current.scale === 1) onClose()
        }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          touchAction: 'none',
          cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <img
          src={target.src}
          alt={target.alt}
          draggable={false}
          style={{
            maxWidth: '94vw',
            maxHeight: '78vh',
            objectFit: 'contain',
            display: 'block',
            borderRadius: 10,
            background: '#ffffff',
            userSelect: 'none',
            cursor: scale > 1 ? 'inherit' : 'zoom-in',
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: dragging ? 'none' : 'transform 120ms ease-out',
          }}
        />
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close zoom"
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          background: '#ffffff',
          color: '#0f172a',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={18} weight="bold" />
      </button>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center', padding: '0 16px' }}>
          Scroll to zoom, drag to move, double-click to toggle
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'auto' }}>
          <button type="button" style={toolBtn} onClick={() => zoomAt(1 / 1.5)} aria-label="Zoom out">
            −
          </button>
          <span
            style={{
              minWidth: 56,
              textAlign: 'center',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {Math.round(scale * 100)}%
          </span>
          <button type="button" style={toolBtn} onClick={() => zoomAt(1.5)} aria-label="Zoom in">
            +
          </button>
          <button type="button" style={{ ...toolBtn, fontSize: 13 }} onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Wraps a screenshot so it can be clicked (or tabbed to) to open the zoom viewer. */
function ZoomTrigger({
  label,
  onZoom,
  children,
}: {
  label: string
  onZoom: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onZoom}
      aria-label={`Zoom in on ${label}`}
      style={{
        display: 'block',
        width: '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'zoom-in',
        textAlign: 'inherit',
        font: 'inherit',
        color: 'inherit',
      }}
    >
      {children}
    </button>
  )
}

/* ---------- Dialog ---------- */

const panelStyle: CSSProperties = {
  background: '#ffffff',
  color: '#0f172a',
  borderRadius: 22,
  padding: 20,
  width: 'min(1040px, 100%)',
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  textAlign: 'left',
  boxShadow: '0 30px 80px rgba(15, 23, 42, 0.35)',
}

const statStyle: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: '12px 14px',
  background: '#f8fafc',
}

function WorkflowModal({ w, onClose }: { w: Workflow; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [zoom, setZoom] = useState<ZoomTarget | null>(null)
  const closeZoom = useCallback(() => setZoom(null), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <>
      {createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={w.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 8000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <X size={18} weight="bold" />
          </button>

          <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} style={panelStyle}>
            {w.gallery ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 14,
                  alignItems: 'start',
                }}
              >
                {w.gallery.map((g) => (
                  <figure key={g.src} style={{ margin: 0 }}>
                    <ZoomTrigger label={g.caption} onZoom={() => setZoom({ src: g.src, alt: g.caption })}>
                      <img
                        src={g.src}
                        alt={g.caption}
                        style={{
                          width: '100%',
                          display: 'block',
                          borderRadius: 14,
                          border: '1px solid #e2e8f0',
                        }}
                      />
                    </ZoomTrigger>
                    <figcaption
                      style={{
                        marginTop: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#475569',
                        textAlign: 'center',
                      }}
                    >
                      {g.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <ZoomTrigger
                label={`${w.title} workflow screenshot`}
                onZoom={() => setZoom({ src: w.imageSrc, alt: `${w.title} workflow screenshot` })}
              >
                <img
                  src={w.imageSrc}
                  alt={`${w.title} workflow screenshot`}
                  style={{ width: '100%', display: 'block', borderRadius: 14 }}
                />
              </ZoomTrigger>
            )}
            <p
              style={{
                margin: '10px 0 0',
                fontSize: 12,
                color: '#64748b',
                textAlign: 'center',
              }}
            >
              Click a screenshot to zoom in
            </p>
            <div style={{ padding: '14px 6px 4px' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#c2410c',
                  background: '#fff1e6',
                  borderRadius: 999,
                  padding: '4px 10px',
                }}
              >
                {w.badge}
              </span>
              <h2 style={{ fontSize: 26, margin: '10px 0 6px', lineHeight: 1.2 }}>{w.title}</h2>
              <p style={{ margin: '0 0 16px', color: '#475569', lineHeight: 1.55 }}>{w.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginBottom: 18 }}>
                {w.stats.map((s) => (
                  <div key={s.label} style={statStyle}>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
                {w.steps.map((s, i) => (
                  <li key={s.title} style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: '#ea580c', fontWeight: 700, minWidth: 22 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <strong style={{ display: 'block' }}>{s.title}</strong>
                      <span style={{ color: '#475569', lineHeight: 1.5 }}>{s.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {FLOWS[w.id] && (
                <div style={{ marginTop: 26 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#ea580c',
                    }}
                  >
                    Live automation
                  </span>
                  <h3 style={{ fontSize: 20, margin: '6px 0 4px', lineHeight: 1.25 }}>See how this workflow runs</h3>
                  <p style={{ margin: '0 0 12px', color: '#475569', lineHeight: 1.5, fontSize: 14 }}>
                    The main steps of this project, running in order.
                  </p>
                  <ProjectFlow spec={FLOWS[w.id]} />
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
      {zoom && <ZoomViewer target={zoom} onClose={closeZoom} />}
    </>
  )
}

/* ---------- The page ---------- */

/** Two plain columns, so a card always sits directly under the one above it. */
const layoutCss = `
.pgrid-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
.pgrid-col{display:flex;flex-direction:column;gap:16px;min-width:0}
.pgrid-cols .bento__card{width:100%;height:auto !important;min-height:0 !important;max-height:none !important;aspect-ratio:auto !important;contain:none !important;overflow:visible !important;grid-area:auto !important}
@media (max-width:860px){.pgrid-cols{grid-template-columns:1fr}}
.pgrid{display:block !important;height:100vh !important;max-height:100vh !important;overflow-y:auto !important;overscroll-behavior:contain;box-sizing:border-box;padding-bottom:48px}
`

export default function ProjectsGrid() {
  const [open, setOpen] = useState<Workflow | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const show = useCallback((w: Workflow, el: HTMLElement) => {
    triggerRef.current = el
    setOpen(w)
  }, [])
  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  return (
    <section
      className="pgrid"
      aria-labelledby="projects-title"
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
    >
      <style>{layoutCss}</style>
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Projects</span>
        <h1 className="pgrid__title" id="projects-title">
          Automation projects I have built
        </h1>
        <p className="pgrid__lede">
          Practical AI workflows, with more on the way. Open a card to see how each one works!
        </p>
      </header>

      <div
        style={{
          position: 'relative',
          marginTop: 28,
          padding: 16,
          borderRadius: 28,
          border: '1px solid rgba(15, 23, 42, 0.06)',
          background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #dbe7ff 100%)',
          height: 'auto',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 999,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#0f172a',
            whiteSpace: 'nowrap',
          }}
        >
          <CursorClick size={14} weight="duotone" color="#ea580c" />
          Click a card to open it
        </span>
        <div className="pgrid-cols">
          {[0, 1].map((col) => (
            <div key={col} className="pgrid-col">
              {WORKFLOWS.filter((_, i) => i % 2 === col).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className="bento__card bento__card--btn"
                  onClick={(e) => show(w, e.currentTarget)}
                  aria-haspopup="dialog"
                >
                  <span className="bento__head">
                    <Marks logos={w.logos} />
                    <span className="bento__title">{w.title}</span>
                    <span className="bento__desc">{w.tagline}</span>
                    <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
                  </span>
                  {w.gallery || w.fixedPreview ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                        aspectRatio: '670 / 359',
                        borderRadius: 12,
                        overflow: 'hidden',
                        marginTop: 10,
                        padding: 12,
                        boxSizing: 'border-box',
                        background: '#f1f5f9',
                      }}
                      aria-hidden="true"
                    >
                      {(w.gallery ?? [{ src: w.imageSrc, caption: '', ratio: 1 }]).map((g) => (
                        <img
                          key={g.src}
                          src={g.src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          style={{
                            flex: `${g.ratio} 1 0`,
                            minWidth: 0,
                            height: '100%',
                            objectFit: 'contain',
                            display: 'block',
                          }}
                        />
                      ))}
                    </span>
                  ) : (
                    <span style={{ display: 'block', borderRadius: 12, overflow: 'hidden', marginTop: 10 }} aria-hidden="true">
                      <img
                        src={w.imageSrc}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', display: 'block' }}
                      />
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {open && <WorkflowModal w={open} onClose={close} />}
    </section>
  )
}