import { useEffect } from 'react'

const Toast = ({ message, type = 'success' }) => {
  const isSuccess = type === 'success'
  const isError = type === 'error'
  const isInfo = type === 'info'

  const iconColor = isSuccess
    ? 'var(--success)'
    : isError
    ? 'var(--error)'
    : 'var(--pink)'

  const bgColor = isSuccess
    ? 'rgba(74, 222, 128, 0.08)'
    : isError
    ? 'rgba(248, 113, 113, 0.08)'
    : 'var(--pink-light)'

  const borderColor = isSuccess
    ? 'rgba(74, 222, 128, 0.2)'
    : isError
    ? 'rgba(248, 113, 113, 0.2)'
    : 'var(--pink-border)'

  return (
    <div style={{ ...styles.container, background: bgColor, borderColor }}>
      <div style={{ ...styles.icon, color: iconColor }}>
        {isSuccess && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {isError && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
        {isInfo && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <span style={styles.message}>{message}</span>
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    maxWidth: '400px',
    animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  icon: { flexShrink: 0 },
  message: {
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    fontWeight: 500,
    lineHeight: 1.4,
  },
}

// Inject keyframe animation
const styleSheet = document.styleSheets[0]
try {
  styleSheet.insertRule(`
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `, styleSheet.cssRules.length)
} catch(e) {}

export default Toast
