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

function App() {

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/details' element={<CompanyForm/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile' element={<Dashboard/>} />
        <Route path='/Bills' element={<BillingPage/>} />
        <Route path='/invoice-generator' element={<InvoiceGenerator/>} />
        <Route path='/invoice' element={<InvoicePage/>} />
        <Route path='/stock-maintenance' element={<StockMaintainance/>} />
        <Route path='/add-stock' element={<AddStock/>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={1000} />
    </BrowserRouter>
  );
}

export default App;
