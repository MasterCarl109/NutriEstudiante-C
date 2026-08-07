import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', py: 10, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        {user ? `Hola, ${user.name}` : 'Conoce tu estado nutricional'}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Calcula tu IMC, descubre recomendaciones saludables y registra tu
        progreso.
        {!user && ' Crea tu cuenta para empezar.'}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate(user ? '/dashboard' : '/register')}
      >
        {user ? 'Ver mi estado nutricional' : 'Crear cuenta gratis'}
      </Button>
    </Box>
  )
}

export default Home
