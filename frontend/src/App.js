import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServicesPage from './pages/ServicesPage';
import AddServicePage from './pages/AddServicePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import DashboardClient from './pages/DashboardClient';
import DashboardAdmin from './pages/DashboardAdmin';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LegalMentionsPage from './pages/LegalMentionsPage';
function App() {
    return (
        <Router>
            <div id="root">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/services/:id" element={<ServiceDetailPage />} />
                        <Route path="/admin/add-service" element={<AddServicePage />} />
                        <Route path="/legal" element={<LegalMentionsPage />} />
                        <Route path="/dashboard/client" element={<PrivateRoute><DashboardClient /></PrivateRoute>} />
                        <Route path="/dashboard/admin" element={<PrivateRoute><DashboardAdmin /></PrivateRoute>} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}


export default App;
