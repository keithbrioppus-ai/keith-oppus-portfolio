import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { Icon } from '@/components/slab'

/**
 * ProjectFlow: a small animated diagram of one automation, drawn in the same
 * style as the live automation demo on the Services page (window frame, node
 * tiles, grey connectors with orange dots moving along them).
 *
 * Every project describes its own flow with a FlowSpec: nodes placed on a
 * simple col/row grid, and edges that say which node leads to which. The
 * diagram is drawn at a fixed size and scaled to fit, so it looks the same on
 * every screen. On narrow phones it stops shrinking and scrolls sideways.
 */

export type FlowNode = {
  id: string
  label: string
  sub?: string
  /** Grid position. Columns run left to right, rows top to bottom. */
  col: number
  row: number
  /** App logo shown on the tile. Falls back to Icon, then to the first letter. */
  logo?: string
  Icon?: Icon
  /** start = where the flow begins, good = a successful outcome. */
  tone?: 'start' | 'good'
}

/** label is an optional short tag drawn on the connector, for example a router output name. */
export type FlowEdge = { from: string; to: string; label?: string }
/** A small heading above a row, to group steps (for example one Zap per row). */
export type FlowLane = { row: number; label: string }

export type FlowSpec = {
  title: string
  cols: number
  rows: number
  nodes: FlowNode[]
  edges: FlowEdge[]
  lanes?: FlowLane[]
}

const COL_W = 156
const ROW_H = 144
const NODE_W = 140
const TILE = 64
const TILE_TOP = 24
const STEP_MS = 1000
const MIN_SCALE = 0.62
const MAX_SCALE = 1.08

