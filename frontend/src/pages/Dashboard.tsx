import { useEffect, useMemo, useState } from 'react'
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
import {
  CATEGORY_LABELS,
  fetchRecipes,
  type Recipe,
} from '../services/recipes'

function Dashboard() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    fetchRecipes().then(setRecipes).catch(() => undefined)
  }, [])

  const weight = user?.weight
  const height = user?.height

  const bmiId = useMemo(() => {
    if (!weight || !height) return null
    return classifyBMI(calculateBMI(weight, height)).id
  }, [weight, height])

  const recommended = useMemo(
    () =>
      bmiId
        ? recipes.filter((r) => r.suitableFor.includes(bmiId)).slice(0, 3)
        : [],
    [recipes, bmiId],
  )

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

      {bmiId && recommended.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recomendaciones para ti
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recommended.map((recipe) => (
                <Box
                  key={recipe._id}
                  component={Link}
                  to="/recipes"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textDecoration: 'none',
                    p: 1.5,
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    {recipe.title}
                  </Typography>
                  <Chip
                    label={CATEGORY_LABELS[recipe.category]}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default Dashboard
