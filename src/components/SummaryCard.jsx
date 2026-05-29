import { useState } from 'react'
import { ethers } from 'ethers'
import { VERIDOC_ABI, getContractAddressForChain, retryWithBackoff } from '../config'

const SummaryCard = ({ result, wallet, showToast }) => {
  const [storing, setStoring] = useState(false)
  const [stored, setStored] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [copied, setCopied] = useState(null)

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatChainError = (error) => {
    const raw = String(error?.reason || error?.message || '').replace(/\uFFFD/g, ' ').trim()
    const lower = raw.toLowerCase()
    if (lower.includes('already exists')) return 'This document is already stored on-chain.'
    if (lower.includes('too many errors') || lower.includes('rate limit'))
      return 'RPC provider rate-limited requests. Please wait a bit and try again.'
    if (lower.includes('could not coalesce error') || lower.includes('unknown_error'))
      return 'RPC endpoint error. Please retry or switch wallet RPC network endpoint.'
    if (lower.includes('network error') || lower.includes('failed to fetch'))
      return 'Network error while sending transaction. Check wallet network connection.'
    return 'Transaction failed. Please retry in a moment.'
  }

  const storeOnChain = async () => {
    if (!wallet) { showToast('Please connect your wallet first!', 'error'); return }
    setStoring(true)
    try {
      const chainId = wallet?.chainId ?? Number((await wallet.provider.getNetwork()).chainId)
      const contractAddress = getContractAddressForChain(chainId)
      if (!contractAddress) {
        showToast(`Unsupported network (chain ${chainId}). Configure contract address for this chain.`, 'error')
        return
      }
      const code = await retryWithBackoff(() => wallet.provider.getCode(contractAddress))
      if (code === '0x') {
        showToast(`Smart contract is not deployed at ${contractAddress} on this network.`, 'error')
        setStoring(false); return
      }
      const contract = new ethers.Contract(contractAddress, VERIDOC_ABI, wallet.signer)
      const tx = await retryWithBackoff(() => contract.storeDocHash(result.ipfsHash))
      showToast('Transaction submitted! Waiting for confirmation...', 'info')
      await tx.wait()
      setTxHash(tx.hash)
      setStored(true)
      showToast('Document stored on blockchain!', 'success')
    } catch (err) {
      showToast(formatChainError(err), 'error')
    } finally {
      setStoring(false)
    }
  }

  return (
    <div style={styles.card} className="fade-in">

      {/* Header */}
      <div style={styles.headerBar}>
        <div style={styles.headerLeft}>
          <div style={styles.aiChip}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Gemini 1.5 Flash</span>
          </div>
          <h3 style={styles.cardTitle}>AI Document Summary</h3>
        </div>
        <span className="tag tag-pink">AI Analyzed</span>
      </div>

      <div style={styles.divider} />

      {/* Summary */}
      <div style={styles.summaryBox}>
        <p style={styles.summaryLabel}>SUMMARY</p>
        <p style={styles.summaryText}>{result.summary}</p>
      </div>

      <div style={styles.divider} />

      {/* IPFS Section */}
      <div>
        <p style={styles.fieldLabel}>IPFS CONTENT ID (CID)</p>
        <div style={styles.hashRow}>
          <code style={styles.hashCode}>{result.ipfsHash}</code>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => copyText(result.ipfsHash, 'cid')}
            title="Copy CID"
            id="copy-cid-btn"
            style={{ borderRadius: '8px', flexShrink: 0 }}
          >
            {copied === 'cid' ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
          </button>
          {result.ipfsUrl && (
            <a
              href={result.ipfsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              title="View on IPFS"
              id="view-ipfs-link"
              style={{ borderRadius: '8px', flexShrink: 0 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              IPFS
            </a>
          )}
        </div>
        <p style={styles.hashNote}>
          This unique hash identifies your document on IPFS. Store it on-chain to create a permanent, verifiable record.
        </p>
      </div>

      <div style={styles.divider} />

      {/* Blockchain section */}
      {stored ? (
        <div style={styles.successBanner}>
          <div style={styles.successIconWrap}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p style={styles.successTitle}>STORED ON BLOCKCHAIN</p>
            {txHash && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <code style={styles.txCode}>Tx: {txHash.slice(0, 22)}…</code>
                <button
                  className="btn btn-sm"
                  style={{ padding: '2px 8px', color: 'var(--text-3)', background: 'transparent', border: 'none', fontFamily: "var(--font-body)", fontSize: '0.75rem' }}
                  onClick={() => copyText(txHash, 'tx')}
                >
                  {copied === 'tx' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          className="btn btn-primary"
          style={{ width: '100%', borderRadius: '10px', padding: '14px' }}
          onClick={storeOnChain}
          disabled={storing}
          id="store-on-chain-btn"
        >
          {storing ? (
            <><span className="spinner" /> Submitting transaction...</>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              STORE HASH ON BLOCKCHAIN
            </>
          )}
        </button>
      )}
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: 'var(--shadow-card)',
  },
  headerBar: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  aiChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #FFB6C1, #FF8DA1)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    fontFamily: "var(--font-body)",
    width: 'fit-content',
    boxShadow: '0 0 12px rgba(255,182,193,0.35)',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    fontFamily: "var(--font-body)",
  },
  divider: {
    height: '1px',
    background: 'var(--divider)',
    margin: '20px 0',
  },
  summaryBox: {
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '18px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  summaryLabel: {
    fontSize: '0.62rem',
    fontWeight: 800,
    color: 'rgba(255,182,193,0.5)',
    letterSpacing: '0.14em',
    marginBottom: '10px',
    fontFamily: "var(--font-body)",
  },
  summaryText: {
    fontSize: '0.88rem',
    color: 'var(--text-2)',
    lineHeight: 1.8,
    whiteSpace: 'pre-wrap',
    fontFamily: "var(--font-body)",
  },
  fieldLabel: {
    fontSize: '0.62rem',
    fontWeight: 800,
    color: 'rgba(255,182,193,0.5)',
    letterSpacing: '0.14em',
    marginBottom: '10px',
    fontFamily: "var(--font-body)",
  },
  hashRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  hashCode: {
    flex: 1,
    fontSize: '0.7rem',
    color: 'var(--pink)',
    background: 'var(--pink-light)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-a)',
    wordBreak: 'break-all',
    fontFamily: "var(--font-mono)",
  },
  hashNote: {
    fontSize: '0.73rem',
    color: 'var(--text-3)',
    marginTop: '10px',
    lineHeight: 1.6,
    fontFamily: "var(--font-body)",
  },
  successBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    background: 'rgba(74,222,128,0.06)',
    border: '1px solid rgba(74,222,128,0.2)',
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: '0 0 20px rgba(74,222,128,0.08)',
  },
  successIconWrap: {
    width: '36px',
    height: '36px',
    background: 'rgba(74,222,128,0.1)',
    border: '1px solid rgba(74,222,128,0.2)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  successTitle: {
    fontWeight: 700,
    color: '#4ade80',
    fontSize: '0.82rem',
    letterSpacing: '0.06em',
    fontFamily: "var(--font-body)",
  },
  txCode: {
    fontSize: '0.7rem',
    color: 'var(--text-3)',
    fontFamily: "var(--font-mono)",
  },
}

export default SummaryCard
