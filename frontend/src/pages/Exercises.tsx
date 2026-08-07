import { useEffect, useMemo, useState } from 'react'
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
  Stack,
  Typography,
} from '@mui/material'
import PageHeader from '../components/PageHeader'
import {
  fetchExercises,
  DIFFICULTY_LABELS,
  GOAL_LABELS,
  GOALS,
  type Exercise,
  type Goal,
} from '../services/exercises'
import { DIFFICULTY_COLORS } from '../utils/colors'

type GoalFilter = 'all' | Goal

function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<GoalFilter>('all')

  useEffect(() => {
    fetchExercises()
      .then(setExercises)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(
    () =>
      filter === 'all'
        ? exercises
        : exercises.filter((e) => e.goal === filter),
    [exercises, filter],
  )

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

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <Chip
          label="Todos"
          clickable
          color={filter === 'all' ? 'primary' : 'default'}
          onClick={() => setFilter('all')}
        />
        {GOALS.map((goal) => (
          <Chip
            key={goal}
            label={GOAL_LABELS[goal]}
            clickable
            color={filter === goal ? 'primary' : 'default'}
            onClick={() => setFilter(goal)}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        {visible.map((exercise) => (
          <Grid key={exercise._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea
                component={Link}
                to={`/exercises/${exercise._id}`}
              >
                <CardContent>
                  <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                    <Chip
                      label={GOAL_LABELS[exercise.goal]}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
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

      {visible.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No hay ejercicios para este objetivo.
        </Typography>
      )}
    </Box>
  )
}

export default Exercises
