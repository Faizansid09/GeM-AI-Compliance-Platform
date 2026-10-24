import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { ProfileSetupPage } from '../pages/ProfileSetupPage';
import { HomePage } from '../pages/HomePage';
import { BidVerificationPage } from '../pages/BidVerificationPage';
import { BiddersPage } from '../pages/BiddersPage';
import { BidderDetailPage } from '../pages/BidderDetailPage';
import { DocumentsPage } from '../pages/DocumentsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

/**
 * Application route definitions.
 *
 * Public routes: /login
 *
 * Auth-only (incomplete profile allowed): /profile-setup
 *
 * Fully protected (auth + complete profile): /home and all sub-routes
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Auth required, profile may be incomplete */}
      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute allowIncompleteProfile>
            <ProfileSetupPage />
          </ProtectedRoute>
        }
      />

      {/* Fully protected routes inside AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/bid-verification" element={<BidVerificationPage />} />
        <Route path="/bidders" element={<BiddersPage />} />
        <Route path="/bidders/:id" element={<BidderDetailPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/audit-trail" element={<Navigate to="/home" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Root → home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
