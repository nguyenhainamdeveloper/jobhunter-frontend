import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'

import HomePage from '../pages/public/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'

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
                path="/dashboard"
                element={
                    <DashboardLayout>
                        <DashboardPage />
                    </DashboardLayout>
                }
            />
        </Routes>
    )
}

export default AppRoutes