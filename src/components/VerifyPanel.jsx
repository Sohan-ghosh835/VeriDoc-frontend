import { useState } from 'react'
import { ethers } from 'ethers'
import { VERIDOC_ABI, FALLBACK_RPC_URL, getContractAddressForChain, retryWithBackoff } from '../config'

const VerifyPanel = ({ wallet, showToast }) => {
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [verifying, setVerifying] = useState(false)

  const formatChainError = (error, fallback = 'Operation failed. Please try again.') => {
    const raw = String(error?.reason || error?.message || '').replace(/\uFFFD/g, ' ').trim()
    const lower = raw.toLowerCase()
    if (lower.includes('not an authorized verifier'))
      return 'Your wallet is not an authorized verifier. The contract admin must add your address.'
    if (lower.includes('already verified')) return 'This document is already verified.'
    if (lower.includes('too many errors') || lower.includes('rate limit'))
      return 'RPC provider rate-limited requests. Please wait a bit and retry.'
    if (lower.includes('could not coalesce error') || lower.includes('unknown_error'))
      return 'RPC endpoint error. Please retry or switch wallet RPC endpoint.'
    if (lower.includes('network error') || lower.includes('failed to fetch'))
      return 'Network error. Check wallet/RPC connection and try again.'
    return fallback
  }

  const lookupDoc = async () => {
    if (!hash.trim()) { showToast('Please enter an IPFS hash to look up.', 'error'); return }
    setLoading(true)
    setResult(null)
    try {
      const provider = wallet?.provider || new ethers.JsonRpcProvider(FALLBACK_RPC_URL)
      const chainId = wallet?.chainId ?? Number((await provider.getNetwork()).chainId)
      const contractAddress = getContractAddressForChain(chainId)
      if (!contractAddress) {
        showToast(`Unsupported network (chain ${chainId}). Configure contract address for this chain.`, 'error')
        return
      }
      const code = await provider.getCode(contractAddress)
      if (code === '0x') {
        showToast(`Smart contract is not deployed at ${contractAddress} on this network.`, 'error')
        setLoading(false); return
      }
      const contract = new ethers.Contract(contractAddress, VERIDOC_ABI, provider)
      const [owner, isVerified, timestamp] = await retryWithBackoff(() => contract.getDoc(hash.trim()))
      if (owner === ethers.ZeroAddress) {
        setResult({ notFound: true })
      } else {
        setResult({ owner, isVerified, timestamp: Number(timestamp), ipfsHash: hash.trim() })
      }
    } catch (err) {
      console.error(err)
      showToast(formatChainError(err, 'Lookup failed. Please retry.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const verifyDoc = async () => {
    if (!wallet) { showToast('Connect your wallet to verify documents.', 'error'); return }
    setVerifying(true)
    try {
      const chainId = wallet?.chainId ?? Number((await wallet.provider.getNetwork()).chainId)
      const contractAddress = getContractAddressForChain(chainId)
      if (!contractAddress) {
        showToast(`Unsupported network (chain ${chainId}). Configure contract address for this chain.`, 'error')
        return
      }
      const code = await wallet.provider.getCode(contractAddress)
      if (code === '0x') {
        showToast(`Smart contract is not deployed at ${contractAddress} on this network.`, 'error')
        setVerifying(false); return
      }
      const contract = new ethers.Contract(contractAddress, VERIDOC_ABI, wallet.signer)
      const tx = await contract.verifyDoc(hash.trim())
      showToast('Verification transaction submitted...', 'info')
      await tx.wait()
      showToast('Document verified on-chain! ✅', 'success')
      await lookupDoc()
    } catch (err) {
      showToast(formatChainError(err, 'Verification failed. Please retry.'), 'error')
    } finally {
      setVerifying(false)
    }
  }

  const formatDate = (ts) => {
    if (!ts) return 'Unknown'
    return new Date(ts * 1000).toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <div style={styles.panelChip}>VERIFY</div>
        <h2 style={styles.panelTitle}>On-Chain Lookup</h2>
        <p style={styles.panelSub}>Enter an IPFS hash to check its blockchain registration status.</p>
      </div>

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
          style={{ flexShrink: 0, borderRadius: '10px' }}
        >
          {loading ? <span className="spinner" /> : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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
              <div style={styles.notFoundIconWrap}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,182,193,0.3)" strokeWidth="1.5"/>
                  <path d="M12 8v4M12 16h.01" stroke="rgba(255,182,193,0.4)" strokeWidth="2" strokeLinecap="round"/>
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
                background: result.isVerified
                  ? 'rgba(74,222,128,0.05)'
                  : 'rgba(251,191,36,0.05)',
                borderColor: result.isVerified
                  ? 'rgba(74,222,128,0.2)'
                  : 'rgba(251,191,36,0.2)',
                boxShadow: result.isVerified
                  ? '0 0 20px rgba(74,222,128,0.06)'
                  : '0 0 20px rgba(251,191,36,0.06)',
              }}>
                <div style={styles.statusIconWrap}>
                  {result.isVerified ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#4ade80" strokeWidth="2.5"/>
                      <polyline points="22 4 12 14.01 9 11.01" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p style={{
                    ...styles.statusTitle,
                    color: result.isVerified ? '#4ade80' : '#fbbf24',
                  }}>
                    {result.isVerified ? '✅ Verified on Blockchain' : '⏳ Pending Verification'}
                  </p>
                  <p style={styles.statusSub}>
                    {result.isVerified
                      ? 'This document has been verified by an authorized institution.'
                      : 'Stored on-chain but not yet verified by an authorized institution.'}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div style={styles.detailsGrid}>
                {[
                  { label: 'Owner', value: result.owner, mono: true },
                  { label: 'Stored On', value: formatDate(result.timestamp), mono: false },
                  { label: 'IPFS Hash', value: result.ipfsHash, mono: true, pink: true },
                ].map((item) => (
                  <div key={item.label} style={styles.detailCard}>
                    <p style={styles.detailLabel}>{item.label}</p>
                    <code style={{
                      ...styles.detailValue,
                      fontFamily: item.mono ? "var(--font-mono)" : "var(--font-body)",
                      color: item.pink ? 'var(--pink)' : 'var(--text-2)',
                      wordBreak: 'break-all',
                    }}>
                      {item.value}
                    </code>
                  </div>
                ))}
              </div>

              {/* Verify Button */}
              {!result.isVerified && (
                <button
                  className="btn btn-outline"
                  style={{ width: '100%', marginTop: '14px', borderRadius: '10px' }}
                  onClick={verifyDoc}
                  disabled={verifying || !wallet}
                  id="verify-doc-btn"
                >
                  {verifying ? (
                    <><span className="spinner" style={{ borderTopColor: 'var(--pink)' }} /> Verifying...</>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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
  panel: {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  panelHeader: {
    marginBottom: '20px',
  },
  panelChip: {
    display: 'inline-block',
    background: 'var(--pink-light)',
    color: 'var(--pink)',
    fontSize: '0.58rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    padding: '3px 10px',
    borderRadius: '6px',
    marginBottom: '8px',
    fontFamily: "var(--font-body)",
    border: '1px solid var(--border-a)',
  },
  panelTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    fontFamily: "var(--font-body)",
    marginBottom: '6px',
  },
  panelSub: {
    fontSize: '0.8rem',
    color: 'var(--text-3)',
    lineHeight: 1.5,
    fontFamily: "var(--font-body)",
  },
  searchRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  result: {
    marginTop: '20px',
  },
  notFound: {
    textAlign: 'center',
    padding: '36px 24px',
    background: 'var(--bg-input)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
  },
  notFoundIconWrap: {
    marginBottom: '14px',
    display: 'flex',
    justifyContent: 'center',
  },
  notFoundTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--text-2)',
    marginBottom: '6px',
    fontFamily: "var(--font-body)",
  },
  notFoundSub: {
    fontSize: '0.8rem',
    color: 'var(--text-3)',
    fontFamily: "var(--font-body)",
  },
  statusBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '16px 18px',
    borderRadius: '12px',
    border: '1px solid',
    marginBottom: '14px',
    transition: 'all 0.3s ease',
  },
  statusIconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'var(--bg-card)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusTitle: {
    fontWeight: 700,
    fontSize: '0.9rem',
    marginBottom: '4px',
    fontFamily: "var(--font-body)",
  },
  statusSub: {
    fontSize: '0.78rem',
    color: 'var(--text-3)',
    lineHeight: 1.5,
    fontFamily: "var(--font-body)",
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailCard: {
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '12px 16px',
  },
  detailLabel: {
    fontSize: '0.62rem',
    fontWeight: 700,
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '5px',
    fontFamily: "var(--font-body)",
  },
  detailValue: {
    fontSize: '0.82rem',
    lineHeight: 1.5,
    display: 'block',
  },
}

export default VerifyPanel
