import { useState } from 'react'
import { ethers } from 'ethers'
import { VERIDOC_ABI, CONTRACT_ADDRESS } from '../config'

const VerifyPanel = ({ wallet, showToast }) => {
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const lookup = async () => {
    if (!hash.trim()) {
      showToast('Please enter an IPFS hash to verify.', 'error')
      return
    }
    if (!wallet) {
      showToast('Connect your wallet to verify on-chain.', 'error')
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VERIDOC_ABI, wallet.provider)
      const [exists, owner, timestamp] = await contract.verifyDoc(hash.trim())
      setResult({
        exists,
        owner,
        timestamp: exists ? new Date(Number(timestamp) * 1000).toLocaleString() : null,
        hash: hash.trim(),
      })
    } catch (err) {
      showToast(`Verification failed: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') lookup()
  }

  return (
    <div style={styles.panel} className="card">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.chip}>ON-CHAIN VERIFY</div>
          <h2 style={styles.title}>VERIFY DOCUMENT</h2>
          <p style={styles.sub}>
            Enter an IPFS hash to check if a document is registered on the blockchain.
          </p>
        </div>
      </div>

      <div style={styles.divider} />

      {/* Search Row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Qm... or bafybe..."
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          onKeyDown={handleKey}
          style={{ ...styles.input, fontFamily: "'DM Mono', monospace", fontSize: '0.82rem' }}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          id="lookup-btn"
          onClick={lookup}
          disabled={loading || !hash.trim()}
          style={{ borderRadius: '6px', flexShrink: 0, minWidth: '110px' }}
        >
          {loading ? (
            <><span className="spinner" /> Checking</>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              VERIFY
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{ marginTop: '24px' }} className="fade-in">
          {result.exists ? (
            <div style={styles.resultFound}>
              <div style={styles.resultHeader}>
                <div style={styles.resultIconGreen}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p style={styles.resultStatus}>VERIFIED ON-CHAIN</p>
                  <p style={styles.resultSub}>Document found in blockchain registry</p>
                </div>
              </div>

              <div style={styles.resultGrid}>
                <div style={styles.resultField}>
                  <p style={styles.fieldKey}>IPFS HASH</p>
                  <code style={styles.fieldVal}>{result.hash.slice(0, 28)}…</code>
                </div>
                <div style={styles.resultField}>
                  <p style={styles.fieldKey}>REGISTERED BY</p>
                  <code style={styles.fieldVal}>{result.owner.slice(0, 10)}…{result.owner.slice(-6)}</code>
                </div>
                <div style={styles.resultField}>
                  <p style={styles.fieldKey}>TIMESTAMP</p>
                  <p style={{ ...styles.fieldVal, fontFamily: "'DM Sans', sans-serif" }}>{result.timestamp}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.resultNotFound}>
              <div style={styles.resultHeader}>
                <div style={styles.resultIconRed}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="#e84142" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="#e84142" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p style={{ ...styles.resultStatus, color: '#e84142' }}>NOT FOUND</p>
                  <p style={styles.resultSub}>This hash is not registered on the blockchain</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help */}
      {!result && !loading && (
        <div style={styles.helpBox}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" stroke="#999" strokeWidth="1.5"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={styles.helpText}>
            You can find the IPFS hash in the summary card after uploading a document. Paste it above to verify its blockchain registration.
          </p>
        </div>
      )}
    </div>
  )
}

const styles = {
  panel: {
    border: '2px solid #0a0a0a',
    boxShadow: '4px 4px 0px #0a0a0a',
  },
  header: {
    marginBottom: '4px',
  },
  chip: {
    display: 'inline-block',
    background: '#0a0a0a',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    padding: '3px 10px',
    borderRadius: '3px',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: '10px',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#0a0a0a',
    letterSpacing: '-0.03em',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: '6px',
  },
  sub: {
    fontSize: '0.85rem',
    color: '#777',
    lineHeight: 1.6,
    fontFamily: "'DM Sans', sans-serif",
  },
  divider: {
    height: '1px',
    background: '#e5e5e5',
    margin: '20px 0',
  },
  input: {
    flex: 1,
    padding: '13px 16px',
    background: '#fff',
    border: '2px solid #e5e5e5',
    borderRadius: '6px',
    color: '#0a0a0a',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  resultFound: {
    border: '2px solid #16a34a',
    borderRadius: '10px',
    padding: '20px',
    background: '#f0fdf4',
    boxShadow: '3px 3px 0px #16a34a',
  },
  resultNotFound: {
    border: '2px solid #e84142',
    borderRadius: '10px',
    padding: '20px',
    background: '#fef2f2',
    boxShadow: '3px 3px 0px #e84142',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '18px',
  },
  resultIconGreen: {
    width: '44px',
    height: '44px',
    background: '#dcfce7',
    border: '2px solid #16a34a',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultIconRed: {
    width: '44px',
    height: '44px',
    background: '#fee2e2',
    border: '2px solid #e84142',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultStatus: {
    fontWeight: 800,
    color: '#15803d',
    fontSize: '0.85rem',
    letterSpacing: '0.06em',
    fontFamily: "'DM Sans', sans-serif",
  },
  resultSub: {
    fontSize: '0.78rem',
    color: '#777',
    marginTop: '2px',
    fontFamily: "'DM Sans', sans-serif",
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  resultField: {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    padding: '12px 14px',
  },
  fieldKey: {
    fontSize: '0.62rem',
    fontWeight: 800,
    color: '#999',
    letterSpacing: '0.1em',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: '6px',
  },
  fieldVal: {
    fontSize: '0.78rem',
    color: '#0a0a0a',
    fontFamily: "'DM Mono', monospace",
    wordBreak: 'break-all',
  },
  helpBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginTop: '20px',
    padding: '14px 16px',
    background: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e5e5e5',
  },
  helpText: {
    fontSize: '0.8rem',
    color: '#777',
    lineHeight: 1.6,
    fontFamily: "'DM Sans', sans-serif",
  },
}

export default VerifyPanel
