import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box, CircularProgress, Container } from '@mui/material'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import NavBar from './components/NavBar'
import Home from './pages/Home'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tracking = lazy(() => import('./pages/Tracking'))
const Recipes = lazy(() => import('./pages/Recipes'))
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'))
const Exercises = lazy(() => import('./pages/Exercises'))
const ExerciseDetail = lazy(() => import('./pages/ExerciseDetail'))
const Tips = lazy(() => import('./pages/Tips'))
const AdminRecipes = lazy(() => import('./pages/admin/AdminRecipes'))
const AdminExercises = lazy(() => import('./pages/admin/AdminExercises'))
const AdminTips = lazy(() => import('./pages/admin/AdminTips'))

function AppRoutes() {
  return (
    <Container maxWidth="lg">
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <Tracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <Recipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <ProtectedRoute>
                <RecipeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises"
            element={
              <ProtectedRoute>
                <Exercises />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises/:id"
            element={
              <ProtectedRoute>
                <ExerciseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tips"
            element={
              <ProtectedRoute>
                <Tips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/recipes"
            element={
              <AdminRoute>
                <AdminRecipes />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/exercises"
            element={
              <AdminRoute>
                <AdminExercises />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tips"
            element={
              <AdminRoute>
                <AdminTips />
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>
    </Container>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh' }}>
          <NavBar />
          <AppRoutes />
        </Box>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
