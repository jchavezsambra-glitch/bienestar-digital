import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Carreras from './pages/Carreras/Carreras'
import CarreraDetail from './pages/Carreras/CarreraDetail'
import Anuncios from './pages/Anuncios/Anuncios'
import AnuncioDetail from './pages/Anuncios/AnuncioDetail'
import AdminPanel from './pages/Admin/AdminPanel'
import AdminCarreras from './pages/Admin/AdminCarreras'
import AdminAnuncios from './pages/Admin/AdminAnuncios'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="carreras" element={<Carreras />} />
        <Route path="carreras/:id" element={<CarreraDetail />} />
        <Route path="anuncios" element={<Anuncios />} />
        <Route path="anuncios/:id" element={<AnuncioDetail />} />
        
        {/* Rutas solo para profesores */}
        {user?.rol === 'profesor' && (
          <>
            <Route path="admin" element={<AdminPanel />} />
            <Route path="admin/carreras" element={<AdminCarreras />} />
            <Route path="admin/anuncios" element={<AdminAnuncios />} />
          </>
        )}
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App



