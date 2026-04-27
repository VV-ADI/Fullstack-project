import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Layout/Navbar.jsx'
import Login from './components/Auth/Login.jsx'
import Register from './components/Auth/Register.jsx'
import MapView from './components/Map/MapView.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import AlertHistory from './components/Alerts/AlertHistory.jsx'
import PrivateRoute from './components/Layout/PrivateRoute.jsx'

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const isMapPage = location.pathname === '/';

  return (
    <div className={`min-h-screen bg-background ${isMapPage ? 'h-screen overflow-hidden' : 'overflow-y-auto'}`}>
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? 'h-full' : isMapPage ? 'h-full' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MapView />
              </PrivateRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <PrivateRoute>
                <AlertHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="Admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!rounded-none !font-sans"
      />
    </div>
  )
}

export default App
