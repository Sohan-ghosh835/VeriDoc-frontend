import { useState, useEffect } from 'react'
import VerifyPanel from '../components/VerifyPanel'
import { BACKEND_URL } from '../config'
import axios from 'axios'

const DashboardPage = ({ wallet, showToast }) => {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)

  const fetchDocs = async () => {
    if (!wallet) return
    setLoading(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/docs/${wallet.address}`)
      setDocs(res.data.docs || [])
    } catch {
      setDocs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [wallet])

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={styles.page}>
      <div className="container" style={styles.inner}>

        {/* Page Header — Avalanche style */}
        <div style={styles.header} className="fade-in">
          <div style={styles.headerLeft}>
            <div style={styles.headerNum} className="display-text">02</div>
            <div>
              <div style={styles.headerChip}>DASHBOARD</div>
              <h1 style={styles.headerTitle}>YOUR DOCUMENTS</h1>
              <p style={styles.headerSub}>
                View your document history and verify any IPFS hash on-chain.
              </p>
            </div>
          </div>
          {wallet && (
            <div style={styles.walletInfo}>
              <div style={styles.walletDot} />
              <div>
                <p style={styles.walletLabel}>CONNECTED WALLET</p>
                <code style={styles.walletAddr}>{wallet.address.slice(0, 14)}…{wallet.address.slice(-6)}</code>
              </div>
            </div>
          )}
        </div>

        {/* Main grid */}
        <div style={styles.grid} className="dashboard-grid-override fade-in-delay-1">

          {/* LEFT: Document list */}
          <div style={styles.leftCol}>
            <div className="card" style={{ border: '2px solid #0a0a0a', boxShadow: '4px 4px 0px #0a0a0a' }}>
              <div style={styles.listHeader}>
                <div>
                  <div style={styles.listChip}>HISTORY</div>
                  <h2 style={styles.listTitle}>DOCUMENT REGISTRY</h2>
                </div>
                {wallet && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={fetchDocs}
                    disabled={loading}
                    style={{ borderRadius: '4px' }}
                  >
                    {loading ? <span className="spinner" style={{ borderTopColor: '#0a0a0a' }} /> : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                    Refresh
                  </button>
                )}
              </div>

              <div style={styles.divider} />

              {!wallet ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="7" width="20" height="14" rx="2" stroke="#ccc" strokeWidth="1.5"/>
                      <path d="M16 14a1 1 0 110-2 1 1 0 010 2z" fill="#ccc"/>
                      <path d="M2 10h20" stroke="#ccc" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <p style={styles.emptyTitle}>NO WALLET CONNECTED</p>
                  <p style={styles.emptySub}>Connect your wallet to view your document history.</p>
                </div>
              ) : loading ? (
                <div style={styles.emptyState}>
                  <div style={styles.miniSpinner} />
                  <p style={styles.emptySub}>Loading documents…</p>
                </div>
              ) : docs.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyBigText} className="display-text">
                    ZER<span style={{ color: '#e84142' }}>O</span>
                  </div>
                  <p style={styles.emptyTitle}>NO DOCUMENTS YET</p>
                  <p style={styles.emptySub}>Upload and store documents on-chain to see them here.</p>
                </div>
              ) : (
                <div style={styles.docList}>
                  {docs.map((doc, i) => (
                    <div key={i} style={styles.docCard}>
                      <div style={styles.docIndex}>{String(i + 1).padStart(2, '0')}</div>
                      <div style={styles.docBody}>
                        <div style={styles.docTop}>
                          <code style={styles.docHash}>
                            {doc.ipfsHash?.slice(0, 24)}…
                          </code>
                          <div style={styles.docActions}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => copyText(doc.ipfsHash, `hash-${i}`)}
                              title="Copy hash"
                              style={{ borderRadius: '4px' }}
                            >
                              {copied === `hash-${i}` ? (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                  <polyline points="20 6 9 17 4 12" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                              ) : (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                              )}
                            </button>
                            {doc.ipfsUrl && (
                              <a
                                href={doc.ipfsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-secondary btn-sm"
                                title="View on IPFS"
                                style={{ borderRadius: '4px' }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2"/>
                                  <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                        {doc.summary && (
                          <p style={styles.docSummary}>
                            {doc.summary.slice(0, 100)}{doc.summary.length > 100 ? '…' : ''}
                          </p>
                        )}
                        <div style={styles.docMeta}>
                          {doc.timestamp && (
                            <span style={styles.metaItem}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#999" strokeWidth="2"/>
                                <polyline points="12 6 12 12 16 14" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                              {new Date(doc.timestamp).toLocaleDateString()}
                            </span>
                          )}
                          {doc.stored && (
                            <span className="tag tag-success" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                              ON-CHAIN
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Verify panel */}
          <div style={styles.rightCol} className="fade-in-delay-2">
            <VerifyPanel wallet={wallet} showToast={showToast} />

            {/* Info box */}
            <div style={styles.infoBox}>
              <div style={styles.infoBoxHeader}>HOW VERIFICATION WORKS</div>
              <div style={styles.infoSteps}>
                {[
                  { n: '1', text: 'Upload document and store hash on blockchain' },
                  { n: '2', text: 'Copy the IPFS CID from the summary card' },
                  { n: '3', text: 'Paste it above to verify on-chain registration' },
                  { n: '4', text: 'See owner address and timestamp on-chain' },
                ].map(step => (
                  <div key={step.n} style={styles.infoStep}>
                    <div style={styles.infoStepNum}>{step.n}</div>
                    <p style={styles.infoStepText}>{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
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
  // Header
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: '32px',
    borderBottom: '2px solid #0a0a0a',
    gap: '24px',
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '20px',
  },
  headerNum: {
    fontSize: 'clamp(60px, 8vw, 100px)',
    color: '#f0f0f0',
    fontWeight: 400,
    lineHeight: 0.85,
  },
  headerChip: {
    display: 'inline-block',
    background: '#e84142',
    color: '#fff',
    fontSize: '0.62rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    padding: '3px 10px',
    borderRadius: '3px',
    marginBottom: '8px',
    fontFamily: "'DM Sans', sans-serif",
  },
  headerTitle: {
    fontSize: 'clamp(1.4rem, 4vw, 2rem)',
    fontWeight: 800,
    color: '#0a0a0a',
    letterSpacing: '-0.03em',
    fontFamily: "'DM Sans', sans-serif",
  },
  headerSub: {
    fontSize: '0.88rem',
    color: '#777',
    lineHeight: 1.6,
    marginTop: '6px',
    fontFamily: "'DM Sans', sans-serif",
  },
  walletInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    border: '2px solid #0a0a0a',
    borderRadius: '8px',
    background: '#fafafa',
  },
  walletDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#16a34a',
    flexShrink: 0,
    animation: 'pulse 2s ease-in-out infinite',
  },
  walletLabel: {
    fontSize: '0.6rem',
    fontWeight: 800,
    color: '#999',
    letterSpacing: '0.12em',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: '4px',
  },
  walletAddr: {
    fontSize: '0.8rem',
    color: '#0a0a0a',
    fontFamily: "'DM Mono', monospace",
  },
  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  listHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
  },
  listChip: {
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
  listTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#0a0a0a',
    letterSpacing: '-0.02em',
    fontFamily: "'DM Sans', sans-serif",
  },
  divider: { height: '1px', background: '#e5e5e5', margin: '18px 0' },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '48px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    background: '#f5f5f5',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBigText: {
    fontSize: '64px',
    color: '#f0f0f0',
    fontWeight: 400,
    lineHeight: 0.85,
  },
  emptyTitle: {
    fontSize: '0.82rem',
    fontWeight: 800,
    color: '#0a0a0a',
    letterSpacing: '0.06em',
    fontFamily: "'DM Sans', sans-serif",
  },
  emptySub: {
    fontSize: '0.8rem',
    color: '#999',
    lineHeight: 1.6,
    fontFamily: "'DM Sans', sans-serif",
    maxWidth: '260px',
  },
  miniSpinner: {
    width: '28px',
    height: '28px',
    border: '2.5px solid #f0f0f0',
    borderTopColor: '#e84142',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  docList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  docCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '14px 16px',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    background: '#fafafa',
    transition: 'all 0.15s ease',
    cursor: 'default',
  },
  docIndex: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 800,
    fontSize: '1.2rem',
    color: '#e5e5e5',
    flexShrink: 0,
    lineHeight: 1,
    marginTop: '2px',
  },
  docBody: { flex: 1, minWidth: 0 },
  docTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    flexWrap: 'wrap',
  },
  docHash: {
    fontSize: '0.75rem',
    color: '#e84142',
    fontFamily: "'DM Mono', monospace",
    background: 'rgba(232,65,66,0.06)',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  docActions: {
    display: 'flex',
    gap: '6px',
    flexShrink: 0,
  },
  docSummary: {
    fontSize: '0.78rem',
    color: '#666',
    lineHeight: 1.5,
    marginTop: '8px',
    fontFamily: "'DM Sans', sans-serif",
  },
  docMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.72rem',
    color: '#999',
    fontFamily: "'DM Sans', sans-serif",
  },
  infoBox: {
    border: '2px solid #0a0a0a',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  infoBoxHeader: {
    background: '#0a0a0a',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '0.68rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    fontFamily: "'DM Sans', sans-serif",
  },
  infoSteps: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  infoStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  infoStepNum: {
    width: '24px',
    height: '24px',
    background: '#e84142',
    color: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 800,
    flexShrink: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  infoStepText: {
    fontSize: '0.82rem',
    color: '#555',
    lineHeight: 1.5,
    fontFamily: "'DM Sans', sans-serif",
    paddingTop: '3px',
  },
}

export default DashboardPage
