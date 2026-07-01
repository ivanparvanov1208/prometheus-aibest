import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { RoleRoute } from './components/routing/RoleRoute';
import { ScrollToHash } from './components/routing/ScrollToHash';
import { AuthProvider } from './context/AuthContext';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { EventsPage } from './pages/EventsPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RegisterPage } from './pages/RegisterPage';
import { RoleUnavailablePage } from './pages/RoleUnavailablePage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { EventCreatePage } from './pages/organizer/EventCreatePage';
import { EventEditPage } from './pages/organizer/EventEditPage';
import { EventPreviewPage } from './pages/organizer/EventPreviewPage';
import { EventRegistrationsPage } from './pages/organizer/EventRegistrationsPage';
import { OrganizerEventDetailsPage } from './pages/organizer/OrganizerEventDetailsPage';
import { OrganizerEventsPage } from './pages/organizer/OrganizerEventsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToHash />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="role-unavailable" element={<RoleUnavailablePage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<EventDetailsPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<RoleRoute allowedRoles={['student']} />}>
                <Route path="my-registrations" element={<MyRegistrationsPage />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['organizer']} />}>
                <Route path="organizer" element={<Navigate replace to="/organizer/events" />} />
                <Route path="organizer/events" element={<OrganizerEventsPage />} />
                <Route path="organizer/events/new" element={<EventCreatePage />} />
                <Route path="organizer/events/:eventId" element={<OrganizerEventDetailsPage />} />
                <Route path="organizer/events/:eventId/edit" element={<EventEditPage />} />
                <Route path="organizer/events/:eventId/preview" element={<EventPreviewPage />} />
                <Route path="organizer/events/:eventId/registrations" element={<EventRegistrationsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
