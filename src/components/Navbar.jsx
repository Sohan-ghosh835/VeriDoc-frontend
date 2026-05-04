import { useState, useEffect } from 'react'

const Navbar = ({ page, setPage, wallet, connectWallet, disconnectWallet, theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          {/* Logo */}
          <div style={styles.logo} onClick={() => setPage('upload')}>
            <div style={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 30,28 2,28" fill="url(#navGrad)" />
                <polygon points="16,10 24,26 8,26" fill="rgba(0,0,0,0.5)" />
                <defs>
                  <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFB6C1" />
                    <stop offset="100%" stopColor="#FF8DA1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
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
              {page === 'upload' && <span style={styles.navLinkDot} />}
            </button>
            <button
              style={{ ...styles.navLink, ...(page === 'dashboard' ? styles.navLinkActive : {}) }}
              onClick={() => setPage('dashboard')}
            >
              Dashboard
              {page === 'dashboard' && <span style={styles.navLinkDot} />}
            </button>
          </div>

          {/* Right: Wallet & Theme */}
          <div style={styles.navRight}>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            {wallet ? (
              <div style={styles.walletRow}>
                <div style={styles.walletBadge}>
                  <span style={styles.walletDot} />
                  <span style={styles.walletAddr}>
                    {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
                  </span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={disconnectWallet}
                  style={{ borderRadius: '8px' }}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={connectWallet}
                id="connect-wallet-btn"
                style={{ borderRadius: '8px', gap: '8px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 14a1 1 0 110-2 1 1 0 010 2z" fill="currentColor"/>
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Bottom ticker */}
        <div style={styles.ticker}>
          <div className="ticker-track">
            {Array(12).fill(['VERIDOC AI', '·', 'BLOCKCHAIN VERIFIED', '·', 'IPFS STORAGE', '·', 'GEMINI AI', '·', 'POLYGON NETWORK', '·']).flat().map((t, i) => (
              <span key={i} style={{ ...styles.tickerItem, ...(t === '·' ? { color: 'var(--pink)', opacity: 0.5, fontSize: '1.4rem' } : {}) }}>{t}</span>
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
    background: 'var(--nav-bg)',
    borderBottom: '1px solid var(--nav-br)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  navScrolled: {
    background: 'var(--bg)',
    borderBottomColor: 'var(--border-a)',
    boxShadow: 'var(--shadow-sm)',
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
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'rgba(255,182,193,0.08)',
    border: '1px solid rgba(255,182,193,0.2)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  logoText: {
    fontFamily: "var(--font-body)",
    fontWeight: 800,
    fontSize: '1.2rem',
    color: 'var(--text)',
    letterSpacing: '-0.04em',
  },
  logoTag: {
    fontSize: '0.6rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #FFB6C1, #FF8DA1)',
    color: '#fff',
    padding: '2px 7px',
    borderRadius: '6px',
    letterSpacing: '0.06em',
    boxShadow: '0 0 10px rgba(255,182,193,0.4)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navLink: {
    background: 'none',
    border: 'none',
    padding: '8px 18px',
    fontSize: '0.875rem',
    fontWeight: 500,
    fontFamily: "var(--font-body)",
    color: 'var(--text-3)',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.25s ease',
    letterSpacing: '0',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  navLinkActive: {
    color: 'var(--text)',
    background: 'var(--pink-light)',
  },
  navLinkDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFB6C1, #FF8DA1)',
    boxShadow: '0 0 6px rgba(255,182,193,0.6)',
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
    gap: '8px',
    padding: '7px 14px',
    background: 'rgba(255,182,193,0.06)',
    border: '1px solid var(--border-a)',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontFamily: "var(--font-mono)",
    fontWeight: 500,
    color: 'var(--text)',
  },
  walletDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#4ade80',
    flexShrink: 0,
    boxShadow: '0 0 6px rgba(74,222,128,0.6)',
  },
  walletAddr: {
    color: 'var(--text)',
  },
  ticker: {
    borderTop: '1px solid var(--ticker-br)',
    background: 'var(--ticker-bg)',
    overflow: 'hidden',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  tickerItem: {
    color: 'var(--text-2)',
    fontSize: '0.85rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '0 32px',
    fontFamily: "var(--font-display)",
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  mobileNav: {
    display: 'none',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'var(--nav-bg)',
    borderTop: '1px solid var(--nav-br)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
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
    color: 'var(--text-3)',
    fontSize: '0.7rem',
    fontWeight: 600,
    fontFamily: "var(--font-body)",
    padding: '6px 20px',
    borderRadius: '8px',
    transition: 'all 0.25s',
  },
  mobileNavBtnActive: {
    color: 'var(--pink)',
  },
}

export default Navbar
