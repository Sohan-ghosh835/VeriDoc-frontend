import { useState } from 'react'
import axios from 'axios'
import UploadZone from '../components/UploadZone'
import SummaryCard from '../components/SummaryCard'
import { BACKEND_URL } from '../config'

const steps = [
  { id: 1, icon: '📄', label: 'Upload Document' },
  { id: 2, icon: '🤖', label: 'AI Summarize' },
  { id: 3, icon: '🌐', label: 'Store on IPFS' },
  { id: 4, icon: '⛓️', label: 'Register On-Chain' },
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

      setActiveStep(2) // AI summarizing
      const res = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setActiveStep(3) // IPFS
      await new Promise((r) => setTimeout(r, 400)) // small delay for UX
      setActiveStep(4) // On-chain ready
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

        {/* Hero Section */}
        <div style={styles.hero} className="fade-in">
          <div style={styles.heroBadge}>
            <span style={styles.badgeDot} />
            Web3 + AI Document Platform
          </div>
          <h1 style={styles.heroTitle}>
            Verify Documents with{' '}
            <span className="gradient-text">AI & Blockchain</span>
          </h1>
          <p style={styles.heroSub}>
            Upload a PDF or text document, get an instant AI summary,
            pin it to IPFS, and create a permanent on-chain record—all in seconds.
          </p>
        </div>

        {/* Step Progress */}
        <div style={styles.stepsRow} className="fade-in-delay-1 steps-row-override">
          {steps.map((step, idx) => {
            const done = activeStep > step.id
            const active = activeStep === step.id
            return (
              <div key={step.id} style={styles.stepItem}>
                <div style={{
                  ...styles.stepCircle,
                  ...(done ? styles.stepDone : active ? styles.stepActive : {}),
                }}>
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <span style={{ fontSize: '0.7rem' }}>{step.id}</span>
                  )}
                </div>
                <div style={styles.stepLabels}>
                  <span style={styles.stepIcon}>{step.icon}</span>
                  <span style={{
                    ...styles.stepLabel,
                    color: done || active ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}>{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div style={{
                    ...styles.stepLine,
                    background: done ? 'var(--pink)' : 'var(--border)',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div style={styles.grid} className="upload-grid-override">
          {/* Left: Upload Panel */}
          <div style={styles.leftCol} className="fade-in-delay-2">
            <div className="card">
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Upload Document</h2>
                {result && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={reset}
                    id="upload-new-btn"
                  >
                    Upload New
                  </button>
                )}
              </div>
              <p style={styles.panelSub}>
                Upload a PDF or text file. Our AI will extract key insights and create a verifiable summary.
              </p>
              <div style={styles.divider} />
              <UploadZone onFileSelect={handleFileSelect} uploading={uploading} />
            </div>

            {/* Info Cards */}
            <div style={styles.infoGrid}>
              {[
                { icon: '🔒', title: 'Tamper-Proof', desc: 'Documents are hashed and stored on Polygon blockchain' },
                { icon: '🤖', title: 'AI-Powered', desc: 'Gemini AI extracts structured insights from your documents' },
                { icon: '🌐', title: 'Decentralized', desc: 'Files stored on IPFS — no single point of failure' },
              ].map((item) => (
                <div key={item.title} style={styles.infoCard} className="card card-hover">
                  <span style={styles.infoIcon}>{item.icon}</span>
                  <div>
                    <p style={styles.infoTitle}>{item.title}</p>
                    <p style={styles.infoDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary / Placeholder */}
          <div style={styles.rightCol} className="fade-in-delay-3">
            {result ? (
              <SummaryCard result={result} wallet={wallet} showToast={showToast} />
            ) : (
              <div style={styles.placeholder} className="card">
                {uploading ? (
                  <div style={styles.loadingState}>
                    <div style={styles.bigSpinner} />
                    <p style={styles.loadingText}>
                      {activeStep === 1 && 'Reading your document...'}
                      {activeStep === 2 && 'Gemini AI is analyzing...'}
                      {activeStep === 3 && 'Pinning to IPFS...'}
                      {activeStep === 4 && 'Almost done!'}
                    </p>
                    <p style={styles.loadingSubtext}>This may take a few seconds</p>
                  </div>
                ) : (
                  <div style={styles.placeholderContent}>
                    <div style={styles.placeholderIcon}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="var(--text-muted)" strokeWidth="1.5"/>
                        <polyline points="14 2 14 8 20 8" stroke="var(--text-muted)" strokeWidth="1.5"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
                        <polyline points="10 9 9 9 8 9" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
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
    paddingTop: '48px',
    paddingBottom: '80px',
    minHeight: 'calc(100vh - 64px)',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '640px',
    margin: '0 auto',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    background: 'var(--pink-light)',
    border: '1px solid var(--pink-border)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--pink)',
    marginBottom: '20px',
    letterSpacing: '0.03em',
  },
  badgeDot: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--pink)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    color: 'var(--text-primary)',
    marginBottom: '16px',
    letterSpacing: '-0.03em',
  },
  heroSub: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.8,
    maxWidth: '520px',
    margin: '0 auto',
  },
  stepsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0',
    padding: '20px 24px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border)',
    flexWrap: 'wrap',
    rowGap: '12px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1 1 auto',
    minWidth: '0',
  },
  stepCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--bg-glass)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    fontWeight: 600,
    flexShrink: 0,
    transition: 'var(--transition)',
  },
  stepActive: {
    background: 'var(--pink-light)',
    border: '1px solid var(--pink)',
    color: 'var(--pink)',
    boxShadow: 'var(--shadow-pink-sm)',
  },
  stepDone: {
    background: 'var(--gradient-pink)',
    border: 'none',
    boxShadow: '0 4px 12px rgba(232, 121, 160, 0.4)',
  },
  stepLabels: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  stepIcon: { fontSize: '0.85rem' },
  stepLabel: {
    fontSize: '0.7rem',
    fontWeight: 500,
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
  },
  stepLine: {
    flex: 1,
    height: '1px',
    minWidth: '20px',
    marginLeft: '10px',
    transition: 'var(--transition)',
  },
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  panelTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  panelSub: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
    margin: '18px 0',
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  infoCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '16px 18px',
  },
  infoIcon: { fontSize: '1.4rem', flexShrink: 0 },
  infoTitle: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    marginBottom: '3px',
  },
  infoDesc: { fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.5 },
  placeholder: {
    minHeight: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
  },
  bigSpinner: {
    width: '48px',
    height: '48px',
    border: '3px solid var(--pink-light)',
    borderTopColor: 'var(--pink)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  loadingSubtext: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
  },
  placeholderContent: {
    textAlign: 'center',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  placeholderIcon: {
    width: '80px',
    height: '80px',
    background: 'var(--bg-glass)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  placeholderTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  placeholderSub: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    maxWidth: '300px',
  },
  exampleTags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '8px',
  },
}

export default UploadPage
