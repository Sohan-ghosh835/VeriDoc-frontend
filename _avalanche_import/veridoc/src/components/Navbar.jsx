import { useState } from 'react'

const Navbar = ({ page, setPage, wallet, connectWallet, disconnectWallet }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          {/* Logo */}
          <div style={styles.logo} onClick={() => setPage('upload')}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 30,28 2,28" fill="#e84142"/>
              <polygon points="16,10 24,26 8,26" fill="white"/>
            </svg>
            <span style={styles.logoText}>VeriDoc</span>
            <span style={styles.logoTag}>AI</span>
          </div>

          {/* Center Nav Links */}
          <div style={styles.navLinks}>
            <button
              style={{ ...styles.navLink, ...(page === 'upload' ? styles.navLinkActive : {}) }}
              onClick={() => setPage('upload')}
            >
              Upload
            </button>
            <button
              style={{ ...styles.navLink, ...(page === 'dashboard' ? styles.navLinkActive : {}) }}
              onClick={() => setPage('dashboard')}
            >
              Dashboard
            </button>
          </div>

          {/* Right: Wallet */}
          <div style={styles.navRight}>
            {wallet ? (
              <div style={styles.walletRow}>
                <div style={styles.walletBadge}>
                  <span style={styles.walletDot} />
                  <span style={styles.walletAddr}>
                    {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
                  </span>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={disconnectWallet}
                  style={{ borderRadius: '4px' }}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={connectWallet}
                id="connect-wallet-btn"
                style={{ borderRadius: '4px', gap: '8px' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 14a1 1 0 110-2 1 1 0 010 2z" fill="currentColor"/>
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Bottom border ticker */}
        <div style={styles.ticker}>
          <div className="ticker-track">
            {Array(6).fill(['VERIDOC AI', '•', 'BLOCKCHAIN VERIFIED', '•', 'IPFS STORAGE', '•', 'GEMINI AI', '•']).flat().map((t, i) => (
              <span key={i} style={styles.tickerItem}>{t}</span>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div id="mobile-nav" style={styles.mobileNav}>
        <button
          style={{ ...styles.mobileNavBtn, ...(page === 'upload' ? styles.mobileNavBtnActive : {}) }}
          onClick={() => setPage('upload')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Upload</span>
        </button>
        <button
          style={{ ...styles.mobileNavBtn, ...(page === 'dashboard' ? styles.mobileNavBtnActive : {}) }}
          onClick={() => setPage('dashboard')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>Dashboard</span>
        </button>
      </div>
    </>
  )
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: '#ffffff',
    borderBottom: '2px solid #0a0a0a',
  },
  navInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  logoText: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#0a0a0a',
    letterSpacing: '-0.04em',
  },
  logoTag: {
    fontSize: '0.65rem',
    fontWeight: 700,
    background: '#e84142',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '3px',
    letterSpacing: '0.05em',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navLink: {
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    fontSize: '0.875rem',
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    color: '#555555',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.15s ease',
    letterSpacing: '0',
  },
  navLinkActive: {
    color: '#0a0a0a',
    background: '#f5f5f5',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  walletRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  walletBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '7px 14px',
    background: '#f5f5f5',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontFamily: "'DM Mono', monospace",
    fontWeight: 500,
  },
  walletDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#16a34a',
    flexShrink: 0,
  },
  walletAddr: {
    color: '#0a0a0a',
  },
  ticker: {
    background: '#0a0a0a',
    overflow: 'hidden',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
  },
  tickerItem: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0 16px',
    fontFamily: "'DM Sans', sans-serif",
  },
  mobileNav: {
    display: 'none',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#ffffff',
    borderTop: '2px solid #0a0a0a',
    zIndex: 99,
    padding: '8px 0 16px',
    justifyContent: 'space-around',
  },
  mobileNavBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#999999',
    fontSize: '0.7rem',
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    padding: '6px 20px',
    borderRadius: '6px',
    transition: 'all 0.15s',
  },
  mobileNavBtnActive: {
    color: '#e84142',
  },
}

export default Navbar
