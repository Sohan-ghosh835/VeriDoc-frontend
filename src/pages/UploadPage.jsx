import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import UploadZone from '../components/UploadZone'
import SummaryCard from '../components/SummaryCard'
import { BACKEND_URL } from '../config'

const steps = [
  { id: 1, icon: '01', label: 'UPLOAD DOC' },
  { id: 2, icon: '02', label: 'AI ANALYZE' },
  { id: 3, icon: '03', label: 'IPFS STORE' },
  { id: 4, icon: '04', label: 'ON-CHAIN' },
]

// Scroll reveal hook
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

const UploadPage = ({ wallet, showToast }) => {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const heroRef = useReveal()
  const stepsRef = useReveal()
  const gridRef = useReveal()

  const handleFileSelect = async (file) => {
    setUploading(true)
    setResult(null)
    setActiveStep(1)

    try {
      const formData = new FormData()
      formData.append('document', file)
      if (wallet?.address) {
        formData.append('owner', wallet.address)
      }

      setActiveStep(2)
      const res = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setActiveStep(3)
      await new Promise((r) => setTimeout(r, 400))
      setActiveStep(4)
      setResult(res.data)
      showToast('Document analyzed and pinned to IPFS!', 'success')
    } catch (err) {
      const status = err?.response?.status
      const backendMessage = err?.response?.data?.error
      const cleanedBackendMessage = typeof backendMessage === 'string'
        ? backendMessage.replace(/\uFFFD/g, '').trim()
        : ''

      let msg = cleanedBackendMessage
      if (!msg && status) msg = `Upload failed (${status}).`
      if (!msg && err?.code === 'ERR_NETWORK') msg = 'Cannot reach backend. Start backend on port 5000 and try again.'
      if (!msg && typeof err?.message === 'string') msg = err.message.replace(/\uFFFD/g, '').trim()
      if (!msg) msg = 'Upload failed. Please try again.'

      showToast(msg, 'error')
      setActiveStep(0)
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setActiveStep(0)
  }

  return (
    <div style={styles.page}>
      <div className="container" style={styles.inner}>

        {/* HERO */}
        <div ref={heroRef} className="reveal" style={styles.hero}>
          <div style={styles.heroTextBlock}>
            <div style={styles.heroPretag}>
              <span style={styles.pretag_dot} />
              Web3 + AI Document Platform
            </div>
            <div style={styles.heroLine1} className="display-text">VERI
              <span className="gradient-text">DOC</span>
            </div>
            <div style={styles.heroLine2} className="display-text gradient-text">AI</div>
          </div>

          <div style={styles.heroRight}>
            <p style={styles.heroSub}>
              Upload a PDF or text document, get an instant AI summary,
              pin it to IPFS, and create a permanent on-chain record — all in seconds.
            </p>
            <div style={styles.heroStats}>
              {[
                { num: '13B+', label: 'TXNs' },
                { num: 'AI', label: 'POWERED' },
                { num: 'IPFS', label: 'DECENTRALIZED' },
              ].map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <span style={styles.statNum}>{s.num}</span>
                  <span style={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <div ref={stepsRef} className="reveal steps-row-override" style={styles.stepsRow}>
          {steps.map((step, idx) => {
            const done = activeStep > step.id
            const active = activeStep === step.id
            return (
              <div key={step.id} style={styles.stepItem}>
                <div style={{
                  ...styles.stepNum,
                  ...(done ? styles.stepNumDone : active ? styles.stepNumActive : {}),
                }}>
                  {done ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  ) : step.icon}
                </div>
                <span style={{
                  ...styles.stepLabel,
                  color: done || active ? 'var(--text)' : 'var(--text-3)',
                }}>{step.label}</span>
                {idx < steps.length - 1 && (
                  <div style={{
                    ...styles.stepLine,
                    background: done
                      ? 'linear-gradient(90deg, #FFB6C1, #FF8DA1)'
                      : 'rgba(255,255,255,0.08)',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Main Grid */}
        <div ref={gridRef} className="reveal upload-grid-override" style={styles.grid}>

          {/* LEFT */}
          <div style={styles.leftCol}>
            <div style={styles.glassCard}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelChip}>UPLOAD</div>
                  <h2 style={styles.panelTitle}>Upload Document</h2>
                </div>
                {result && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={reset}
                    id="upload-new-btn"
                  >
                    New Upload
                  </button>
                )}
              </div>
              <p style={styles.panelSub}>
                Upload a PDF or text file. Our AI will extract key insights and create a verifiable summary.
              </p>
              <div style={styles.divider} />
              <UploadZone onFileSelect={handleFileSelect} uploading={uploading} />
            </div>

            {/* Feature bento cards */}
            <div style={styles.featureGrid}>
              {[
                {
                  num: '01',
                  title: 'TAMPER-PROOF',
                  desc: 'Documents hashed and stored on Polygon blockchain',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  num: '02',
                  title: 'AI-POWERED',
                  desc: 'Gemini AI extracts structured insights from your documents',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  num: '03',
                  title: 'DECENTRALIZED',
                  desc: 'Files stored on IPFS — no single point of failure',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="2" y1="8.5" x2="22" y2="8.5" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="2" y1="15.5" x2="22" y2="15.5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} style={styles.featureCard} className="card-hover">
                  <div style={styles.featureIconWrap}>{item.icon}</div>
                  <div>
                    <p style={styles.featureTitle}>{item.title}</p>
                    <p style={styles.featureDesc}>{item.desc}</p>
                  </div>
                  <div style={styles.featureNum}>{item.num}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={styles.rightCol}>
            {result ? (
              <SummaryCard result={result} wallet={wallet} showToast={showToast} />
            ) : (
              <div style={styles.placeholder}>
                {uploading ? (
                  <div style={styles.loadingState}>
                    <div style={styles.loadingOrbit}>
                      <div style={styles.orbitRing} />
                      <div style={styles.bigSpinner} />
                      <div style={styles.innerGlow} />
                    </div>
                    <p style={styles.loadingText}>
                      {activeStep === 1 && 'READING DOCUMENT...'}
                      {activeStep === 2 && 'GEMINI AI ANALYZING...'}
                      {activeStep === 3 && 'PINNING TO IPFS...'}
                      {activeStep === 4 && 'ALMOST DONE!'}
                    </p>
                    <p style={styles.loadingSubtext}>This may take a few seconds</p>
                  </div>
                ) : (
                  <div style={styles.placeholderContent}>
                    <div style={styles.placeholderIcon}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="rgba(255,182,193,0.4)" strokeWidth="1.5"/>
                        <polyline points="14 2 14 8 20 8" stroke="rgba(255,182,193,0.4)" strokeWidth="1.5"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="rgba(255,182,193,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="rgba(255,182,193,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                        <polyline points="10 9 9 9 8 9" stroke="rgba(255,182,193,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div style={styles.placeholderBigText} className="display-text">
                      AWAIT<span className="gradient-text">ING</span>
                    </div>
                    <p style={styles.placeholderTitle}>Your AI Summary will appear here</p>
                    <p style={styles.placeholderSub}>
                      Upload a document on the left to get started. Analysis results, IPFS hash, and blockchain storage will show here.
                    </p>
                    <div style={styles.exampleTags}>
                      <span className="tag tag-grey">Degrees & Certificates</span>
                      <span className="tag tag-grey">Resumes</span>
                      <span className="tag tag-grey">Legal Docs</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const glassBase = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,182,193,0.12)',
  borderRadius: '16px',
}

const styles = {
  page: {
    paddingTop: '56px',
    paddingBottom: '120px',
    minHeight: 'calc(100vh - 90px)',
    position: 'relative',
    zIndex: 1,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  // Hero
  hero: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '56px',
    padding: '56px 0 40px',
    borderBottom: '1px solid rgba(255,182,193,0.1)',
    flexWrap: 'wrap',
  },
  heroTextBlock: {
    lineHeight: 0.85,
  },
  heroPretag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 14px',
    background: 'rgba(255,182,193,0.06)',
    border: '1px solid rgba(255,182,193,0.15)',
    borderRadius: '100px',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'rgba(255,182,193,0.8)',
    marginBottom: '20px',
    fontFamily: "var(--font-body)",
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  pretag_dot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFB6C1, #FF8DA1)',
    boxShadow: '0 0 6px rgba(255,182,193,0.6)',
    animation: 'pulse-pink 2s ease-in-out infinite',
  },
  heroLine1: {
    fontSize: 'clamp(64px, 9vw, 112px)',
    color: 'var(--text)',
    fontWeight: 900,
  },
  heroLine2: {
    fontSize: 'clamp(64px, 9vw, 112px)',
    fontWeight: 900,
  },
  heroRight: {
    flex: 1,
    minWidth: '280px',
    paddingTop: '36px',
  },
  heroSub: {
    fontSize: '1rem',
    color: 'var(--text-2)',
    lineHeight: 1.8,
    marginBottom: '32px',
    fontFamily: "var(--font-body)",
    maxWidth: '420px',
  },
  heroStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '14px 20px',
    background: 'rgba(255,182,193,0.04)',
    border: '1px solid rgba(255,182,193,0.12)',
    borderRadius: '12px',
    gap: '4px',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  statNum: {
    fontFamily: "var(--font-body)",
    fontWeight: 800,
    fontSize: '1.1rem',
    color: 'var(--pink)',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '0.6rem',
    fontWeight: 700,
    color: 'var(--text-3)',
    letterSpacing: '0.1em',
    fontFamily: "var(--font-body)",
  },
  // Steps
  stepsRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px 28px',
    background: 'rgba(255,182,193,0.03)',
    border: '1px solid rgba(255,182,193,0.1)',
    borderRadius: '14px',
    gap: '0',
    flexWrap: 'wrap',
    rowGap: '14px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1 1 auto',
    minWidth: '0',
  },
  stepNum: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-3)',
    fontSize: '0.62rem',
    fontWeight: 800,
    flexShrink: 0,
    fontFamily: "var(--font-body)",
    letterSpacing: '0.05em',
    transition: 'all 0.35s ease',
  },
  stepNumActive: {
    background: 'var(--pink-light)',
    border: '1px solid var(--border-a)',
    color: 'var(--pink)',
    boxShadow: 'var(--shadow-glow)',
  },
  stepNumDone: {
    background: 'linear-gradient(135deg, #FFB6C1, #FF8DA1)',
    border: '1px solid transparent',
    color: '#fff',
    boxShadow: '0 0 16px rgba(255,182,193,0.4)',
  },
  stepLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    fontFamily: "var(--font-body)",
    transition: 'color 0.3s ease',
    whiteSpace: 'nowrap',
  },
  stepLine: {
    flex: 1,
    height: '1px',
    minWidth: '20px',
    marginLeft: '10px',
    transition: 'background 0.5s ease',
    borderRadius: '1px',
  },
  // Main Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rightCol: {},
  glassCard: {
    ...glassBase,
    padding: '28px',
    boxShadow: '0 0 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '6px',
    gap: '12px',
  },
  panelChip: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #FFB6C1, #FF8DA1)',
    color: '#fff',
    fontSize: '0.58rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    padding: '3px 10px',
    borderRadius: '6px',
    marginBottom: '8px',
    fontFamily: "var(--font-body)",
    boxShadow: '0 0 10px rgba(255,182,193,0.3)',
  },
  panelTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    fontFamily: "var(--font-body)",
  },
  panelSub: {
    fontSize: '0.82rem',
    color: 'var(--text-2)',
    lineHeight: 1.6,
    fontFamily: "var(--font-body)",
  },
  divider: {
    height: '1px',
    background: 'rgba(255,182,193,0.1)',
    margin: '18px 0',
  },
  // Feature Cards
  featureGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  featureCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '16px 18px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,182,193,0.08)',
    borderRadius: '12px',
    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    cursor: 'default',
    position: 'relative',
  },
  featureIconWrap: {
    width: '36px',
    height: '36px',
    background: 'rgba(255,182,193,0.08)',
    border: '1px solid rgba(255,182,193,0.15)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--pink)',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },
  featureTitle: {
    fontWeight: 700,
    fontSize: '0.8rem',
    color: 'var(--text)',
    letterSpacing: '0.04em',
    fontFamily: "var(--font-body)",
    marginBottom: '4px',
  },
  featureDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-2)',
    lineHeight: 1.5,
    fontFamily: "var(--font-body)",
  },
  featureNum: {
    position: 'absolute',
    top: '14px',
    right: '16px',
    fontFamily: "var(--font-body)",
    fontWeight: 800,
    fontSize: '1.2rem',
    color: 'var(--text-3)',
    lineHeight: 1,
    userSelect: 'none',
    opacity: 0.1,
  },
  // Placeholder / Loading
  placeholder: {
    minHeight: '460px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.02)',
    border: '1px dashed rgba(255,182,193,0.15)',
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
  },
  loadingOrbit: {
    position: 'relative',
    width: '88px',
    height: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRing: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '1px solid rgba(255,182,193,0.15)',
    animation: 'spin 3s linear infinite',
  },
  bigSpinner: {
    width: '52px',
    height: '52px',
    border: '2px solid rgba(255,182,193,0.1)',
    borderTopColor: '#FFB6C1',
    borderRightColor: '#FF8DA1',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  innerGlow: {
    position: 'absolute',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,182,193,0.3) 0%, transparent 70%)',
    animation: 'pulse-pink 2s ease-in-out infinite',
  },
  loadingText: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--pink)',
    letterSpacing: '0.1em',
    fontFamily: "var(--font-body)",
  },
  loadingSubtext: {
    fontSize: '0.75rem',
    color: 'var(--text-3)',
    fontFamily: "var(--font-body)",
  },
  placeholderContent: {
    textAlign: 'center',
    padding: '40px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  placeholderIcon: {
    width: '72px',
    height: '72px',
    background: 'rgba(255,182,193,0.04)',
    border: '1px solid rgba(255,182,193,0.12)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  placeholderBigText: {
    fontSize: 'clamp(40px, 6vw, 72px)',
    color: 'var(--text-3)',
    opacity: 0.1,
    fontWeight: 900,
    lineHeight: 0.85,
    userSelect: 'none',
  },
  placeholderTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--text)',
    fontFamily: "var(--font-body)",
  },
  placeholderSub: {
    fontSize: '0.8rem',
    color: 'var(--text-2)',
    lineHeight: 1.7,
    maxWidth: '300px',
    fontFamily: "var(--font-body)",
  },
  exampleTags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '4px',
  },
}

export default UploadPage
