import { useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { updateProfile, changePassword } from '../services/auth'
import PageHeader from '../components/PageHeader'

function Profile() {
  const { user, setUser } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [age, setAge] = useState(user?.age?.toString() ?? '')
  const [weight, setWeight] = useState(user?.weight?.toString() ?? '')
  const [height, setHeight] = useState(user?.height?.toString() ?? '')
  const [sex, setSex] = useState(user?.sex ?? '')

  const [profileMsg, setProfileMsg] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)
  const [changing, setChanging] = useState(false)

  const toNumberOrNull = (value: string): number | null =>
    value.trim() === '' ? null : Number(value)

  const handleProfile = async (e: FormEvent) => {
    e.preventDefault()
    setProfileMsg(null)
    setProfileError(null)
    setSaving(true)
    try {
      const updated = await updateProfile({
        name,
        age: toNumberOrNull(age),
        weight: toNumberOrNull(weight),
        height: toNumberOrNull(height),
        sex: (sex || null) as 'male' | 'female' | 'other' | null,
      })
      setUser(updated)
      setProfileMsg('Perfil actualizado correctamente')
    } catch (err) {
      setProfileError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handlePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPwMsg(null)
    setPwError(null)
    if (newPassword !== confirm) {
      setPwError('Las contraseñas no coinciden')
      return
    }
    setChanging(true)
    try {
      const msg = await changePassword(currentPassword, newPassword)
      setPwMsg(msg)
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      setPwError((err as Error).message)
    } finally {
      setChanging(false)
    }
  }

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader title="Mi perfil" />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Información personal
              </Typography>
              <form onSubmit={handleProfile}>
                <TextField
                  label="Nombre"
                  fullWidth
                  required
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Correo"
                  fullWidth
                  margin="normal"
                  value={user?.email ?? ''}
                  disabled
                />
                <TextField
                  label="Edad"
                  type="number"
                  fullWidth
                  margin="normal"
                  slotProps={{ htmlInput: { min: 1, max: 120 } }}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Peso (kg)"
                      type="number"
                      fullWidth
                      margin="normal"
                      slotProps={{ htmlInput: { min: 1, max: 500, step: 0.1 } }}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Estatura (m)"
                      type="number"
                      fullWidth
                      margin="normal"
                      slotProps={{ htmlInput: { min: 0.5, max: 2.5, step: 0.01 } }}
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Sexo"
                  select
                  fullWidth
                  margin="normal"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <MenuItem value="">Sin especificar</MenuItem>
                  <MenuItem value="male">Masculino</MenuItem>
                  <MenuItem value="female">Femenino</MenuItem>
                  <MenuItem value="other">Otro</MenuItem>
                </TextField>
                {profileMsg && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {profileMsg}
                  </Alert>
                )}
                {profileError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {profileError}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={saving}
                  sx={{ mt: 3 }}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Cambiar contraseña
              </Typography>
              <form onSubmit={handlePassword}>
                <TextField
                  label="Contraseña actual"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                  label="Nueva contraseña"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  helperText="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  label="Confirmar nueva contraseña"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                {pwMsg && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {pwMsg}
                  </Alert>
                )}
                {pwError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {pwError}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={changing}
                  sx={{ mt: 3 }}
                >
                  {changing ? 'Actualizando...' : 'Actualizar contraseña'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile
