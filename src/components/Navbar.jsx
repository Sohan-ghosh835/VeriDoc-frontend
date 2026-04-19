import { useState } from 'react'
import { ethers } from 'ethers'

const Navbar = ({ page, setPage, wallet, setWallet, showToast }) => {
  const [connecting, setConnecting] = useState(false)

  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('MetaMask not found. Please install MetaMask extension.', 'error')
      return
    }
    setConnecting(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      setWallet({ address, signer, provider, network })
      showToast(`Connected: ${address.slice(0,6)}...${address.slice(-4)}`, 'success')
    } catch (err) {
      showToast('Failed to connect wallet.', 'error')
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    showToast('Wallet disconnected.', 'success')
  }

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  return (
    <nav style={styles.nav}>
      <div className="container flex-between" style={{ height: '100%' }}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => setPage('upload')}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" opacity="0.6"/>
            </svg>
          </div>
          <span style={styles.logoText}>VeriDoc<span style={{ color: 'var(--pink)' }}>AI</span></span>
        </div>

        {/* Nav Tabs */}
        <div style={styles.tabs} className="hide-mobile">
          <button
            style={{ ...styles.tab, ...(page === 'upload' ? styles.tabActive : {}) }}
            onClick={() => setPage('upload')}
          >
            Upload
          </button>
          <button
            style={{ ...styles.tab, ...(page === 'dashboard' ? styles.tabActive : {}) }}
            onClick={() => setPage('dashboard')}
          >
            Verify Docs
          </button>
        </div>

        {/* Wallet Button */}
        <div>
          {wallet ? (
            <div style={styles.walletInfo}>
              <span className="pulse-dot" />
              <span style={styles.walletAddress}>{formatAddress(wallet.address)}</span>
              <button
                className="btn btn-sm btn-secondary"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={connectWallet}
              disabled={connecting}
              id="connect-wallet-btn"
            >
              {connecting ? <span className="spinner" /> : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 7H3a2 2 0 00-2 2v6a2 2 0 002 2h18a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile tabs */}
      <div style={styles.mobileTabs} className="flex-center" id="mobile-nav">
        <button
          style={{ ...styles.mobileTab, ...(page === 'upload' ? styles.mobileTabActive : {}) }}
          onClick={() => setPage('upload')}
        >Upload</button>
        <button
          style={{ ...styles.mobileTab, ...(page === 'dashboard' ? styles.mobileTabActive : {}) }}
          onClick={() => setPage('dashboard')}
        >Verify</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    height: '64px',
    background: 'rgba(8, 8, 9, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'var(--gradient-pink)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(232, 121, 160, 0.4)',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    background: 'var(--bg-card)',
    padding: '4px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border)',
  },
  tab: {
    padding: '7px 20px',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  tabActive: {
    background: 'var(--bg-glass-hover)',
    color: 'var(--text-primary)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
  },
  walletInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '7px 14px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-full)',
  },
  walletAddress: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontFamily: 'monospace',
  },
  mobileTabs: {
    display: 'none',
    gap: '8px',
    padding: '6px 16px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-primary)',
  },
  mobileTab: {
    flex: 1,
    padding: '8px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    transition: 'var(--transition)',
  },
  mobileTabActive: {
    background: 'var(--pink-light)',
    color: 'var(--pink)',
  },
}

export default Navbar