const cx = (col: number) => COL_W * (col + 0.5)
const cy = (row: number) => ROW_H * row + TILE_TOP + TILE / 2

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function NodeTile({ node, active }: { node: FlowNode; active: boolean }) {
  const [broken, setBroken] = useState(false)
  const NodeIcon = node.Icon

  let background = '#ffffff'
  let border = '#e7e2da'
  if (node.tone === 'start') {
    background = '#fff1e6'
    border = '#fdba74'
  }
  if (node.tone === 'good') {
    background = '#f0fdf4'
    border = '#86efac'
  }
  if (active) border = '#f97316'

  const tile: CSSProperties = {
    width: TILE,
    height: TILE,
    borderRadius: 18,
    display: 'grid',
    placeItems: 'center',
    background,
    border: `1.5px solid ${border}`,
    boxShadow: active
      ? '0 0 0 4px rgba(249, 115, 22, 0.16), 0 10px 22px rgba(234, 88, 12, 0.22)'
      : '0 6px 14px rgba(15, 23, 42, 0.07)',
    transform: active ? 'translateY(-2px)' : 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
  }

  const iconColor = active ? '#ea580c' : '#475569'

  return (
    <div
      style={{
        position: 'absolute',
        left: cx(node.col) - NODE_W / 2,
        top: ROW_H * node.row + TILE_TOP,
        width: NODE_W,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div style={tile}>
        {node.logo && !broken ? (
          <img
            src={node.logo}
            alt=""
            width={30}
            height={30}
            decoding="async"
            style={{ objectFit: 'contain', display: 'block' }}
            onError={() => setBroken(true)}
          />
        ) : NodeIcon ? (
          <NodeIcon size={28} weight="duotone" color={iconColor} aria-hidden="true" />
        ) : (
          <span style={{ fontSize: 22, fontWeight: 700, color: iconColor }}>{node.label.charAt(0)}</span>
        )}
      </div>
      <span
        style={{
          marginTop: 8,
          fontSize: 12.5,
          fontWeight: 700,
          lineHeight: 1.2,
          color: active ? '#ea580c' : '#1e293b',
          transition: 'color 0.3s ease',
        }}
      >
        {node.label}
      </span>
      {node.sub && (
        <span style={{ marginTop: 3, fontSize: 10.5, lineHeight: 1.25, color: '#64748b' }}>{node.sub}</span>
      )}
    </div>
  )
}

export default function ProjectFlow({ spec }: { spec: FlowSpec }) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [boxW, setBoxW] = useState(0)
  const [active, setActive] = useState(0)

  const W = spec.cols * COL_W
  const H = spec.rows * ROW_H

  // Fit the fixed-size drawing to the space it has.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setBoxW(el.clientWidth)
    update()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const scale = boxW ? Math.min(MAX_SCALE, Math.max(MIN_SCALE, boxW / W)) : 1

  // Light up the steps one after another, in the order they are listed.
  useEffect(() => {
    setActive(0)
    if (reduced) return
    const t = window.setInterval(() => setActive((a) => (a + 1) % spec.nodes.length), STEP_MS)
    return () => window.clearInterval(t)
  }, [reduced, spec.nodes.length])

  const edges = useMemo(() => {
    const byId = new Map(spec.nodes.map((n) => [n.id, n]))
    return spec.edges.flatMap((e, i) => {
      const a = byId.get(e.from)
      const b = byId.get(e.to)
      if (!a || !b) return []
      const x1 = cx(a.col) + TILE / 2 + 4
      const y1 = cy(a.row)
      const x2 = cx(b.col) - TILE / 2 - 4
      const y2 = cy(b.row)
      const dx = Math.max(24, (x2 - x1) / 2)
      return [
        {
          key: `${e.from}-${e.to}`,
          label: e.label,
          i,
          x1,
          y1,
          x2,
          y2,
          d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
        },
      ]
    })
  }, [spec])

  const dot = (c: string): CSSProperties => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: c,
    display: 'block',
  })

  return (
    <div
      style={{
        border: '1px solid #e6e0d6',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#faf6ef',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          background: '#eeeae3',
          borderBottom: '1px solid #e6e0d6',
        }}
      >
        <span style={{ display: 'flex', gap: 7, width: 50 }} aria-hidden="true">
          <span style={dot('#ff5f57')} />
          <span style={dot('#febc2e')} />
          <span style={dot('#28c840')} />
        </span>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#6b7280' }}>
          {spec.title}
        </span>
        <span style={{ width: 50 }} aria-hidden="true" />
      </div>

      <div
        ref={wrapRef}
        style={{
          overflowX: 'auto',
          padding: '8px 0 6px',
          backgroundImage: 'radial-gradient(rgba(148, 130, 100, 0.28) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div style={{ width: W * scale, height: H * scale, margin: '0 auto' }}>
          <div
            style={{
              position: 'relative',
              width: W,
              height: H,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
              {edges.map((e) => {
                const delay = `${(e.i % 6) * 0.4}s`
                return (
                  <g key={e.key}>
                    <path d={e.d} fill="none" stroke="#d6d0c6" strokeWidth={2} strokeLinecap="round" />
                    <circle cx={e.x1} cy={e.y1} r={3.5} fill="#cbd5e1" />
                    <circle cx={e.x2} cy={e.y2} r={3.5} fill="#cbd5e1" />
                    {reduced ? (
                      <circle cx={(e.x1 + e.x2) / 2} cy={(e.y1 + e.y2) / 2} r={4.5} fill="#f97316" />
                    ) : (
                      <circle r={4.5} fill="#f97316" opacity={0}>
                        <animateMotion dur="2.6s" begin={delay} repeatCount="indefinite" path={e.d} />
                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          keyTimes="0;0.12;0.88;1"
                          dur="2.6s"
                          begin={delay}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                )
              })}
            </svg>

            {spec.lanes?.map((l) => (
              <span
                key={l.label}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: ROW_H * l.row + 4,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#c2410c',
                }}
              >
                {l.label}
              </span>
            ))}

            {spec.nodes.map((n, i) => (
              <NodeTile key={n.id} node={n} active={i === active} />
            ))}

            {edges
              .filter((e) => e.label)
              .map((e) => (
                <span
                  key={`label-${e.key}`}
                  style={{
                    position: 'absolute',
                    left: (e.x1 + e.x2) / 2,
                    top: (e.y1 + e.y2) / 2,
                    transform: 'translate(-50%, -50%)',
                    boxSizing: 'border-box',
                    maxWidth: 80,
                    padding: '2px 6px',
                    borderRadius: 8,
                    background: '#faf6ef',
                    border: '1px solid #e6e0d6',
                    fontSize: 10,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    textAlign: 'center',
                    color: '#64748b',
                  }}
                >
                  {e.label}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}