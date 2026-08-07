import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined'
import { useAuth } from '../context/AuthContext'

interface NavLink {
  label: string
  to: string
}

const CONTENT_LINKS: NavLink[] = [
  { label: 'Mi estado', to: '/dashboard' },
  { label: 'Mi progreso', to: '/tracking' },
  { label: 'Recetas', to: '/recipes' },
  { label: 'Ejercicios', to: '/exercises' },
  { label: 'Consejos', to: '/tips' },
]

const ADMIN_LINKS: NavLink[] = [
  { label: 'Recetas', to: '/admin/recipes' },
  { label: 'Ejercicios', to: '/admin/exercises' },
  { label: 'Consejos', to: '/admin/tips' },
]

function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [adminAnchor, setAdminAnchor] = useState<null | HTMLElement>(null)
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname === to || location.pathname.startsWith(`${to}/`)
  }

  const isAuthRoute =
    location.pathname === '/login' || location.pathname === '/register'

  const anyAdminActive = ADMIN_LINKS.some((link) => isActive(link.to))

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : ''

  const renderDrawerLink = (link: NavLink) => (
    <ListItem key={link.to} disablePadding>
      <ListItemButton
        component={Link}
        to={link.to}
        selected={isActive(link.to)}
        onClick={() => setDrawerOpen(false)}
      >
        <ListItemText primary={link.label} />
      </ListItemButton>
    </ListItem>
  )

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ gap: 1 }}>
        <SpaOutlinedIcon color="primary" sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mr: 2 }}
          color="primary"
          component={Link}
          to="/"
          style={{ textDecoration: 'none' }}
        >
          NutriEstudiante
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          edge="end"
          aria-label="Abrir menú"
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {user ? (
            <>
              {CONTENT_LINKS.map((link) => (
                <Button
                  key={link.to}
                  component={Link}
                  to={link.to}
                  color="primary"
                  variant={isActive(link.to) ? 'contained' : 'text'}
                  size="small"
                >
                  {link.label}
                </Button>
              ))}
              {user.role === 'admin' && (
                <>
                  <Button
                    color="warning"
                    variant={anyAdminActive ? 'contained' : 'text'}
                    size="small"
                    onClick={(e) => setAdminAnchor(e.currentTarget)}
                  >
                    Admin
                  </Button>
                  <Menu
                    anchorEl={adminAnchor}
                    open={Boolean(adminAnchor)}
                    onClose={() => setAdminAnchor(null)}
                  >
                    {ADMIN_LINKS.map((link) => (
                      <MenuItem
                        key={link.to}
                        component={Link}
                        to={link.to}
                        onClick={() => setAdminAnchor(null)}
                      >
                        {link.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
              <Tooltip title={user.name}>
                <Button
                  size="small"
                  startIcon={
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      {initials}
                    </Avatar>
                  }
                  onClick={(e) => setProfileAnchor(e.currentTarget)}
                >
                  <Box
                    component="span"
                    sx={{ display: { xs: 'none', lg: 'inline' } }}
                  >
                    {user.name}
                  </Box>
                </Button>
              </Tooltip>
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={() => setProfileAnchor(null)}
                >
                  Mi perfil
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setProfileAnchor(null)
                    handleLogout()
                  }}
                >
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </>
          ) : (
            !isAuthRoute && (
              <>
                <Button color="primary" component={Link} to="/login">
                  Iniciar sesión
                </Button>
                <Button variant="contained" component={Link} to="/register">
                  Registrarse
                </Button>
              </>
            )
          )}
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 260 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
            <SpaOutlinedIcon color="primary" />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
              color="primary"
              component={Link}
              to="/"
              onClick={() => setDrawerOpen(false)}
              style={{ textDecoration: 'none' }}
            >
              NutriEstudiante
            </Typography>
          </Box>
          <Divider />
          <List>
            {user ? (
              <>
                {CONTENT_LINKS.map(renderDrawerLink)}
                {user.role === 'admin' && (
                  <>
                    <Typography
                      variant="overline"
                      sx={{ px: 2, pt: 1 }}
                      color="text.secondary"
                    >
                      Administración
                    </Typography>
                    {ADMIN_LINKS.map(renderDrawerLink)}
                  </>
                )}
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/profile"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary="Mi perfil" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setDrawerOpen(false)
                      handleLogout()
                    }}
                  >
                    <ListItemText primary="Cerrar sesión" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              !isAuthRoute && (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/login"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemText primary="Iniciar sesión" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/register"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemText primary="Registrarse" />
                    </ListItemButton>
                  </ListItem>
                </>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  )
}

export default NavBar
