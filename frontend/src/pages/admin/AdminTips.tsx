import { useEffect, useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
import { fetchTips, type Tip } from '../../services/tips'
import {
  createTip,
  updateTip,
  deleteTip,
  type TipInput,
} from '../../services/admin'
import PageHeader from '../../components/PageHeader'

function AdminTips() {
  const [tips, setTips] = useState<Tip[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetchTips().then(setTips).catch(() => undefined)
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setError(null)
    setOpen(true)
  }

  const openEdit = (tip: Tip) => {
    setEditingId(tip._id)
    setTitle(tip.title)
    setContent(tip.content)
    setError(null)
    setOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const input: TipInput = { title, content }

    setSaving(true)
    try {
      if (editingId) {
        await updateTip(editingId, input)
      } else {
        await createTip(input)
      }
      setOpen(false)
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (tip: Tip) => {
    if (!window.confirm(`¿Eliminar el consejo "${tip.title}"?`)) return
    try {
      await deleteTip(tip._id)
      load()
    } catch (err) {
      window.alert((err as Error).message)
    }
  }

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader
        title="Administrar consejos"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Nuevo consejo
          </Button>
        }
      />

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Contenido</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tips.map((tip) => (
              <TableRow key={tip._id}>
                <TableCell>{tip.title}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tip.content}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEdit(tip)} aria-label="Editar">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(tip)}
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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Editar consejo' : 'Nuevo consejo'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Título"
              fullWidth
              required
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Contenido"
              fullWidth
              required
              multiline
              minRows={4}
              margin="normal"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
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

export default AdminTips
