import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import {
  fetchRecords,
  createRecord,
  deleteRecord,
  type WeightRecord,
} from '../services/tracking'
import { calculateBMI } from '../utils/bmi'
import PageHeader from '../components/PageHeader'

function Tracking() {
  const { user } = useAuth()
  const [records, setRecords] = useState<WeightRecord[]>([])
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().slice(0, 10)
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(today)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadRecords = () => {
    setLoading(true)
    fetchRecords()
      .then(setRecords)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadRecords, [])

  const chartData = useMemo(
    () =>
      [...records]
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
        .map((r) => ({
          date: new Date(r.date).toLocaleDateString('es', {
            day: '2-digit',
            month: 'short',
          }),
          weight: r.weight,
        })),
    [records],
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await createRecord(Number(weight), date)
      setWeight('')
      loadRecords()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteRecord(id)
    loadRecords()
  }

  const imcFor = (r: WeightRecord) =>
    user?.height ? calculateBMI(r.weight, user.height) : null

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader title="Mi progreso" />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Registrar peso
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Peso (kg)"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  slotProps={{ htmlInput: { min: 1, max: 500, step: 0.1 } }}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <TextField
                  label="Fecha"
                  type="date"
                  fullWidth
                  required
                  margin="normal"
                  slotProps={{ htmlInput: { max: today } }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={saving}
                  sx={{ mt: 3 }}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Evolución del peso
              </Typography>
              {loading ? (
                <Typography color="text.secondary">Cargando...</Typography>
              ) : records.length === 0 ? (
                <Typography color="text.secondary">
                  Aún no tienes registros. Guarda tu primer peso para ver tu
                  evolución.
                </Typography>
              ) : (
                <>
                  <Box sx={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={chartData}
                        margin={{ top: 8, right: 16, bottom: 8, left: -16 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          name="Peso (kg)"
                          stroke="#2e7d32"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                  <TableContainer sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Fecha</TableCell>
                          <TableCell align="right">Peso (kg)</TableCell>
                          {user?.height && (
                            <TableCell align="right">IMC estimado</TableCell>
                          )}
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[...records]
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime(),
                          )
                          .map((r) => {
                            const imc = imcFor(r)
                            return (
                              <TableRow key={r._id}>
                                <TableCell>
                                  {new Date(r.date).toLocaleDateString('es')}
                                </TableCell>
                                <TableCell align="right">{r.weight}</TableCell>
                                {imc && (
                                  <TableCell align="right">
                                    {imc.toFixed(1)}
                                  </TableCell>
                                )}
                                <TableCell align="right">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(r._id)}
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
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Tracking
