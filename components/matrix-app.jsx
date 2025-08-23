"use client"

// src/App.jsx
import { useState, useRef, useEffect } from "react"
import { Calculator, Menu, X, BookOpen, Mail, Shield, FileText } from "lucide-react"
// import AdSenseAd from "./adsense-ad"

const MatrixApp = () => {
  const [currentPage, setCurrentPage] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pages = [
    { id: "home", name: "Calculator", icon: Calculator },
    { id: "about", name: "About Us", icon: BookOpen },
    { id: "contact", name: "Contact", icon: Mail },
    { id: "privacy", name: "Privacy Policy", icon: Shield },
    { id: "terms", name: "Terms of Service", icon: FileText },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "about":
        return <AboutPage />
      case "contact":
        return <ContactPage />
      case "privacy":
        return <PrivacyPage />
      case "terms":
        return <TermsPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-bold">Matrix Section</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === page.id ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-500 hover:text-white"}`}
                >
                  <page.icon className="h-4 w-4" />
                  <span>{page.name}</span>
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-blue-100 hover:text-white p-2">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    setCurrentPage(page.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium ${currentPage === page.id ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-600 hover:text-white"}`}
                >
                  <page.icon className="h-5 w-5" />
                  <span>{page.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{renderPage()}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Calculator className="h-6 w-6 mr-2" />
                <span className="text-lg font-semibold">Matrix Section</span>
              </div>
              <p className="text-gray-300 text-sm">
                Tools that help construction practitioners validate structural analyses and design — fast.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Navigation</h3>
              <ul className="space-y-2">
                {pages.map((page) => (
                  <li key={page.id}>
                    <button
                      onClick={() => setCurrentPage(page.id)}
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      {page.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
              <p className="text-gray-300 text-sm">© {new Date().getFullYear()} slab to beam load distribution app</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Home Page - Main Calculator
const HomePage = () => {
  const [inputs, setInputs] = useState({
    lx: "",
    ly: "",
    slabThickness: 150, // mm
    concreteDensity: 24, // kN/m^3
    ceilingLoad: 0.0, // kN/m^2 (POP)
    deadLoad: "",
    liveLoad: "",
  })
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState({})
  const [swapNotification, setSwapNotification] = useState("")

  const validateInputs = (forFull = false) => {
    const newErrors = {}
    if (!inputs.lx || isNaN(inputs.lx) || Number.parseFloat(inputs.lx) <= 0)
      newErrors.lx = "Short span must be a positive number"
    if (!inputs.ly || isNaN(inputs.ly) || Number.parseFloat(inputs.ly) <= 0)
      newErrors.ly = "Long span must be a positive number"
    if (forFull) {
      if (!inputs.slabThickness || isNaN(inputs.slabThickness) || Number.parseFloat(inputs.slabThickness) <= 0)
        newErrors.slabThickness = "Slab thickness must be a positive number"
      if (inputs.liveLoad && (isNaN(inputs.liveLoad) || Number.parseFloat(inputs.liveLoad) < 0))
        newErrors.liveLoad = "Live load must be 0 or positive number"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateOneWay = (lx, ly, totalPressure) => {
    const tributaryWidth = lx / 2
    const tributaryAreaPerBeam = tributaryWidth * ly
    const distributedLoadPerLongBeam = totalPressure * tributaryWidth
    return {
      type: "One-Way",
      beams: [
        {
          name: "Beam (1)",
          tributaryWidth,
          tributaryArea: tributaryAreaPerBeam,
          distributedLoad: distributedLoadPerLongBeam,
        },
        {
          name: "Beam (2)",
          tributaryWidth,
          tributaryArea: tributaryAreaPerBeam,
          distributedLoad: distributedLoadPerLongBeam,
        },
      ],
      explanations: [
        `q = DL + LL`,
        `DL = t(m) × ρ(kN/m³) + ceiling load (POP)`,
        `Tributary width = lx / 2`,
        `Tributary area = (lx/2) × ly`,
        `w = q × (lx/2)`,
      ],
    }
  }

  const calculateTwoWay = (lx, ly, totalPressure) => {
    const shortSideArea = (lx * lx) / 4
    const longSideArea = (lx * ly - 2 * shortSideArea) / 2
    const shortSideLoad = (totalPressure * shortSideArea) / lx
    const longSideLoad = (totalPressure * longSideArea) / ly
    return {
      type: "Two-Way",
      beams: [
        {
          name: "Short-Side (Left)",
          tributaryWidth: lx / 2,
          tributaryArea: shortSideArea,
          distributedLoad: shortSideLoad,
        },
        {
          name: "Short-Side (Right)",
          tributaryWidth: lx / 2,
          tributaryArea: shortSideArea,
          distributedLoad: shortSideLoad,
        },
        {
          name: "Long-Side (Top)",
          tributaryWidth: longSideArea / ly,
          tributaryArea: longSideArea,
          distributedLoad: longSideLoad,
        },
        {
          name: "Long-Side (Bottom)",
          tributaryWidth: longSideArea / ly,
          tributaryArea: longSideArea,
          distributedLoad: longSideLoad,
        },
      ],
      explanations: [
        `q = DL + LL`,
        `A_s (short triangle) = lx² / 4`,
        `A_l (long trapezoid) = (lx×ly - 2×A_s) / 2`,
        `w_s = q × A_s / lx`,
        `w_l = q × A_l / ly`,
      ],
    }
  }

  const computeResults = (requireFull = false) => {
    if (!validateInputs(requireFull)) return null
    const lx = Number.parseFloat(inputs.lx)
    const ly = Number.parseFloat(inputs.ly)
    const original = { lx, ly }
    let used_lx = lx,
      used_ly = ly
    let swapped = false
    if (used_lx > used_ly) {
      ;[used_lx, used_ly] = [used_ly, used_lx]
      swapped = true
      setSwapNotification(
        "Dimensions were swapped internally so used_ly ≥ used_lx for formula consistency. (Original dims shown in results)",
      )
    } else setSwapNotification("")
    const slabType = used_ly / used_lx >= 2 ? "One-Way" : "Two-Way"
    if (!requireFull) {
      return { type: slabType, lx: original.lx, ly: original.ly, internals: { used_lx, used_ly }, swapped }
    }
    const thickness_m = Number.parseFloat(inputs.slabThickness) / 1000
    const concreteDensity = Number.parseFloat(inputs.concreteDensity || 24)
    const ceilingLoad = Number.parseFloat(inputs.ceilingLoad || 0)
    const liveLoad = Number.parseFloat(inputs.liveLoad || 0)
    const computedDL = thickness_m * concreteDensity + ceilingLoad
    let deadLoad = computedDL
    if (inputs.deadLoad && !isNaN(inputs.deadLoad) && Number.parseFloat(inputs.deadLoad) > 0)
      deadLoad = Number.parseFloat(inputs.deadLoad)
    const totalPressure = deadLoad + liveLoad
    const calculations =
      slabType === "One-Way"
        ? calculateOneWay(used_lx, used_ly, totalPressure)
        : calculateTwoWay(used_lx, used_ly, totalPressure)
    return {
      ...calculations,
      lx: original.lx,
      ly: original.ly,
      internals: { used_lx, used_ly },
      totalPressure,
      deadLoadUsed: deadLoad,
      computedDL,
      swapped,
      slabType,
    }
  }

  const handleCheckVisualize = () => {
    const vis = computeResults(false)
    if (vis) setResults(vis)
  }

  const handleFullCalculate = () => {
    const full = computeResults(true)
    if (full) setResults(full)
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tributary Area Calculator</h2>
              <div className="text-sm text-gray-600">Matrix Section</div>
            </div>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Span (lx) - meters</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.lx}
                  onChange={(e) => setInputs({ ...inputs, lx: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="4.0"
                />
                {errors.lx && <p className="text-red-500 text-sm mt-1">{errors.lx}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Long Span (ly) - meters</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.ly}
                  onChange={(e) => setInputs({ ...inputs, ly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="6.0"
                />
                {errors.ly && <p className="text-red-500 text-sm mt-1">{errors.ly}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check Slab Type</label>
                <div className="text-xs text-gray-500 mb-2">
                  Press to detect slab action (ly/lx ≥ 2 → One-Way) and visualize the tributary areas.
                </div>
                <button
                  onClick={handleCheckVisualize}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Check Slab & Visualize
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slab thickness (mm)</label>
                <input
                  type="number"
                  step="1"
                  value={inputs.slabThickness}
                  onChange={(e) => setInputs({ ...inputs, slabThickness: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.slabThickness && <p className="text-red-500 text-sm mt-1">{errors.slabThickness}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Concrete density (kN/m³)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.concreteDensity}
                  onChange={(e) => setInputs({ ...inputs, concreteDensity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ceiling load (POP) (kN/m²)</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.ceilingLoad}
                  onChange={(e) => setInputs({ ...inputs, ceilingLoad: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dead Load override (kN/m²) — optional
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.deadLoad}
                  onChange={(e) => setInputs({ ...inputs, deadLoad: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave empty to compute from thickness"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If left blank, DL = (thickness_m × density) + ceiling load (POP)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live Load (LL) - kN/m²</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.liveLoad}
                  onChange={(e) => setInputs({ ...inputs, liveLoad: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2.0"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleFullCalculate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none"
                >
                  Compute UDL (Load Breakdown)
                </button>
              </div>
            </div>

            {swapNotification && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                {swapNotification}
              </div>
            )}
          </div>

          {/* {results && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center">
                <AdSenseAd adSlot="2345678901" adFormat="rectangle" style={{ display: "block", minHeight: "250px" }} />
              </div>
            </div>
          )} */}

          {results && (
            <>
              {/* Visualization */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Visualization</h3>
                <VisualizationCanvas results={results} />
              </div>

              {/* Results Table */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Results</h3>
                <ResultsTable results={results} />
              </div>

              {/* UDL Verification */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">UDL Breakdown & Verification</h3>
                <StepByStepExplanations results={results} />
              </div>

              {/* Theory Section */}
              <TheorySection />
            </>
          )}
        </div>

        {/* <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Advertisement</h3>
              <AdSenseAd adSlot="3456789012" adFormat="vertical" style={{ display: "block", minHeight: "600px" }} />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
              <AdSenseAd adSlot="4567890123" adFormat="square" style={{ display: "block", minHeight: "300px" }} />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

// Visualization Canvas Component
const VisualizationCanvas = ({ results }) => {
  const canvasRef = useRef(null)
  const [hoveredBeam, setHoveredBeam] = useState(null)
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: "" })

  useEffect(() => {
    if (!results) return
    drawVisualization()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, hoveredBeam])

  const drawVisualization = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const { internals, type } = results
    const lx = internals.used_lx
    const ly = internals.used_ly

    // Canvas dimensions
    const canvasWidth = 600
    const canvasHeight = 400
    const margin = 50

    // Scale to fit canvas
    const scale = Math.min((canvasWidth - 2 * margin) / ly, (canvasHeight - 2 * margin) / lx)

    const slabWidth = ly * scale
    const slabHeight = lx * scale
    const startX = (canvasWidth - slabWidth) / 2
    const startY = (canvasHeight - slabHeight) / 2

    // Clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Outline
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.strokeRect(startX, startY, slabWidth, slabHeight)

    if (type === "One-Way") {
      drawOneWayVisualization(ctx, startX, startY, slabWidth, slabHeight, lx, ly)
    } else {
      drawTwoWayVisualization(ctx, startX, startY, slabWidth, slabHeight, lx, ly)
    }

    drawDimensions(ctx, startX, startY, slabWidth, slabHeight, results.lx, results.ly)
  }

  const drawOneWayVisualization = (ctx, startX, startY, slabWidth, slabHeight, lx, ly) => {
    const longIsLy = ly >= lx

    ctx.strokeStyle = "#6b7280"
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 2

    if (longIsLy) {
      ctx.beginPath()
      ctx.moveTo(startX, startY + slabHeight / 2)
      ctx.lineTo(startX + slabWidth, startY + slabHeight / 2)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
      ctx.fillRect(startX, startY, slabWidth, slabHeight / 2)
      ctx.fillStyle = "rgba(34, 197, 94, 0.3)"
      ctx.fillRect(startX, startY + slabHeight / 2, slabWidth, slabHeight / 2)

      ctx.fillStyle = "#1f2937"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Beam (Top)", startX + slabWidth / 2, startY + 14)
      ctx.fillText("Beam (Bottom)", startX + slabWidth / 2, startY + slabHeight - 6)
    } else {
      ctx.beginPath()
      ctx.moveTo(startX + slabWidth / 2, startY)
      ctx.lineTo(startX + slabWidth / 2, startY + slabHeight)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
      ctx.fillRect(startX, startY, slabWidth / 2, slabHeight)
      ctx.fillStyle = "rgba(34, 197, 94, 0.3)"
      ctx.fillRect(startX + slabWidth / 2, startY, slabWidth / 2, slabHeight)

      ctx.fillStyle = "#1f2937"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Beam (Left)", startX + slabWidth / 4, startY + slabHeight + 18)
      ctx.fillText("Beam (Right)", startX + (3 * slabWidth) / 4, startY + slabHeight + 18)
    }
  }

  const drawTwoWayVisualization = (ctx, startX, startY, slabWidth, slabHeight, lx, ly) => {
    const cx = startX + slabWidth / 2
    const cy = startY + slabHeight / 2

    ctx.strokeStyle = "#6b7280"
    ctx.setLineDash([3, 3])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(cx, cy)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(startX + slabWidth, startY)
    ctx.lineTo(cx, cy)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(startX, startY + slabHeight)
    ctx.lineTo(cx, cy)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(startX + slabWidth, startY + slabHeight)
    ctx.lineTo(cx, cy)
    ctx.stroke()
    ctx.setLineDash([])

    const innerHalf = slabWidth * 0.22

    ctx.beginPath()
    ctx.fillStyle = "rgba(239, 68, 68, 0.3)"
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX, startY + slabHeight)
    ctx.lineTo(cx - innerHalf, cy)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = "rgba(239, 68, 68, 0.3)"
    ctx.moveTo(startX + slabWidth, startY)
    ctx.lineTo(startX + slabWidth, startY + slabHeight)
    ctx.lineTo(cx + innerHalf, cy)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx - innerHalf, cy)
    ctx.lineTo(cx + innerHalf, cy)
    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + slabWidth, startY)
    ctx.lineTo(cx + innerHalf, cy)
    ctx.lineTo(cx - innerHalf, cy)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
    ctx.moveTo(startX, startY + slabHeight)
    ctx.lineTo(startX + slabWidth, startY + slabHeight)
    ctx.lineTo(cx + innerHalf, cy)
    ctx.lineTo(cx - innerHalf, cy)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "#1f2937"
    ctx.font = "13px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Short-Side (Left)", startX + 30, cy)
    ctx.fillText("Short-Side (Right)", startX + slabWidth - 30, cy)
    ctx.fillText("Long-Side (Top)", cx, startY + 14)
    ctx.fillText("Long-Side (Bottom)", cx, startY + slabHeight - 2)
  }

  const drawDimensions = (ctx, startX, startY, slabWidth, slabHeight, lx, ly) => {
    ctx.fillStyle = "#1f2937"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`ly = ${ly} m`, startX + slabWidth / 2, startY - 10)
    ctx.save()
    ctx.translate(startX - 28, startY + slabHeight / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(`lx = ${lx} m`, 0, 0)
    ctx.restore()
  }

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current
    if (!canvas || !results) return

    // If beams are not present (visualization-only), show a simple tooltip with slab type and skip hit testing
    if (!results.beams || results.beams.length === 0) {
      setTooltip({ show: true, x: event.clientX, y: event.clientY, content: `Detected: ${results.type}` })
      return
    }

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const canvasWidth = 600
    const canvasHeight = 400
    const margin = 50
    const scale = Math.min(
      (canvasWidth - 2 * margin) / results.internals.used_ly,
      (canvasHeight - 2 * margin) / results.internals.used_lx,
    )
    const slabWidth = results.internals.used_ly * scale
    const slabHeight = results.internals.used_lx * scale
    const startX = (canvasWidth - slabWidth) / 2
    const startY = (canvasHeight - slabHeight) / 2
    const cx = startX + slabWidth / 2
    const cy = startY + slabHeight / 2
    const innerHalf = slabWidth * 0.22

    let beamIndex = null
    if (results.type === "One-Way") {
      const longIsLy = results.internals.used_ly >= results.internals.used_lx
      if (longIsLy) {
        beamIndex = y < startY + slabHeight / 2 ? 0 : 1 // top/bottom
      } else {
        beamIndex = x < startX + slabWidth / 2 ? 0 : 1 // left/right
      }
    } else {
      if (x < cx - innerHalf) beamIndex = 0
      else if (x > cx + innerHalf) beamIndex = 1
      else beamIndex = y < cy ? 2 : 3
    }

    const beamCount = results.beams ? results.beams.length : 0
    if (beamCount === 0) return
    beamIndex = Math.max(0, Math.min(beamCount - 1, beamIndex))

    const b = results.beams[beamIndex]
    const content = `${b.name}: ${b.tributaryArea ? b.tributaryArea.toFixed(2) : "-"} m², ${b.distributedLoad ? b.distributedLoad.toFixed(2) : "-"} kN/m`

    setHoveredBeam(beamIndex)
    setTooltip({ show: true, x: event.clientX, y: event.clientY, content })
  }

  const handleMouseLeave = () => {
    setHoveredBeam(null)
    setTooltip({ show: false, x: 0, y: 0, content: "" })
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-300 rounded-lg max-w-full h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {tooltip.show && (
        <div
          className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-10"
          style={{ left: tooltip.x - 300, top: tooltip.y - 100 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}

// Results Table Component
const ResultsTable = ({ results }) => {
  return (
    <div className="overflow-x-auto">
      <div className="mb-4 text-sm text-gray-600">
        {results.deadLoadUsed !== undefined && (
          <>
            <strong>Used DL:</strong> {results.deadLoadUsed.toFixed(2)} kN/m² (computed {results.computedDL.toFixed(2)}{" "}
            kN/m² from thickness)
          </>
        )}
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Beam Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tributary Width (m)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tributary Area (m²)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Distributed Load (kN/m)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.beams &&
            results.beams.map((beam, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{beam.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {beam.tributaryWidth ? beam.tributaryWidth.toFixed(2) : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {beam.tributaryArea ? beam.tributaryArea.toFixed(2) : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {beam.distributedLoad ? beam.distributedLoad.toFixed(2) : "-"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

// Step-by-Step Explanations Component
const StepByStepExplanations = ({ results }) => {
  return (
    <div className="space-y-3">
      {results.explanations &&
        results.explanations.map((explanation, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">{index + 1}</span>
            </div>
            <p className="text-sm text-gray-700">{explanation}</p>
          </div>
        ))}
    </div>
  )
}

// Theory Section Component
const TheorySection = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-xl font-semibold text-gray-900">Theory & Background</h3>
        <div className="text-blue-600">{isExpanded ? "−" : "+"}</div>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-4 text-sm text-gray-700">
          {" "}
          <p>
            <strong>Tributary area</strong> is the portion of a slab that contributes load to a specific beam. The app
            auto-detects slab action from the ratio ly/lx (common quick rule).
          </p>
          <h4 className="font-semibold text-gray-900 mb-2">One-Way Slabs:</h4>
          <p>
            When ly/lx ≥ 2, the slab behaves as one-way. Load transfers across the short span (lx) to beams running
            along the long direction. Tributary width = lx/2 and tributary area per beam = (lx/2) × ly. Distributed load
            on beam w = q × (lx/2).
          </p>
          <h4 className="font-semibold text-gray-900 mb-2">Two-Way Slabs (45-Degree Rule):</h4>
          <p>
            When ly/lx &lt; 2, the slab distributes loads to both directions. The simplified 45-degree partition gives
            short-side triangular areas and long-side trapezoids. See formulas in the Step-by-Step section for
            verification.
          </p>
        </div>
      )}
    </div>
  )
}

// About, Contact, Privacy, Terms pages simplified
const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Matrix Section</h1>
        <p>Matrix Section builds practical tools to help engineers validate structural analyses quickly.</p>

        {/* <div className="mt-8 text-center">
          <AdSenseAd adSlot="5678901234" adFormat="horizontal" style={{ display: "block", minHeight: "90px" }} />
        </div> */}
      </div>
    </div>
  )
}

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-gray-600">contact@matrixsection.com</p>

        {/* <div className="mt-8 text-center">
          <AdSenseAd adSlot="6789012345" adFormat="horizontal" style={{ display: "block", minHeight: "90px" }} />
        </div> */}
      </div>
    </div>
  )
}

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 2025</p>
      </div>
    </div>
  )
}

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 2025</p>
      </div>
    </div>
  )
}

export default MatrixApp
