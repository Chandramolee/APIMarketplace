import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import SubmitApi from './pages/SubmitApi';
import ApiDetails from './pages/ApiDetails';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1a1d2d', color: '#fff' } }} />
      <Router>
        <div className="page-wrapper">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<LoginRegister />} />
            <Route path="/submit" element={<SubmitApi />} />
            <Route path="/api/:id" element={<ApiDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
