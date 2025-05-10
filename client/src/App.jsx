import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import CompanyForm from './pages/CompanyForm';
import Dashboard from './pages/Dashboard';
import InvoicePage from './pages/InvoicePage';
import BillingPage from './pages/BillingPage';
import InvoiceGenerator from './pages/InvoiceGenerator';
import StockMaintainance from './pages/StockMaintainance';
import AddStock from './pages/AddStock';
import NotFound from './pages/NotFound';
import JoinSandbox from './pages/JoinSandbox';
import SendMessage from './pages/SendMessage';
import Notification from './pages/Notification';
import PasswordRecovery from './pages/PasswordRecovery';

import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/details' element={<CompanyForm />} />

        {/* Protected Routes */}
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/Bills'
          element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/invoice-generator'
          element={
            <ProtectedRoute>
              <InvoiceGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path='/invoice'
          element={
            <ProtectedRoute>
              <InvoicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/stock-maintenance'
          element={
            <ProtectedRoute>
              <StockMaintainance />
            </ProtectedRoute>
          }
        />
        <Route
          path='/notification'
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path='/add-stock'
          element={
            <ProtectedRoute>
              <AddStock />
            </ProtectedRoute>
          }
        />

        <Route path='/password-recovery' element={<PasswordRecovery />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={1000} />
    </BrowserRouter>
  );
}

export default App;
