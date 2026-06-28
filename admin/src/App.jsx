import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Banners from './pages/Banners';
import Projects from './pages/Projects';
import Orders from './pages/Orders';

function ProtectedRoute({ children }) {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { admin } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products"   element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="banners"    element={<Banners />} />
        <Route path="projects"   element={<Projects />} />
        <Route path="orders"     element={<Orders />} />
      </Route>
    </Routes>
  );
}
