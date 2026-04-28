import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

import HomePage from '../pages/public/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import CompanyPage from '../pages/dashboard/CompanyPage'

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicLayout>
                        <HomePage />
                    </PublicLayout>
                }
            />

            <Route
                path="/login"
                element={
                    <PublicLayout>
                        <LoginPage />
                    </PublicLayout>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicLayout>
                        <RegisterPage />
                    </PublicLayout>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <DashboardPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/company"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <CompanyPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes