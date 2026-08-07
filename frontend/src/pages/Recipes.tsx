import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import PageHeader from '../components/PageHeader'
import RecipeCard from '../components/RecipeCard'
import { useAuth } from '../context/AuthContext'
import {
  CATEGORY_LABELS,
  fetchRecipes,
  RECIPE_CATEGORIES,
  type Recipe,
  type RecipeCategory,
} from '../services/recipes'
import { BMI_CLASSIFICATIONS, calculateBMI, classifyBMI } from '../utils/bmi'

type CategoryFilter = 'all' | RecipeCategory

function Recipes() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<CategoryFilter>('all')

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const bmiId = useMemo(() => {
    if (!user?.weight || !user?.height) return null
    return classifyBMI(calculateBMI(user.weight, user.height)).id
  }, [user?.weight, user?.height])

  const bmiLabel = bmiId
    ? BMI_CLASSIFICATIONS.find((c) => c.id === bmiId)?.label
    : null

  const recommended = useMemo(
    () => (bmiId ? recipes.filter((r) => r.suitableFor.includes(bmiId)) : []),
    [recipes, bmiId],
  )

  const recommendedIds = useMemo(
    () => new Set(recommended.map((r) => r._id)),
    [recommended],
  )

  const visible = useMemo(
    () =>
      recipes.filter((r) =>
        filter === 'all'
          ? !recommendedIds.has(r._id)
          : r.category === filter,
      ),
    [recipes, filter, recommendedIds],
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
      <PageHeader title="Recetas saludables" />

      {bmiId && recommended.length > 0 && (
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2,
            p: 3,
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Recomendadas para tu IMC ({bmiLabel})
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            Estas recetas se ajustan a tu estado nutricional actual.
          </Typography>
          <Grid container spacing={2}>
            {recommended.map((recipe) => (
              <Grid key={recipe._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <RecipeCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <Chip
          label="Todos"
          clickable
          color={filter === 'all' ? 'primary' : 'default'}
          onClick={() => setFilter('all')}
        />
        {RECIPE_CATEGORIES.map((category) => (
          <Chip
            key={category}
            label={CATEGORY_LABELS[category]}
            clickable
            color={filter === category ? 'primary' : 'default'}
            onClick={() => setFilter(category)}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        {visible.map((recipe) => (
          <Grid key={recipe._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>

      {visible.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No hay recetas en esta categoría.
        </Typography>
      )}
    </Box>
  )
}

export default Recipes
