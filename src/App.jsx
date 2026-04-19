import { useState } from 'react'
import Navbar from './components/Navbar'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import Toast from './components/Toast'

function App() {
  const [page, setPage] = useState('upload') // 'upload' | 'dashboard'
  const [wallet, setWallet] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4500)
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Navbar */}
      <Navbar
        page={page}
        setPage={setPage}
        wallet={wallet}
        setWallet={setWallet}
        showToast={showToast}
      />

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {page === 'upload' ? (
          <UploadPage wallet={wallet} showToast={showToast} />
        ) : (
          <DashboardPage wallet={wallet} showToast={showToast} />
        )}
      </main>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default App
