import { useState, useRef } from 'react'

const UploadZone = ({ onFileSelect, uploading }) => {
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const inputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) selectFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) selectFile(file)
  }

  const selectFile = (file) => {
    setSelectedFile(file)
  }

  const handleSubmit = () => {
    if (selectedFile) onFileSelect(selectedFile)
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return '📄'
    if (type.startsWith('text/')) return '📝'
    return '📁'
  }

  return (
    <div style={styles.wrapper}>
      {/* Drop Zone */}
      <div
        id="upload-dropzone"
        style={{
          ...styles.dropZone,
          ...(dragging ? styles.dropZoneDragging : {}),
          ...(selectedFile ? styles.dropZoneHasFile : {}),
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md"
          onChange={handleChange}
          style={{ display: 'none' }}
          id="file-input"
        />

        {!selectedFile ? (
          // Empty state
          <div style={styles.emptyState}>
            <div style={styles.uploadIconWrapper}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="var(--pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 8 12 3 7 8" stroke="var(--pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="var(--pink)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={styles.dropText}>
              {dragging ? 'Drop it here!' : 'Drag & drop your document'}
            </p>
            <p style={styles.dropSubtext}>or click to browse</p>
            <div style={styles.supportedTypes}>
              <span className="tag tag-grey">PDF</span>
              <span className="tag tag-grey">TXT</span>
              <span className="tag tag-grey">MD</span>
              <span className="tag tag-grey">Max 5MB</span>
            </div>
          </div>
        ) : (
          // File selected state
          <div style={styles.filePreview}>
            <div style={styles.fileIcon}>{getFileIcon(selectedFile.type)}</div>
            <div style={styles.fileInfo}>
              <p style={styles.fileName}>{selectedFile.name}</p>
              <p style={styles.fileSize}>{formatSize(selectedFile.size)}</p>
            </div>
            <button
              style={styles.clearBtn}
              onClick={(e) => { e.stopPropagation(); clearFile() }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Process Button */}
      {selectedFile && (
        <button
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '16px' }}
          onClick={handleSubmit}
          disabled={uploading}
          id="process-document-btn"
        >
          {uploading ? (
            <><span className="spinner" /> Processing document...</>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Analyze & Summarize with AI
            </>
          )}
        </button>
      )}
    </div>
  )
}

const styles = {
  wrapper: { width: '100%' },
  dropZone: {
    border: '2px dashed var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'var(--transition)',
    background: 'var(--bg-glass)',
  },
  dropZoneDragging: {
    borderColor: 'var(--pink)',
    background: 'var(--pink-light)',
    boxShadow: 'var(--shadow-pink)',
    transform: 'scale(1.01)',
  },
  dropZoneHasFile: {
    borderStyle: 'solid',
    borderColor: 'var(--pink-border)',
    background: 'var(--pink-light)',
    cursor: 'default',
    padding: '24px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  uploadIconWrapper: {
    width: '68px',
    height: '68px',
    background: 'var(--pink-light)',
    border: '1px solid var(--pink-border)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  dropText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  dropSubtext: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  supportedTypes: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '8px',
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'left',
  },
  fileIcon: { fontSize: '2.5rem' },
  fileInfo: { flex: 1, minWidth: 0 },
  fileName: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileSize: { fontSize: '0.8rem', color: 'var(--text-secondary)' },
  clearBtn: {
    padding: '8px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
    flexShrink: 0,
  },
}

export default UploadZone
