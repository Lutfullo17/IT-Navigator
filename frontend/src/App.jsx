import { BrowserRouter, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import MentorWidget from './components/MentorWidget';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Directions from './pages/Directions';
import DirectionDetail from './pages/DirectionDetail';
import Test from './pages/Test';
import Tasks from './pages/Tasks';
import Roadmap from './pages/Roadmap';
import Progress from './pages/Progress';
import './styles/global.css';
import './styles/home.css';
import './styles/auth.css';
import './styles/directions.css';
import './styles/test.css';
import './styles/mentor.css';
import './styles/tasks.css';
import './styles/roadmap.css';
import './styles/navbar.css';
import './styles/progress.css';

function RootRedirect() {
  const { loggedIn } = useAuth();
  return <Navigate to={loggedIn ? '/home' : '/register'} replace />;
}

function Layout() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <div key={location.pathname} className="page-wrapper">
        <Outlet />
      </div>
      <MentorWidget />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/directions" element={<ProtectedRoute><Directions /></ProtectedRoute>} />
            <Route path="/directions/:slug" element={<ProtectedRoute><DirectionDetail /></ProtectedRoute>} />

            <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
