import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import {
  fetchExercises,
  DIFFICULTY_LABELS,
  type Exercise,
} from '../services/exercises'
import { DIFFICULTY_COLORS } from '../utils/colors'
import PageHeader from '../components/PageHeader'

function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExercises()
      .then(setExercises)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader title="Ejercicios recomendados" />
      <Grid container spacing={3}>
        {exercises.map((exercise) => (
          <Grid key={exercise._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea
                component={Link}
                to={`/exercises/${exercise._id}`}
              >
                <CardContent>
                  <Typography variant="h6">{exercise.name}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mt: 1,
                    }}
                  >
                    {exercise.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Chip label={exercise.duration} size="small" />
                    <Chip
                      label={`Dificultad: ${DIFFICULTY_LABELS[exercise.difficulty]}`}
                      size="small"
                      sx={{
                        bgcolor: DIFFICULTY_COLORS[exercise.difficulty],
                        color: 'white',
                      }}
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Exercises
