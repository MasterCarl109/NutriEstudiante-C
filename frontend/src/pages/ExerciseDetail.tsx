import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  fetchExercise,
  DIFFICULTY_LABELS,
  type Exercise,
} from '../services/exercises'
import { DIFFICULTY_COLORS } from '../utils/colors'

function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchExercise(id)
      .then(setExercise)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !exercise) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error ?? 'Ejercicio no encontrado'}
      </Alert>
    )
  }

  return (
    <Box sx={{ py: 4, maxWidth: 720, mx: 'auto' }}>
      <Button
        component={Link}
        to="/exercises"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Volver a ejercicios
      </Button>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {exercise.name}
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Chip label={exercise.duration} />
            <Chip
              label={`Dificultad: ${DIFFICULTY_LABELS[exercise.difficulty]}`}
              sx={{
                bgcolor: DIFFICULTY_COLORS[exercise.difficulty],
                color: 'white',
              }}
            />
          </Box>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {exercise.description}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Instrucciones
          </Typography>
          <List dense>
            {exercise.instructions.map((step, i) => (
              <ListItem key={i}>
                <ListItemText primary={`${i + 1}. ${step}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ExerciseDetail
