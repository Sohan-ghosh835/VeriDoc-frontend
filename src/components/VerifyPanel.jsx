import { useState } from 'react'
import { ethers } from 'ethers'
import { VERIDOC_ABI, CONTRACT_ADDRESS } from '../config'

const VerifyPanel = ({ wallet, showToast }) => {
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [verifying, setVerifying] = useState(false)

  const lookupDoc = async () => {
    if (!hash.trim()) {
      showToast('Please enter an IPFS hash to look up.', 'error')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      // Read-only provider for localhost
      const provider = wallet?.provider || new ethers.JsonRpcProvider('http://127.0.0.1:8545')
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VERIDOC_ABI, provider)
      const [owner, isVerified, timestamp] = await contract.getDoc(hash.trim())

      if (owner === ethers.ZeroAddress) {
        setResult({ notFound: true })
      } else {
        setResult({
          owner,
          isVerified,
          timestamp: Number(timestamp),
          ipfsHash: hash.trim(),
        })
      }
    } catch (err) {
      console.error(err)
      showToast(`Lookup failed: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const verifyDoc = async () => {
    if (!wallet) {
      showToast('Connect your wallet to verify documents.', 'error')
      return
    }
    setVerifying(true)
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VERIDOC_ABI, wallet.signer)
      const tx = await contract.verifyDoc(hash.trim())
      showToast('Verification transaction submitted...', 'info')
      await tx.wait()
      showToast('Document verified on-chain! ✅', 'success')
      // Refresh lookup
      await lookupDoc()
    } catch (err) {
      const msg = err?.reason || err?.message || 'Verification failed'
      if (msg.includes('Not an authorized verifier')) {
        showToast('Your wallet is not an authorized verifier. The contract admin must add your address.', 'error')
      } else if (msg.includes('already verified')) {
        showToast('This document is already verified.', 'error')
      } else {
        showToast(`Error: ${msg}`, 'error')
      }
    } finally {
      setVerifying(false)
    }
  }

  const formatDate = (ts) => {
    if (!ts) return 'Unknown'
    return new Date(ts * 1000).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      {/* Search */}
      <div style={styles.searchRow}>
        <input
          type="text"
          placeholder="Enter IPFS Hash / CID to verify..."
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && lookupDoc()}
          id="verify-hash-input"
        />
        <button
          className="btn btn-primary"
          onClick={lookupDoc}
          disabled={loading || !hash.trim()}
          id="lookup-btn"
          style={{ flexShrink: 0 }}
        >
          {loading ? <span className="spinner" /> : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Lookup
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={styles.result} className="fade-in">
          {result.notFound ? (
            <div style={styles.notFound}>
              <div style={styles.notFoundIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="var(--text-muted)" strokeWidth="1.5"/>
                  <path d="M12 8v4M12 16h.01" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={styles.notFoundTitle}>Document Not Found</p>
              <p style={styles.notFoundSub}>This hash has not been stored on the blockchain yet.</p>
            </div>
          ) : (
            <div>
              {/* Status Banner */}
              <div style={{
                ...styles.statusBanner,
                background: result.isVerified ? 'var(--success-bg)' : 'rgba(251,191,36,0.08)',
                borderColor: result.isVerified ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)',
              }}>
                <div style={styles.statusIcon}>
                  {result.isVerified ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="var(--success)" strokeWidth="2.5"/>
                      <polyline points="22 4 12 14.01 9 11.01" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p style={{
                    ...styles.statusTitle,
                    color: result.isVerified ? 'var(--success)' : 'var(--warning)',
                  }}>
                    {result.isVerified ? '✅ Verified on Blockchain' : '⏳ Pending Verification'}
                  </p>
                  <p style={styles.statusSub}>
                    {result.isVerified
                      ? 'This document has been verified by an authorized institution.'
                      : 'This document is stored on-chain but not yet verified by an authorized institution.'}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div style={styles.detailsGrid}>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Owner</p>
                  <code style={styles.detailValue}>{result.owner}</code>
                </div>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Stored On</p>
                  <p style={styles.detailValue}>{formatDate(result.timestamp)}</p>
                </div>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>IPFS Hash</p>
                  <code style={{...styles.detailValue, color: 'var(--pink)', wordBreak: 'break-all'}}>
                    {result.ipfsHash}
                  </code>
                </div>
              </div>

              {/* Verify Button (for authorized verifiers) */}
              {!result.isVerified && (
                <button
                  className="btn btn-outline-pink"
                  style={{ width: '100%', marginTop: '12px' }}
                  onClick={verifyDoc}
                  disabled={verifying || !wallet}
                  id="verify-doc-btn"
                >
                  {verifying ? (
                    <><span className="spinner" style={{ borderTopColor: 'var(--pink)' }} /> Verifying...</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Verify as Authorized Verifier
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  searchRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  result: {
    marginTop: '20px',
  },
  notFound: {
    textAlign: 'center',
    padding: '40px 24px',
    background: 'var(--bg-glass)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
  },
  notFoundIcon: {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'center',
  },
  notFoundTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  notFoundSub: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  statusBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '18px 20px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid',
    marginBottom: '16px',
  },
  statusIcon: { flexShrink: 0 },
  statusTitle: {
    fontWeight: 700,
    fontSize: '1rem',
    marginBottom: '4px',
  },
  statusSub: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  detailCard: {
    background: 'var(--bg-glass)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 18px',
  },
  detailLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  detailValue: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    lineHeight: 1.5,
  },
}

export default VerifyPanel
