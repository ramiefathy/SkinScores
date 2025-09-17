import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';
import AppShell from './components/layout/AppShell';
import DashboardPage from './routes/dashboard/DashboardPage';
import HomePage from './routes/home/HomePage';
import LibraryPage from './routes/library/LibraryPage';
import NotFoundPage from './routes/NotFoundPage';
import RegisterPage from './routes/auth/RegisterPage';
import ResetPasswordPage from './routes/auth/ResetPasswordPage';
import SignInPage from './routes/auth/SignInPage';
import CalculatorRunnerPage from './routes/calculators/CalculatorRunnerPage';
import PatientsPage from './routes/patients/PatientsPage';
import PatientDetailPage from './routes/patients/PatientDetailPage';
import AnalyticsPage from './routes/analytics/AnalyticsPage';

const App = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="calculators/:slug" element={<CalculatorRunnerPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="patients/:patientId" element={<PatientDetailPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
      <Route path="auth" element={<PublicOnlyRoute />}>
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reset" element={<ResetPasswordPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
