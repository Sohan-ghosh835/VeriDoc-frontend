import { useState, useCallback, useEffect } from 'react'
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
  const [theme, setTheme] = useState(() => localStorage.getItem('vd-theme') || 'dark')

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('vd-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastIdCounter
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) { showToast('MetaMask not found. Please install it.', 'error'); return }
    try {
      let provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const currentNetwork = await provider.getNetwork()
      const currentChainId = Number(currentNetwork.chainId)
      if (currentChainId !== 31337) {
        try {
          await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x7a69' }] })
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{ chainId: '0x7a69', chainName: 'Hardhat Localhost', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: ['http://127.0.0.1:8545/'] }],
              })
            } catch (e) { console.error(e) }
          }
        }
      }
      provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()
      setWallet({ provider, signer, address, chainId: Number(network.chainId) })
      showToast(`Wallet connected: ${address.slice(0, 8)}…`, 'success')
    } catch (err) {
      showToast(`Connection failed: ${err.message}`, 'error')
    }
  }

  const disconnectWallet = () => { setWallet(null); showToast('Wallet disconnected.', 'info') }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) connectWallet()
      }).catch(console.error)

      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) disconnectWallet()
        else {
          const provider = new ethers.BrowserProvider(window.ethereum)
          provider.getSigner().then(signer => {
            signer.getAddress().then(address => {
              provider.getNetwork().then(network => {
                setWallet({ provider, signer, address, chainId: Number(network.chainId) })
              })
            })
          }).catch(console.error)
        }
      }
      const handleChainChanged = () => window.location.reload()
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', transition: 'background 0.4s ease' }}>
      <Navbar
        page={page} setPage={setPage}
        wallet={wallet} connectWallet={connectWallet} disconnectWallet={disconnectWallet}
        theme={theme} toggleTheme={toggleTheme}
      />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {page === 'upload' ? (
          <UploadPage wallet={wallet} showToast={showToast} />
        ) : (
          <DashboardPage wallet={wallet} showToast={showToast} />
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div className="container" style={styles.footerInner}>
            {/* Brand */}
            <div style={styles.footerBrand}>
              <div style={styles.footerLogo} onClick={() => setPage('upload')}>
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                  <defs>
                    <linearGradient id="fGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--pink)"/>
                      <stop offset="100%" stopColor="var(--pink-2)"/>
                    </linearGradient>
                  </defs>
                  <polygon points="16,2 30,28 2,28" fill="url(#fGrad)"/>
                  <polygon points="16,10 24,26 8,26" fill="var(--bg)" opacity="0.5"/>
                </svg>
                <span style={styles.footerLogoText}>VeriDoc</span>
                <span style={styles.footerLogoTag}>AI</span>
              </div>
              <p style={styles.footerTagline}>
                Blockchain-verified document authentication,<br/>powered by Gemini AI.
              </p>
            </div>

            {/* Links columns */}
            <div style={styles.footerCols}>
              <div style={styles.footerCol}>
                <p style={styles.footerColHead}>Platform</p>
                <button style={styles.footerLink} onClick={() => setPage('upload')}>Upload</button>
                <button style={styles.footerLink} onClick={() => setPage('dashboard')}>Dashboard</button>
              </div>
              <div style={styles.footerCol}>
                <p style={styles.footerColHead}>Powered By</p>
                <a href="https://polygon.technology" target="_blank" rel="noreferrer" style={styles.footerLinkA}>Polygon</a>
                <a href="https://ipfs.tech" target="_blank" rel="noreferrer" style={styles.footerLinkA}>IPFS</a>
                <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noreferrer" style={styles.footerLinkA}>Gemini AI</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={styles.footerBottom}>
          <div className="container" style={styles.footerBottomInner}>
            <p style={styles.footerCopy}>© 2025 VeriDoc AI. Built for the future of document trust.</p>
            <div style={styles.footerBigText} className="display-text">VERIDOC</div>
          </div>
        </div>
      </footer>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

const styles = {
  footer: {
    borderTop: '1px solid var(--divider)',
    marginTop: '100px',
    background: 'var(--bg-2)',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  footerTop: { padding: '60px 0 40px' },
  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '48px',
    flexWrap: 'wrap',
  },
  footerBrand: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '280px' },
  footerLogo: {
    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
  },
  footerLogoText: {
    fontFamily: "var(--font-body)", fontWeight: 800, fontSize: '1.15rem',
    color: 'var(--text)', letterSpacing: '-0.04em',
  },
  footerLogoTag: {
    fontSize: '0.58rem', fontWeight: 800,
    background: 'var(--grad-pink)', color: '#fff',
    padding: '2px 7px', borderRadius: '6px', letterSpacing: '0.06em',
    boxShadow: '0 0 10px var(--pink-glow)',
  },
  footerTagline: {
    fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.7,
    fontFamily: "var(--font-body)",
  },
  footerCols: { display: 'flex', gap: '56px', flexWrap: 'wrap' },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerColHead: {
    fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)',
    letterSpacing: '0.12em', textTransform: 'uppercase',
    fontFamily: "var(--font-body)", marginBottom: '4px',
  },
  footerLink: {
    background: 'none', border: 'none', padding: 0, textAlign: 'left',
    fontSize: '0.85rem', color: 'var(--text-2)', fontFamily: "var(--font-body)",
    cursor: 'pointer', transition: 'color 0.2s', fontWeight: 500,
  },
  footerLinkA: {
    fontSize: '0.85rem', color: 'var(--text-2)', textDecoration: 'none',
    fontFamily: "var(--font-body)", fontWeight: 500, transition: 'color 0.2s',
  },
  footerBottom: {
    borderTop: '1px solid var(--divider)',
    overflow: 'hidden', position: 'relative',
  },
  footerBottomInner: {
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    padding: '20px 0 0',
  },
  footerCopy: {
    fontSize: '0.75rem', color: 'var(--text-3)',
    fontFamily: "var(--font-body)", paddingBottom: '20px',
  },
  footerBigText: {
    fontSize: 'clamp(60px,8vw,112px)',
    background: 'var(--grad-text)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 900, lineHeight: 1, userSelect: 'none',
    opacity: 0.07, letterSpacing: '0.02em',
  },
}

export default App
