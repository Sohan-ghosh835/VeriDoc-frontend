import { useState } from 'react'
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

const UploadPage = ({ wallet, showToast }) => {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeStep, setActiveStep] = useState(0)

  const handleFileSelect = async (file) => {
    setUploading(true)
    setResult(null)
    setActiveStep(1)

    try {
      const formData = new FormData()
      formData.append('document', file)

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
      const msg = err?.response?.data?.error || err.message || 'Upload failed'
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

        {/* HERO — Avalanche style: massive display text */}
        <div style={styles.hero} className="fade-in">
          {/* Big display text */}
          <div style={styles.heroTextBlock}>
            <div style={styles.heroLine1} className="display-text">VERIDOC</div>
            <div style={styles.heroLine2} className="display-text">
              <span style={{ color: '#e84142' }}>AI</span>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.heroBadge}>
              <span style={styles.badgeDot} />
              Web3 + AI Document Platform
            </div>
            <p style={styles.heroSub}>
              Upload a PDF or text document, get an instant AI summary,
              pin it to IPFS, and create a permanent on-chain record — all in seconds.
            </p>
            <div style={styles.heroStats}>
              <div style={styles.statItem}>
                <span style={styles.statNum}>13B+</span>
                <span style={styles.statLabel}>TXNS</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statNum}>AI</span>
                <span style={styles.statLabel}>POWERED</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statNum}>IPFS</span>
                <span style={styles.statLabel}>DECENTRALIZED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Progress — Avalanche numbered style */}
        <div style={styles.stepsRow} className="fade-in-delay-1 steps-row-override">
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  ) : step.icon}
                </div>
                <span style={{
                  ...styles.stepLabel,
                  color: done || active ? '#0a0a0a' : '#bbb',
                }}>{step.label}</span>
                {idx < steps.length - 1 && (
                  <div style={{ ...styles.stepLine, background: done ? '#e84142' : '#e5e5e5' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Main grid */}
        <div style={styles.grid} className="upload-grid-override">

          {/* LEFT */}
          <div style={styles.leftCol} className="fade-in-delay-2">
            <div className="card" style={{ border: '2px solid #0a0a0a', boxShadow: '4px 4px 0px #0a0a0a' }}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelChip}>UPLOAD</div>
                  <h2 style={styles.panelTitle}>UPLOAD DOCUMENT</h2>
                </div>
                {result && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={reset}
                    id="upload-new-btn"
                    style={{ borderRadius: '4px' }}
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

            {/* Feature cards */}
            <div style={styles.featureGrid}>
              {[
                { num: '01', title: 'TAMPER-PROOF', desc: 'Documents hashed and stored on Polygon blockchain' },
                { num: '02', title: 'AI-POWERED', desc: 'Gemini AI extracts structured insights from your documents' },
                { num: '03', title: 'DECENTRALIZED', desc: 'Files stored on IPFS — no single point of failure' },
              ].map((item) => (
                <div key={item.title} style={styles.featureCard} className="card card-hover">
                  <div style={styles.featureNum}>{item.num}</div>
                  <div>
                    <p style={styles.featureTitle}>{item.title}</p>
                    <p style={styles.featureDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={styles.rightCol} className="fade-in-delay-3">
            {result ? (
              <SummaryCard result={result} wallet={wallet} showToast={showToast} />
            ) : (
              <div style={styles.placeholder} className="card">
                {uploading ? (
                  <div style={styles.loadingState}>
                    <div style={styles.loadingRing}>
                      <div style={styles.bigSpinner} />
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
                    <div style={styles.placeholderBigText} className="display-text">
                      AWAIT<span style={{ color: '#e84142' }}>ING</span>
                    </div>
                    <p style={styles.placeholderTitle}>Your AI Summary will appear here</p>
                    <p style={styles.placeholderSub}>
                      Upload a document on the left to get started. The analysis results, IPFS hash, and blockchain storage option will show up here.
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

const styles = {
  page: {
    paddingTop: '56px',
    paddingBottom: '100px',
    minHeight: 'calc(100vh - 92px)',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  // Hero
  hero: {
    display: 'flex',
    alignItems: 'center',
    gap: '48px',
    padding: '40px 0 16px',
    borderBottom: '2px solid #0a0a0a',
    flexWrap: 'wrap',
  },
  heroTextBlock: {
    lineHeight: 0.85,
  },
  heroLine1: {
    fontSize: 'clamp(72px, 10vw, 120px)',
    color: '#0a0a0a',
    fontWeight: 400,
  },
  heroLine2: {
    fontSize: 'clamp(72px, 10vw, 120px)',
    fontWeight: 400,
  },
  heroRight: {
    flex: 1,
    minWidth: '280px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 14px',
    background: '#f5f5f5',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#555',
    marginBottom: '16px',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.02em',
  },
  badgeDot: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#e84142',
  },
  heroSub: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: 1.7,
    marginBottom: '24px',
    fontFamily: "'DM Sans', sans-serif",
  },
  heroStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  statNum: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 800,
    fontSize: '1.1rem',
    color: '#0a0a0a',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '0.62rem',
    fontWeight: 700,
    color: '#999',
    letterSpacing: '0.1em',
    fontFamily: "'DM Sans', sans-serif",
  },
  statDivider: {
    width: '1px',
    height: '32px',
    background: '#e5e5e5',
  },
  // Steps
  stepsRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px 28px',
    background: '#fafafa',
    border: '2px solid #0a0a0a',
    borderRadius: '10px',
    gap: '0',
    flexWrap: 'wrap',
    rowGap: '14px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1 1 auto',
    minWidth: '0',
  },
  stepNum: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    background: '#fff',
    border: '2px solid #e5e5e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ccc',
    fontSize: '0.65rem',
    fontWeight: 800,
    flexShrink: 0,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.05em',
    transition: 'all 0.18s ease',
  },
  stepNumActive: {
    background: '#fef2f2',
    border: '2px solid #e84142',
    color: '#e84142',
  },
  stepNumDone: {
    background: '#e84142',
    border: '2px solid #e84142',
    color: '#fff',
  },
  stepLabel: {
    fontSize: '0.68rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'color 0.18s ease',
    whiteSpace: 'nowrap',
  },
  stepLine: {
    flex: 1,
    height: '2px',
    minWidth: '20px',
    marginLeft: '10px',
    transition: 'background 0.3s ease',
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
  panelHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '6px',
    gap: '12px',
  },
  panelChip: {
    display: 'inline-block',
    background: '#0a0a0a',
    color: '#fff',
    fontSize: '0.62rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    padding: '3px 8px',
    borderRadius: '3px',
    marginBottom: '6px',
    fontFamily: "'DM Sans', sans-serif",
  },
  panelTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#0a0a0a',
    letterSpacing: '-0.02em',
    fontFamily: "'DM Sans', sans-serif",
  },
  panelSub: {
    fontSize: '0.82rem',
    color: '#777',
    lineHeight: 1.6,
    fontFamily: "'DM Sans', sans-serif",
  },
  divider: { height: '1px', background: '#e5e5e5', margin: '18px 0' },
  featureGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  featureCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px 18px',
  },
  featureNum: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 800,
    fontSize: '1.4rem',
    color: '#e84142',
    flexShrink: 0,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    marginTop: '2px',
  },
  featureTitle: {
    fontWeight: 800,
    fontSize: '0.82rem',
    color: '#0a0a0a',
    letterSpacing: '0.04em',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: '4px',
  },
  featureDesc: { fontSize: '0.78rem', color: '#777', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" },
  // Placeholder
  placeholder: {
    minHeight: '460px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #ccc',
    background: '#fafafa',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
  },
  loadingRing: {
    width: '72px',
    height: '72px',
    background: '#fff',
    border: '2px solid #e5e5e5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigSpinner: {
    width: '44px',
    height: '44px',
    border: '3px solid #f5f5f5',
    borderTopColor: '#e84142',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  loadingText: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#0a0a0a',
    letterSpacing: '0.05em',
    fontFamily: "'DM Sans', sans-serif",
  },
  loadingSubtext: {
    fontSize: '0.8rem',
    color: '#999',
    fontFamily: "'DM Sans', sans-serif",
  },
  placeholderContent: {
    textAlign: 'center',
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
  },
  placeholderBigText: {
    fontSize: 'clamp(48px, 7vw, 80px)',
    color: '#e5e5e5',
    fontWeight: 400,
    lineHeight: 0.85,
    userSelect: 'none',
  },
  placeholderTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#0a0a0a',
    fontFamily: "'DM Sans', sans-serif",
  },
  placeholderSub: {
    fontSize: '0.82rem',
    color: '#999',
    lineHeight: 1.7,
    maxWidth: '300px',
    fontFamily: "'DM Sans', sans-serif",
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
