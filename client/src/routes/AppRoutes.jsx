import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import BrowseEvents from '../pages/BrowseEvents';
import EventDetails from '../pages/EventDetails';

// Participant Pages
import ParticipantDashboard from '../pages/participant/ParticipantDashboard';
import MyRegistrations from '../pages/participant/MyRegistrations';
import Notifications from '../pages/participant/Notifications';

// Organizer Pages
import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import MyEvents from '../pages/organizer/MyEvents';
import CreateEditEvent from '../pages/organizer/CreateEditEvent';
import ManageAttendees from '../pages/organizer/ManageAttendees';
import EventAnalytics from '../pages/organizer/EventAnalytics';
import OrganizerPublicProfile from '../pages/organizer/OrganizerPublicProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageEvents from '../pages/admin/ManageEvents';

const ROLE_HOME = {
  participant: '/',
  organizer: '/',
  admin: '/',
};

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={currentUser ? <Navigate to={ROLE_HOME[currentUser.role]} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={currentUser ? <Navigate to={ROLE_HOME[currentUser.role]} replace /> : <RegisterPage />}
      />

      {/* Public Event & Organizer Routes */}
      <Route path="/events" element={<BrowseEvents />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/organizers/:id" element={<OrganizerPublicProfile />} />

      {/* Legacy Redirection Routes */}
      <Route path="/participant/browse" element={<Navigate to="/events" replace />} />
      <Route path="/participant/events/:id" element={<Navigate to="/events/:id" replace />} />

      {/* Participant Routes */}
      <Route path="/participant/dashboard" element={
        <ProtectedRoute allowedRoles={['participant']}><ParticipantDashboard /></ProtectedRoute>
      } />
      <Route path="/participant/registrations" element={
        <ProtectedRoute allowedRoles={['participant']}><MyRegistrations /></ProtectedRoute>
      } />
      <Route path="/participant/notifications" element={
        <ProtectedRoute allowedRoles={['participant']}><Notifications /></ProtectedRoute>
      } />

      {/* Organizer Routes */}
      <Route path="/organizer/dashboard" element={
        <ProtectedRoute allowedRoles={['organizer']}><OrganizerDashboard /></ProtectedRoute>
      } />
      <Route path="/organizer/events" element={
        <ProtectedRoute allowedRoles={['organizer']}><MyEvents /></ProtectedRoute>
      } />
      <Route path="/organizer/events/create" element={
        <ProtectedRoute allowedRoles={['organizer']}><CreateEditEvent /></ProtectedRoute>
      } />
      <Route path="/organizer/events/:id/edit" element={
        <ProtectedRoute allowedRoles={['organizer']}><CreateEditEvent /></ProtectedRoute>
      } />
      <Route path="/organizer/events/:id/attendees" element={
        <ProtectedRoute allowedRoles={['organizer']}><ManageAttendees /></ProtectedRoute>
      } />
      <Route path="/organizer/events/:id/analytics" element={
        <ProtectedRoute allowedRoles={['organizer']}><EventAnalytics /></ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>
      } />
      <Route path="/admin/events" element={
        <ProtectedRoute allowedRoles={['admin']}><ManageEvents /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
