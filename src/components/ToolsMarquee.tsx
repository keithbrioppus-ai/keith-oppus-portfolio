import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './tools-sheet.css'

/**
 * ToolsMarquee
 *
 * Horizontally scrolling strip of brand logos + labels for the tools you work with.
 * The list is duplicated (`doubled`) so the CSS keyframe can translate by -50%
 * and loop seamlessly. Single-color .svg icons with a `color` are rendered as
 * CSS masks tinted by --brand-color; multi-color marks are plain <img> tags.
 * The animated track is aria-hidden; the sr-only <ul> gives screen readers a
 * clean list.
 *
 * On phones the strip is tappable: it opens a sheet listing every tool.
 * To allow this on desktop too, remove the `phone &&` checks below.
 */

type Tool = {
  name: string
  iconPath: string
  /** When set, the SVG silhouette is tinted via CSS mask. Omit for multi-color marks. */
  color?: string
}

export const tools: Tool[] = [
  { name: 'n8n',                  iconPath: '/icons/n8n.svg',             color: '#EA4B71' },
  { name: 'Make',                 iconPath: '/icons/make.svg',            color: '#6D00CC' },
  { name: 'Zapier',               iconPath: '/icons/zapier.svg',          color: '#FF4F00' },
  { name: 'ChatGPT',              iconPath: '/icons/openai.svg',          color: '#000000' },
  { name: 'Claude',               iconPath: '/icons/claude.svg',          color: '#D97757' },
  { name: 'Gemini',               iconPath: '/icons/gemini.svg',          color: '#8E75B2' },
  { name: 'DeepSeek',             iconPath: '/icons/deepseek.svg',        color: '#4D6BFE' },
  { name: 'Google Workspace',     iconPath: '/icons/googleworkspace.svg' },
  { name: 'Microsoft 365',        iconPath: '/icons/microsoft.svg' },
  { name: 'HawkSoft CRM',         iconPath: '/icons/hawksoft.png' },
  { name: 'Slack',                iconPath: '/icons/slack.svg',           color: '#611F69' },
  { name: 'VS Code',              iconPath: '/icons/vscode.svg' },
  { name: 'Docker',               iconPath: '/icons/docker.svg',          color: '#2496ED' },
  { name: 'LM Studio',            iconPath: '/icons/lmstudio.svg',        color: '#000000' },
  { name: 'HubSpot',              iconPath: 'https://cdn.simpleicons.org/hubspot' },
  { name: 'Calendly',             iconPath: 'https://cdn.simpleicons.org/calendly' },
]

function SheetIcon({ tool }: { tool: Tool }) {
  const useMask = tool.iconPath.endsWith('.svg') && !!tool.color
  return useMask ? (
    <span
      className="tools-sheet__icon"
      style={{
        ['--icon-url' as string]: `url('${tool.iconPath}')`,
        ['--brand-color' as string]: tool.color ?? 'var(--navy)',
      }}
    />
  ) : (
    <img
      className="tools-sheet__img"
      src={tool.iconPath}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={28}
      height={28}
    />
  )
}

export default function ToolsMarquee() {
  const doubled = useMemo(() => [...tools, ...tools], [])

  const [open, setOpen] = useState(false)
  const openerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])


  const close = () => {
    setOpen(false)
    openerRef.current?.focus()
  }

  return (
    <section
      className="tools-marquee tools-marquee--tappable"
      aria-label="Tools I work with"
      data-reveal
    >
      <div className="tools-marquee__track" aria-hidden="true">
        {doubled.map((tool, i) => {
          const useMask = tool.iconPath.endsWith('.svg') && !!tool.color
          return (
            <div key={`${tool.name}-${i}`} className="tools-marquee__item">
              <span className="tools-marquee__tile">
                {useMask ? (
                  <span
                    className="tools-marquee__icon"
                    style={{
                      ['--icon-url' as string]: `url('${tool.iconPath}')`,
                      ['--brand-color' as string]: tool.color ?? 'var(--navy)',
                    }}
                  />
                ) : (
                  <img
                    className="tools-marquee__img"
                    src={tool.iconPath}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    width={20}
                    height={20}
                  />
                )}
              </span>
              <span className="tools-marquee__label">{tool.name}</span>
            </div>
          )
        })}
      </div>

      {/* Invisible button laid over the strip, phone only. */}
          <button
        ref={openerRef}
        type="button"
        className="tools-marquee__open"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Show all tools I work with</span>
      </button>

      <ul className="sr-only">
        {tools.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>

      {/* Portaled to <body> so the glass plates cannot clip or offset it. */}
      {open &&
        createPortal(
          <div
            className="tools-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tools-sheet-title"
            onClick={close}
          >
            <div
              className="tools-sheet__panel"
              data-lenis-prevent
              onClick={(e) => e.stopPropagation()}
            >
              <div className="tools-sheet__head">
                <h2 id="tools-sheet-title" className="tools-sheet__title">
                  Tools I work with
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  className="tools-sheet__close"
                  onClick={close}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <ul className="tools-sheet__grid" role="list">
                {tools.map((t) => (
                  <li key={t.name} className="tools-sheet__item">
                    <span className="tools-sheet__tile">
                      <SheetIcon tool={t} />
                    </span>
                    <span className="tools-sheet__name">{t.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}