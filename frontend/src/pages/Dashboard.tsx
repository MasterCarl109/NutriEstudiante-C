import { Link } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { BMI_CLASSIFICATIONS, calculateBMI, classifyBMI } from '../utils/bmi'
import { BMI_COLORS } from '../utils/colors'

function Dashboard() {
  const { user } = useAuth()

  const weight = user?.weight
  const height = user?.height

  if (!weight || !height) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', py: 8, textAlign: 'center' }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Calcula tu IMC
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Para conocer tu estado nutricional necesitas registrar tu peso y
              estatura en tu perfil.
            </Typography>
            <Button variant="contained" size="large" component={Link} to="/profile">
              Completar mi perfil
            </Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  const bmi = calculateBMI(weight, height)
  const classification = classifyBMI(bmi)
  const color = BMI_COLORS[classification.id]
  const position = Math.min(100, Math.max(0, ((bmi - 14) / (40 - 14)) * 100))

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Tu IMC
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, color }}>
            {bmi.toFixed(1)}
          </Typography>
          <Chip
            label={classification.label}
            sx={{ mt: 1, bgcolor: color, color: 'white', fontWeight: 600 }}
          />
          <Box sx={{ mt: 4, px: 1 }}>
            <LinearProgress
              variant="determinate"
              value={position}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { bgcolor: color },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              {BMI_CLASSIFICATIONS.map((c) => (
                <Typography key={c.id} variant="caption" color="text.secondary">
                  {c.id === 'obesity' ? `${c.min}+` : c.label}
                </Typography>
              ))}
            </Box>
          </Box>
          <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
            Tu IMC es un dato de referencia y no sustituye el diagnóstico de un
            profesional de la salud.
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Datos usados: {weight} kg y {height} m.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard
