import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPrompt from './components/InstallPrompt';
import ErrorBoundary from './components/ErrorBoundary';
import CookieConsent from './components/CookieConsent';

// Lazy loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FieldDashboard = lazy(() => import('./pages/FieldDashboard'));
const TrackDashboard = lazy(() => import('./pages/TrackDashboard'));
const MyCourses = lazy(() => import('./pages/MyCourses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Search = lazy(() => import('./pages/Search'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Certificate = lazy(() => import('./pages/Certificate'));
const Discussion = lazy(() => import('./pages/Discussion'));
const AllMyCourses = lazy(() => import('./pages/AllMyCourses'));
const Profile = lazy(() => import('./pages/Profile'));
const SuperAdminPanel = lazy(() => import('./pages/SuperAdminPanel'));
const MyCertificates = lazy(() => import('./pages/MyCertificates'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const TermsAndPrivacy = lazy(() => import('./pages/TermsAndPrivacy'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const CareerRoadmap = lazy(() => import('./pages/CareerRoadmap'));
const Gamification = lazy(() => import('./pages/Gamification'));
const LiveClasses = lazy(() => import('./pages/LiveClasses'));
const Assignments = lazy(() => import('./pages/Assignments'));
const PeerReview = lazy(() => import('./pages/PeerReview'));
const CoursePreview = lazy(() => import('./pages/CoursePreview'));
const Subscription = lazy(() => import('./pages/Subscription'));
const ServerError = lazy(() => import('./pages/ServerError'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <InstallPrompt />
          <CookieConsent />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/preview/:courseId" element={<CoursePreview />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<TermsAndPrivacy />} />
            <Route path="/cookies" element={<CookiePolicy />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>} />
            <Route path="/mycourses" element={<ProtectedRoute><Layout><AllMyCourses /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute><Layout><MyCertificates /></Layout></ProtectedRoute>} />
            <Route path="/mycertificates" element={<ProtectedRoute><Layout><MyCertificates /></Layout></ProtectedRoute>} />
            <Route path="/roadmaps" element={<ProtectedRoute><Layout><CareerRoadmap /></Layout></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Layout><Leaderboard /></Layout></ProtectedRoute>} />
            <Route path="/gamification" element={<ProtectedRoute><Layout><Gamification /></Layout></ProtectedRoute>} />
            <Route path="/live-classes" element={<ProtectedRoute><Layout><LiveClasses /></Layout></ProtectedRoute>} />
            <Route path="/assignments/:trackId" element={<ProtectedRoute><Layout><Assignments /></Layout></ProtectedRoute>} />
            <Route path="/peer-review" element={<ProtectedRoute><Layout><PeerReview /></Layout></ProtectedRoute>} />
            <Route path="/field/:fieldId" element={<ProtectedRoute><Layout><FieldDashboard /></Layout></ProtectedRoute>} />
            <Route path="/field/:fieldId/track/:trackId" element={<ProtectedRoute><Layout><TrackDashboard /></Layout></ProtectedRoute>} />
            <Route path="/field/:fieldId/track/:trackId/courses" element={<ProtectedRoute><Layout><MyCourses /></Layout></ProtectedRoute>} />
            <Route path="/field/:fieldId/track/:trackId/course/:courseId" element={<ProtectedRoute><Layout><CourseDetail /></Layout></ProtectedRoute>} />
            <Route path="/field/:fieldId/track/:trackId/quiz" element={<ProtectedRoute><Layout><Quiz /></Layout></ProtectedRoute>} />
            <Route path="/field/:fieldId/track/:trackId/certificate" element={<ProtectedRoute><Layout><Certificate /></Layout></ProtectedRoute>} />
            <Route path="/field/:fieldId/track/:trackId/discussion" element={<ProtectedRoute><Layout><Discussion /></Layout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><Layout><Analytics /></Layout></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Layout><Subscription /></Layout></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><Layout><AdminPanel /></Layout></ProtectedRoute>} />

            {/* Super Admin Routes */}
            <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['superadmin']}><Layout><SuperAdminPanel /></Layout></ProtectedRoute>} />

            {/* 500 */}
            <Route path="/500" element={<ServerError />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
