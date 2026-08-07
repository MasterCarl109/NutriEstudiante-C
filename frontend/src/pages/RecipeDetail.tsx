import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { fetchRecipe, type Recipe } from '../services/recipes'
import { imageUrl } from '../utils/image'

function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchRecipe(id)
      .then(setRecipe)
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

  if (error || !recipe) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error ?? 'Receta no encontrada'}
      </Alert>
    )
  }

  const img = imageUrl(recipe.image)
  const nutrition = recipe.nutrition
  const hasNutrition =
    nutrition && Object.values(nutrition).some((v) => v > 0)

  return (
    <Box sx={{ py: 4, maxWidth: 800, mx: 'auto' }}>
      <Button
        component={Link}
        to="/recipes"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Volver a recetas
      </Button>

      <Card>
        {img && (
          <CardMedia
            component="img"
            height="260"
            image={img}
            alt={recipe.title}
          />
        )}
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {recipe.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {recipe.description}
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Ingredientes
              </Typography>
              <List dense>
                {recipe.ingredients.map((item, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Preparación
              </Typography>
              <List dense>
                {recipe.instructions.map((step, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={`${i + 1}. ${step}`} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>

          {hasNutrition && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Información nutricional (por porción)
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Calorías</TableCell>
                      <TableCell align="right">Proteínas</TableCell>
                      <TableCell align="right">Carbohidratos</TableCell>
                      <TableCell align="right">Grasas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{nutrition.calories} kcal</TableCell>
                      <TableCell align="right">{nutrition.protein} g</TableCell>
                      <TableCell align="right">{nutrition.carbs} g</TableCell>
                      <TableCell align="right">{nutrition.fat} g</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default RecipeDetail
