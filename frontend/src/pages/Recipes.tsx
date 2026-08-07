import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { fetchRecipes, type Recipe } from '../services/recipes'
import { imageUrl } from '../utils/image'
import PageHeader from '../components/PageHeader'

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
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
      <PageHeader title="Recetas saludables" />
      <Grid container spacing={3}>
        {recipes.map((recipe) => {
          const img = imageUrl(recipe.image)
          return (
            <Grid key={recipe._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea component={Link} to={`/recipes/${recipe._id}`}>
                  {img ? (
                    <CardMedia
                      component="img"
                      height="180"
                      image={img}
                      alt={recipe.title}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.light',
                      }}
                    >
                      <Typography variant="h6" color="primary.contrastText">
                        🍲
                      </Typography>
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="h6">{recipe.title}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {recipe.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default Recipes
