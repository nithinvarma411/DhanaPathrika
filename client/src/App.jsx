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

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/details' element={<CompanyForm/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile' element={<Dashboard/>} />
        <Route path='/Bills' element={<BillingPage/>} />
        <Route path='/invoice-generator' element={<InvoiceGenerator/>} />
        <Route path='/invoice' element={<InvoicePage/>} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
