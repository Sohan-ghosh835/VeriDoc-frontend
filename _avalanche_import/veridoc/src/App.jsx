import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import Navbar from './components/Navbar'
import { ToastContainer } from './components/Toast'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import './index.css'

let toastIdCounter = 0

function App() {
  const [page, setPage] = useState('upload')
  const [wallet, setWallet] = useState(null)
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastIdCounter
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('MetaMask not found. Please install it.', 'error')
      return
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setWallet({ provider, signer, address })
      showToast(`Wallet connected: ${address.slice(0, 8)}…`, 'success')
    } catch (err) {
      showToast(`Connection failed: ${err.message}`, 'error')
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    showToast('Wallet disconnected.', 'info')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Navbar
        page={page}
        setPage={setPage}
        wallet={wallet}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />

      <main>
        {page === 'upload' ? (
          <UploadPage wallet={wallet} showToast={showToast} />
        ) : (
          <DashboardPage wallet={wallet} showToast={showToast} />
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner} className="container">
          <div style={styles.footerLeft}>
            <div style={styles.footerLogo}>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 30,28 2,28" fill="#e84142"/>
                <polygon points="16,10 24,26 8,26" fill="white"/>
              </svg>
              <span style={styles.footerLogoText}>VeriDoc AI</span>
            </div>
            <p style={styles.footerTagline}>
              Blockchain-verified document authentication, powered by AI.
            </p>
          </div>
          <div style={styles.footerRight}>
            <div style={styles.footerLinks}>
              <a href="https://polygon.technology" target="_blank" rel="noreferrer" style={styles.footerLink}>Polygon</a>
              <a href="https://ipfs.tech" target="_blank" rel="noreferrer" style={styles.footerLink}>IPFS</a>
              <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noreferrer" style={styles.footerLink}>Gemini AI</a>
            </div>
            <p style={styles.footerCopy}>© 2025 VeriDoc AI</p>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={styles.footerBar}>
          <div className="display-text" style={styles.footerBigText}>VERIDOC</div>
        </div>
      </footer>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

const styles = {
  footer: {
    borderTop: '2px solid #0a0a0a',
    marginTop: '80px',
    background: '#0a0a0a',
    color: '#fff',
    overflow: 'hidden',
  },
  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '48px 32px 40px',
    gap: '40px',
    flexWrap: 'wrap',
  },
  footerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  footerLogoText: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 800,
    fontSize: '1.1rem',
    color: '#fff',
    letterSpacing: '-0.03em',
  },
  footerTagline: {
    fontSize: '0.85rem',
    color: '#666',
    lineHeight: 1.6,
    maxWidth: '280px',
    fontFamily: "'DM Sans', sans-serif",
  },
  footerRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-end',
  },
  footerLinks: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  footerLink: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '0.82rem',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: 'color 0.15s',
  },
  footerCopy: {
    fontSize: '0.75rem',
    color: '#444',
    fontFamily: "'DM Sans', sans-serif",
  },
  footerBar: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '0 0 0 24px',
    overflow: 'hidden',
    height: '80px',
    display: 'flex',
    alignItems: 'flex-end',
  },
  footerBigText: {
    fontSize: '100px',
    color: 'rgba(255,255,255,0.04)',
    fontWeight: 400,
    lineHeight: 1,
    userSelect: 'none',
    letterSpacing: '0.02em',
  },
}

export default App
