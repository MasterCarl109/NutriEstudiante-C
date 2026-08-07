import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { CircularProgress, Box, Alert } from '@mui/material'
import { useAuth } from '../context/AuthContext'

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        No tienes permisos de administrador.
      </Alert>
    )
  }

  return children
}

export default AdminRoute
