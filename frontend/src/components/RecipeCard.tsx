import { Link } from 'react-router-dom'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material'
import { CATEGORY_LABELS, type Recipe } from '../services/recipes'
import { imageUrl } from '../utils/image'

interface RecipeCardProps {
  recipe: Recipe
}

function RecipeCard({ recipe }: RecipeCardProps) {
  const img = imageUrl(recipe.image)

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea component={Link} to={`/recipes/${recipe._id}`}>
        {img ? (
          <CardMedia component="img" height="180" image={img} alt={recipe.title} />
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
          <Box sx={{ mb: 1 }}>
            <Chip
              label={CATEGORY_LABELS[recipe.category]}
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>
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
  )
}

export default RecipeCard
