import { useCallback, useState } from 'react'

const UploadZone = ({ onFileSelect, uploading }) => {
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFile = useCallback((file) => {
    if (!file) return
    const allowed = ['application/pdf', 'text/plain']
    if (!allowed.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
      alert('Only PDF and TXT files are supported.')
      return
    }
    setSelectedFile(file)
    onFileSelect(file)
  }, [onFileSelect])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const onInputChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  return (
    <div>
      <label
        id="upload-dropzone"
        htmlFor="file-input"
        style={{
          ...styles.zone,
          ...(dragging ? styles.zoneDragging : {}),
          ...(uploading ? styles.zoneUploading : {}),
          cursor: uploading ? 'not-allowed' : 'pointer',
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.txt"
          style={{ display: 'none' }}
          onChange={onInputChange}
          disabled={uploading}
        />

        {uploading ? (
          <div style={styles.uploadingState}>
            <div style={styles.spinnerLarge} />
            <p style={styles.uploadingText}>Processing document...</p>
            <p style={styles.uploadingSub}>AI is analyzing your file</p>
          </div>
        ) : selectedFile ? (
          <div style={styles.filePreview}>
            <div style={styles.fileIconBox}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#e84142" strokeWidth="1.5"/>
                <polyline points="14 2 14 8 20 8" stroke="#e84142" strokeWidth="1.5"/>
              </svg>
            </div>
            <div style={styles.fileInfo}>
              <p style={styles.fileName}>{selectedFile.name}</p>
              <p style={styles.fileSize}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <span className="tag tag-red">Ready</span>
          </div>
        ) : (
          <div style={styles.idleState}>
            <div style={styles.uploadIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"/>
                <polyline points="17 8 12 3 7 8" stroke="#e84142" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="#e84142" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={styles.dropText}>DROP FILE HERE</p>
            <p style={styles.dropSub}>or click to browse</p>
            <div style={styles.supportedTypes}>
              <span className="tag tag-grey">PDF</span>
              <span className="tag tag-grey">TXT</span>
            </div>
          </div>
        )}
      </label>
    </div>
  )
}

const styles = {
  zone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    border: '2px dashed #e5e5e5',
    borderRadius: '8px',
    padding: '40px 24px',
    transition: 'all 0.18s ease',
    background: '#fafafa',
    userSelect: 'none',
  },
  zoneDragging: {
    borderColor: '#e84142',
    background: 'rgba(232, 65, 66, 0.04)',
    borderStyle: 'solid',
  },
  zoneUploading: {
    borderColor: '#0a0a0a',
    borderStyle: 'solid',
  },
  idleState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  uploadIcon: {
    width: '72px',
    height: '72px',
    background: '#ffffff',
    border: '2px solid #e5e5e5',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    boxShadow: '2px 2px 0px #e5e5e5',
  },
  dropText: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 800,
    fontSize: '1rem',
    color: '#0a0a0a',
    letterSpacing: '0.08em',
  },
  dropSub: {
    fontSize: '0.82rem',
    color: '#999',
    fontFamily: "'DM Sans', sans-serif",
  },
  supportedTypes: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    padding: '8px',
  },
  fileIconBox: {
    width: '56px',
    height: '56px',
    background: '#fff',
    border: '2px solid #e5e5e5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
    textAlign: 'left',
    overflow: 'hidden',
  },
  fileName: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#0a0a0a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: "'DM Sans', sans-serif",
  },
  fileSize: {
    fontSize: '0.75rem',
    color: '#999',
    fontFamily: "'DM Mono', monospace",
    marginTop: '2px',
  },
  uploadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  spinnerLarge: {
    width: '44px',
    height: '44px',
    border: '3px solid #e5e5e5',
    borderTopColor: '#e84142',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  uploadingText: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#0a0a0a',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '-0.01em',
  },
  uploadingSub: {
    fontSize: '0.8rem',
    color: '#999',
    fontFamily: "'DM Sans', sans-serif",
  },
}

export default UploadZone
