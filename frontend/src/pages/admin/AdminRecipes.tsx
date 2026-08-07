import { useEffect, useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { fetchRecipes, type Recipe } from '../../services/recipes'
import {
  CATEGORY_LABELS,
  RECIPE_CATEGORIES,
  type BmiTarget,
  type RecipeCategory,
} from '../../services/recipes'
import { BMI_CLASSIFICATIONS } from '../../utils/bmi'
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  type RecipeInput,
} from '../../services/admin'
import { imageUrl, isValidImagePath } from '../../utils/image'
import PageHeader from '../../components/PageHeader'

interface FormState {
  title: string
  description: string
  ingredients: string
  instructions: string
  calories: string
  protein: string
  carbs: string
  fat: string
  category: string
  suitableFor: BmiTarget[]
  image: string
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  category: 'almuerzo',
  suitableFor: [],
  image: '',
}

function toLines(value: string): string[] {
  return value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

function AdminRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetchRecipes().then(setRecipes).catch(() => undefined)
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
    setOpen(true)
  }

  const openEdit = (recipe: Recipe) => {
    setEditingId(recipe._id)
    setForm({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions.join('\n'),
      calories: recipe.nutrition?.calories?.toString() ?? '',
      protein: recipe.nutrition?.protein?.toString() ?? '',
      carbs: recipe.nutrition?.carbs?.toString() ?? '',
      fat: recipe.nutrition?.fat?.toString() ?? '',
      category: recipe.category ?? 'almuerzo',
      suitableFor: recipe.suitableFor ?? [],
      image: recipe.image ?? '',
    })
    setError(null)
    setOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.image && !isValidImagePath(form.image)) {
      setError('Imagen inválida. Usa /uploads/archivo.jpg (jpg, jpeg, png, webp, gif)')
      return
    }

    const input: RecipeInput = {
      title: form.title,
      description: form.description,
      ingredients: toLines(form.ingredients),
      instructions: toLines(form.instructions),
      nutrition: {
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
      },
      category: form.category as RecipeCategory,
      suitableFor: form.suitableFor,
      image: form.image,
    }

    setSaving(true)
    try {
      if (editingId) {
        await updateRecipe(editingId, input)
      } else {
        await createRecipe(input)
      }
      setOpen(false)
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (recipe: Recipe) => {
    if (!window.confirm(`¿Eliminar la receta "${recipe.title}"?`)) return
    try {
      await deleteRecipe(recipe._id)
      load()
    } catch (err) {
      window.alert((err as Error).message)
    }
  }

  const set =
    (field: Exclude<keyof FormState, 'suitableFor'>) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader
        title="Administrar recetas"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Nueva receta
          </Button>
        }
      />

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Ingredientes</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe) => {
              const img = imageUrl(recipe.image)
              return (
                <TableRow key={recipe._id}>
                  <TableCell>
                    {img ? (
                      <Box
                        component="img"
                        src={img}
                        alt={recipe.title}
                        sx={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 1 }}
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>{recipe.title}</TableCell>
                  <TableCell>{recipe.ingredients.length}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(recipe)} aria-label="Editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(recipe)}
                      aria-label="Eliminar"
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Editar receta' : 'Nueva receta'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Título"
                  fullWidth
                  required
                  value={form.title}
                  onChange={set('title')}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Descripción"
                  fullWidth
                  multiline
                  minRows={2}
                  value={form.description}
                  onChange={set('description')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Ingredientes (uno por línea)"
                  fullWidth
                  multiline
                  minRows={4}
                  value={form.ingredients}
                  onChange={set('ingredients')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Preparación (un paso por línea)"
                  fullWidth
                  multiline
                  minRows={4}
                  value={form.instructions}
                  onChange={set('instructions')}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  label="Calorías"
                  type="number"
                  fullWidth
                  value={form.calories}
                  onChange={set('calories')}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  label="Proteínas (g)"
                  type="number"
                  fullWidth
                  value={form.protein}
                  onChange={set('protein')}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  label="Carbohidratos (g)"
                  type="number"
                  fullWidth
                  value={form.carbs}
                  onChange={set('carbs')}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  label="Grasas (g)"
                  type="number"
                  fullWidth
                  value={form.fat}
                  onChange={set('fat')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Categoría"
                  select
                  fullWidth
                  value={form.category}
                  onChange={set('category')}
                >
                  {RECIPE_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Recomendada para (IMC)"
                  select
                  fullWidth
                  slotProps={{ select: { multiple: true } }}
                  value={form.suitableFor}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      suitableFor: e.target.value as unknown as BmiTarget[],
                    }))
                  }
                >
                  {BMI_CLASSIFICATIONS.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Imagen (ruta /uploads/archivo.jpg)"
                  fullWidth
                  value={form.image}
                  onChange={set('image')}
                />
              </Grid>
            </Grid>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default AdminRecipes
