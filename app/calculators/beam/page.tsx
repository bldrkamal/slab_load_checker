"use client"

import { useState } from "react"

type LoadType = "udl" | "point"

export default function BeamCalculatorPage() {
  const [span, setSpan] = useState(6)
  const [loadType, setLoadType] = useState<LoadType>("udl")
  const [w, setW] = useState(10) // kN/m for UDL
  const [p, setP] = useState(20) // kN for point load
  const [a, setA] = useState(3) // m location of point load from left

  const isUDL = loadType === "udl"

  // Simply supported beam formulas
  const reactions = (() => {
    if (isUDL) {
      const r = (w * span) / 2
      return { ra: r, rb: r }
    }
    const ra = (p * (span - a)) / span
    const rb = (p * a) / span
    return { ra, rb }
  })()

  const maxShear = (() => {
    if (isUDL) return w * span * 0.5
    return Math.max(reactions.ra, reactions.rb)
  })()

  const maxMoment = (() => {
    if (isUDL) return (w * Math.pow(span, 2)) / 8
    // for a point load at a: Mmax occurs at the load
    return reactions.ra * a
  })()

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 uppercase tracking-wide">Beam Calculator (Simply Supported)</h1>

      <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Span L (m)</label>
            <input type="number" value={span} onChange={(e) => setSpan(Number(e.target.value))} className="w-full border border-[hsl(var(--border))] bg-transparent px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Load Type</label>
            <select value={loadType} onChange={(e) => setLoadType(e.target.value as LoadType)} className="w-full border border-[hsl(var(--border))] bg-transparent px-3 py-2">
              <option value="udl">Uniformly Distributed Load (UDL)</option>
              <option value="point">Point Load</option>
            </select>
          </div>
          {isUDL ? (
            <div>
              <label className="block text-sm font-medium mb-1">w (kN/m)</label>
              <input type="number" value={w} onChange={(e) => setW(Number(e.target.value))} className="w-full border border-[hsl(var(--border))] bg-transparent px-3 py-2" />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">P (kN)</label>
                <input type="number" value={p} onChange={(e) => setP(Number(e.target.value))} className="w-full border border-[hsl(var(--border))] bg-transparent px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">a (m from left)</label>
                <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full border border-[hsl(var(--border))] bg-transparent px-3 py-2" />
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <ul className="space-y-1 text-sm">
            <li>Reactions: R_A = {reactions.ra.toFixed(2)} kN, R_B = {reactions.rb.toFixed(2)} kN</li>
            <li>Max Shear V_max = {maxShear.toFixed(2)} kN</li>
            <li>Max Bending Moment M_max = {maxMoment.toFixed(2)} kN·m</li>
          </ul>
          <div className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
            UDL: R_A = R_B = wL/2, M_max = wL²/8. Point load at a: R_A = P(L-a)/L, R_B = Pa/L, M_max = R_A·a.
          </div>
        </div>
      </div>
    </div>
  )
}


