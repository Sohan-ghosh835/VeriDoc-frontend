import { useEffect, useState } from 'react'

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    error: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    info: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  }

  const colorMap = {
    success: { bg: '#f0fdf4', border: '#16a34a', color: '#15803d', barColor: '#16a34a' },
    error:   { bg: '#fef2f2', border: '#e84142', color: '#dc2626', barColor: '#e84142' },
    info:    { bg: '#ffffff', border: '#0a0a0a', color: '#0a0a0a', barColor: '#0a0a0a' },
  }

  const c = colorMap[type] || colorMap.info

  return (
    <div style={{
      ...styles.toast,
      background: c.bg,
      border: `2px solid ${c.border}`,
      color: c.color,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
    }}>
      {/* Progress bar */}
      <div style={{ ...styles.progressBar, background: c.barColor }} />

      <div style={styles.content}>
        <span style={{ color: c.color, flexShrink: 0 }}>{icons[type] || icons.info}</span>
        <p style={styles.text}>{message}</p>
        <button style={{ ...styles.close, color: c.color }} onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

const styles = {
  toast: {
    position: 'relative',
    minWidth: '320px',
    maxWidth: '420px',
    borderRadius: '6px',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    width: '100%',
    opacity: 0.3,
    animation: 'shrink 4s linear forwards',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
  },
  text: {
    flex: 1,
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
    fontFamily: "'DM Sans', sans-serif",
  },
  close: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    opacity: 0.6,
    transition: 'opacity 0.15s',
    flexShrink: 0,
  },
}

// Toast container
let toastId = 0
export const ToastContainer = ({ toasts, removeToast }) => (
  <div style={{
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'flex-end',
  }}>
    {toasts.map(t => (
      <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
    ))}
  </div>
)

export default Toast
