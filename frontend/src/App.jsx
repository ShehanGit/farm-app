import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Crops from './pages/Crops';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CropDetail from './pages/CropDetail';

import { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = '/api';  // Using Vite proxy

function PrivateLayout({ children, onLogout }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onLogout={onLogout} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  };

  if (auth === null) return <div className="p-8 text-center">Loading...</div>;
  return auth ? (
    <PrivateLayout onLogout={handleLogout}>{children}</PrivateLayout>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/crops" element={<PrivateRoute><Crops /></PrivateRoute>} />
      <Route path="/crops/:id" element={<PrivateRoute><CropDetail /></PrivateRoute>} />  {/* New */}
    </Routes>
    </BrowserRouter>
  );
}

export default App;