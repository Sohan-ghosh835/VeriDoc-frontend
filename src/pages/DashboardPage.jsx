import VerifyPanel from '../components/VerifyPanel'

const DashboardPage = ({ wallet, showToast }) => {
  return (
    <div style={styles.page}>
      <div className="container" style={styles.inner}>

        {/* Header */}
        <div style={styles.header} className="fade-in">
          <div>
            <div style={styles.badge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="var(--pink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              On-Chain Verification
            </div>
            <h1 style={styles.title}>Verify Documents</h1>
            <p style={styles.subtitle}>
              Enter any IPFS hash to check its on-chain status — who stored it, when, and whether it has been verified by an authorized institution.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div style={styles.grid} className="dashboard-grid-override">
          {/* Left: Verify Panel */}
          <div style={styles.mainPanel} className="fade-in-delay-1">
            <div className="card">
              <div style={styles.panelHeader}>
                <div style={styles.panelIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h2 style={styles.panelTitle}>Document Lookup</h2>
                  <p style={styles.panelSub}>Search by IPFS CID</p>
                </div>
              </div>
              <div style={styles.divider} />
              <VerifyPanel wallet={wallet} showToast={showToast} />
            </div>
          </div>

          {/* Right: Info Sidebar */}
          <div style={styles.sidebar} className="fade-in-delay-2">
            {/* How it Works */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={styles.sideTitle}>How Verification Works</h3>
              <div style={styles.divider} />
              <div style={styles.stepsList}>
                {[
                  { num: '1', text: 'A document owner uploads a file and stores its IPFS hash on the smart contract.' },
                  { num: '2', text: 'The contract admin (deployer) adds authorized verifier wallets — e.g., a university.' },
                  { num: '3', text: 'The verifier calls verifyDoc() on the contract, marking it as verified on-chain.' },
                  { num: '4', text: 'Anyone can look up any IPFS hash here to check verification status instantly.' },
                ].map((item) => (
                  <div key={item.num} style={styles.stepListItem}>
                    <div style={styles.stepNum}>{item.num}</div>
                    <p style={styles.stepText}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Status */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={styles.sideTitle}>Wallet Status</h3>
              <div style={styles.divider} />
              {wallet ? (
                <div style={styles.walletStatus}>
                  <div style={styles.walletConnected}>
                    <span className="pulse-dot" />
                    <span style={styles.walletText}>Connected</span>
                  </div>
                  <div style={styles.walletDetail}>
                    <p style={styles.detailLabel}>Address</p>
                    <code style={styles.detailValue}>{wallet.address}</code>
                  </div>
                  <div style={styles.walletDetail}>
                    <p style={styles.detailLabel}>Network</p>
                    <p style={styles.detailValue}>Chain ID: {String(wallet.network?.chainId || 'Unknown')}</p>
                  </div>
                </div>
              ) : (
                <div style={styles.walletDisconnected}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 7H3a2 2 0 00-2 2v6a2 2 0 002 2h18a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="var(--text-muted)" strokeWidth="2"/>
                    <circle cx="17" cy="12" r="1.5" fill="var(--text-muted)"/>
                  </svg>
                  <p style={styles.noWalletText}>Connect your wallet to perform verifications (write operations).</p>
                </div>
              )}
            </div>

            {/* Contract Info */}
            <div className="card">
              <h3 style={styles.sideTitle}>Contract Info</h3>
              <div style={styles.divider} />
              <div style={styles.contractInfo}>
                <div style={styles.contractRow}>
                  <span style={styles.contractLabel}>Network</span>
                  <span className="tag tag-pink">Localhost 8545</span>
                </div>
                <div style={styles.contractRow}>
                  <span style={styles.contractLabel}>Status</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="pulse-dot" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Live</span>
                  </div>
                </div>
              </div>
              <p style={styles.contractNote}>
                Deployed locally via Hardhat. Update CONTRACT_ADDRESS in config.js when deploying to Polygon Amoy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    paddingTop: '48px',
    paddingBottom: '80px',
    minHeight: 'calc(100vh - 64px)',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
  },
  header: {
    maxWidth: '600px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    background: 'var(--pink-light)',
    border: '1px solid var(--pink-border)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--pink)',
    marginBottom: '16px',
    letterSpacing: '0.03em',
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.8,
    maxWidth: '520px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '24px',
    alignItems: 'start',
  },
  mainPanel: {},
  sidebar: {},
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '4px',
  },
  panelIcon: {
    width: '40px',
    height: '40px',
    background: 'var(--gradient-pink)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 14px rgba(232, 121, 160, 0.4)',
  },
  panelTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  panelSub: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
    margin: '18px 0',
  },
  sideTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  stepListItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: '22px',
    height: '22px',
    background: 'var(--pink-light)',
    border: '1px solid var(--pink-border)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--pink)',
    flexShrink: 0,
    marginTop: '1px',
  },
  stepText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  walletStatus: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  walletConnected: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  walletText: {
    fontSize: '0.85rem',
    color: 'var(--success)',
    fontWeight: 600,
  },
  walletDetail: {
    background: 'var(--bg-glass)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
  },
  detailLabel: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  detailValue: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  walletDisconnected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    textAlign: 'center',
    padding: '16px',
  },
  noWalletText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  contractInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '12px',
  },
  contractRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contractLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  contractNote: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
    marginTop: '4px',
  },
}

export default DashboardPage
