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
import {
  fetchExercises,
  DIFFICULTY_LABELS,
  type Exercise,
} from '../../services/exercises'
import {
  createExercise,
  updateExercise,
  deleteExercise,
  type ExerciseInput,
} from '../../services/admin'
import PageHeader from '../../components/PageHeader'

interface FormState {
  name: string
  description: string
  duration: string
  difficulty: Exercise['difficulty']
  instructions: string
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  duration: '',
  difficulty: 'media',
  instructions: '',
}

function toLines(value: string): string[] {
  return value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

function AdminExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetchExercises().then(setExercises).catch(() => undefined)
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
    setOpen(true)
  }

  const openEdit = (exercise: Exercise) => {
    setEditingId(exercise._id)
    setForm({
      name: exercise.name,
      description: exercise.description,
      duration: exercise.duration,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions.join('\n'),
    })
    setError(null)
    setOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const input: ExerciseInput = {
      name: form.name,
      description: form.description,
      duration: form.duration,
      difficulty: form.difficulty,
      instructions: toLines(form.instructions),
    }

    setSaving(true)
    try {
      if (editingId) {
        await updateExercise(editingId, input)
      } else {
        await createExercise(input)
      }
      setOpen(false)
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (exercise: Exercise) => {
    if (!window.confirm(`¿Eliminar el ejercicio "${exercise.name}"?`)) return
    try {
      await deleteExercise(exercise._id)
      load()
    } catch (err) {
      window.alert((err as Error).message)
    }
  }

  const set = (field: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader
        title="Administrar ejercicios"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Nuevo ejercicio
          </Button>
        }
      />

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Dificultad</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise._id}>
                <TableCell>{exercise.name}</TableCell>
                <TableCell>{exercise.duration}</TableCell>
                <TableCell>{DIFFICULTY_LABELS[exercise.difficulty]}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => openEdit(exercise)}
                    aria-label="Editar"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(exercise)}
                    aria-label="Eliminar"
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Editar ejercicio' : 'Nuevo ejercicio'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Nombre"
                  fullWidth
                  required
                  value={form.name}
                  onChange={set('name')}
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
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Duración"
                  fullWidth
                  placeholder="Ej: 30 minutos, 3 series de 12"
                  value={form.duration}
                  onChange={set('duration')}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Dificultad"
                  select
                  fullWidth
                  value={form.difficulty}
                  onChange={set('difficulty')}
                >
                  <MenuItem value="baja">{DIFFICULTY_LABELS.baja}</MenuItem>
                  <MenuItem value="media">{DIFFICULTY_LABELS.media}</MenuItem>
                  <MenuItem value="alta">{DIFFICULTY_LABELS.alta}</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Instrucciones (un paso por línea)"
                  fullWidth
                  multiline
                  minRows={4}
                  value={form.instructions}
                  onChange={set('instructions')}
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

export default AdminExercises
