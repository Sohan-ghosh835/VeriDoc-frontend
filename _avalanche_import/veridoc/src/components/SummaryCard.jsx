import { useState } from 'react'
import { ethers } from 'ethers'
import { VERIDOC_ABI, CONTRACT_ADDRESS } from '../config'

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

  const storeOnChain = async () => {
    if (!wallet) {
      showToast('Please connect your wallet first!', 'error')
      return
    }
    setStoring(true)
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VERIDOC_ABI, wallet.signer)
      const tx = await contract.storeDocHash(result.ipfsHash)
      showToast('Transaction submitted! Waiting for confirmation...', 'info')
      await tx.wait()
      setTxHash(tx.hash)
      setStored(true)
      showToast('Document stored on blockchain!', 'success')
    } catch (err) {
      const msg = err?.reason || err?.message || 'Transaction failed'
      showToast(
        msg.includes('already exists')
          ? 'This document is already stored on-chain.'
          : `Error: ${msg}`,
        'error'
      )
    } finally {
      setStoring(false)
    }
  }

  return (
    <div style={styles.card} className="fade-in">

      {/* Header bar */}
      <div style={styles.headerBar}>
        <div style={styles.headerLeft}>
          <div style={styles.aiChip}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Gemini 2.5 Flash</span>
          </div>
          <h3 style={styles.cardTitle}>AI DOCUMENT SUMMARY</h3>
        </div>
        <span className="tag tag-red">AI Analyzed</span>
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
            style={{ borderRadius: '4px', flexShrink: 0 }}
          >
            {copied === 'cid' ? (
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
          {result.ipfsUrl && (
            <a
              href={result.ipfsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              title="View on IPFS"
              id="view-ipfs-link"
              style={{ borderRadius: '4px', flexShrink: 0 }}
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
          <div style={styles.successIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p style={styles.successTitle}>STORED ON BLOCKCHAIN</p>
            {txHash && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <code style={styles.txCode}>Tx: {txHash.slice(0, 22)}…</code>
                <button
                  className="btn btn-sm"
                  style={{ padding: '2px 8px', color: '#555', background: 'transparent', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem' }}
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
          style={{ width: '100%', borderRadius: '6px', padding: '14px' }}
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
    background: '#ffffff',
    border: '2px solid #0a0a0a',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '4px 4px 0px #0a0a0a',
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
    background: '#0a0a0a',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    fontFamily: "'DM Sans', sans-serif",
    width: 'fit-content',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#0a0a0a',
    letterSpacing: '-0.02em',
    fontFamily: "'DM Sans', sans-serif",
  },
  divider: {
    height: '1px',
    background: '#e5e5e5',
    margin: '20px 0',
  },
  summaryBox: {
    background: '#fafafa',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    padding: '20px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  summaryLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: '#999',
    letterSpacing: '0.12em',
    marginBottom: '10px',
    fontFamily: "'DM Sans', sans-serif",
  },
  summaryText: {
    fontSize: '0.9rem',
    color: '#333',
    lineHeight: 1.8,
    whiteSpace: 'pre-wrap',
    fontFamily: "'DM Sans', sans-serif",
  },
  fieldLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: '#999',
    letterSpacing: '0.12em',
    marginBottom: '10px',
    fontFamily: "'DM Sans', sans-serif",
  },
  hashRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  hashCode: {
    flex: 1,
    fontSize: '0.72rem',
    color: '#e84142',
    background: 'rgba(232,65,66,0.05)',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid rgba(232,65,66,0.2)',
    wordBreak: 'break-all',
    fontFamily: "'DM Mono', monospace",
  },
  hashNote: {
    fontSize: '0.75rem',
    color: '#999',
    marginTop: '10px',
    lineHeight: 1.6,
    fontFamily: "'DM Sans', sans-serif",
  },
  successBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    background: '#f0fdf4',
    border: '2px solid #16a34a',
    borderRadius: '8px',
    padding: '16px 20px',
    boxShadow: '2px 2px 0px #16a34a',
  },
  successIcon: {
    width: '36px',
    height: '36px',
    background: '#dcfce7',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  successTitle: {
    fontWeight: 800,
    color: '#15803d',
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
    fontFamily: "'DM Sans', sans-serif",
  },
  txCode: {
    fontSize: '0.72rem',
    color: '#555',
    fontFamily: "'DM Mono', monospace",
  },
}

export default SummaryCard
