import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

import HomePage from '../pages/public/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import CompanyPage from '../pages/dashboard/CompanyPage'
import JobPage from '../pages/dashboard/JobPage'
import UserPage from '../pages/dashboard/UserPage'
import ResumePage from '../pages/dashboard/ResumePage'
import SkillPage from '../pages/dashboard/SkillPage'
import PublicJobPage from '../pages/public/PublicJobPage'
import PublicJobDetailPage from '../pages/public/PublicJobDetailPage'
import PublicCompanyPage from '../pages/public/PublicCompanyPage'

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
                path="/jobs"
                element={
                    <PublicLayout>
                        <PublicJobPage />
                    </PublicLayout>
                }
            />

            <Route
                path="/job/:id"
                element={
                    <PublicLayout>
                        <PublicJobDetailPage />
                    </PublicLayout>
                }
            />

            <Route
                path="/companies"
                element={
                    <PublicLayout>
                        <PublicCompanyPage />
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

            <Route
                path="/dashboard/job"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <JobPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/user"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <UserPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/resume"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <ResumePage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/skill"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <SkillPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes