import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { toast } from 'react-toastify';
import dueStamp1 from '../assets/due1.png';
import dueStamp2 from '../assets/due2.png';
import paidStamp1 from '../assets/paid1.png';
import paidStamp2 from '../assets/paid2.png';
import bg from '../assets/bg.jpg';

function StampTemplate() {
  const [currentThemes, setCurrentThemes] = useState({ PaidTheme: '1', DueTheme: '1' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCurrentThemes();
  }, []);

  const fetchCurrentThemes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/getInvoices`,
        { withCredentials: true }
      );
      setCurrentThemes(response.data.themes);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Failed to load current themes');
    }
  };

  const handleThemeUpdate = async (type, value) => {
    if (isUpdating) return; // Prevent multiple requests

    if ((type === 'paid' && currentThemes.PaidTheme === value) || 
        (type === 'due' && currentThemes.DueTheme === value)) {
      return;
    }

    try {
      setIsUpdating(true);
      const updateData = type === 'paid' 
        ? { PaidTheme: value } 
        : { DueTheme: value };

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/updateTheme`,
        updateData,
        { withCredentials: true }
      );
      
      setCurrentThemes(response.data.themes);
      toast.success(`${type === 'paid' ? 'Paid' : 'Due'} stamp template updated successfully`);
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update template');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', minHeight: '100vh' }}>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Select Invoice Stamp Templates</h1>
        
        <div className="max-w-3xl mx-auto">  {/* Changed from max-w-4xl to max-w-3xl */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Paid Stamps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-lg mb-4 max-w-[250px] mx-auto"> {/* Added max-w-[250px] and mx-auto */}
                  <img src={paidStamp1} alt="Paid Template 1" className={`w-full rounded-lg border-4 ${
                    currentThemes.PaidTheme === '1' ? 'border-green-500' : 'border-transparent'
                  }`} />
                </div>
                <button 
                  onClick={() => handleThemeUpdate('paid', '1')}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded ${
                    isUpdating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : currentThemes.PaidTheme === '1'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {currentThemes.PaidTheme === '1' ? 'Currently Selected' : 'Select Template 1'}
                </button>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-lg mb-4 max-w-[250px] mx-auto"> {/* Added max-w-[250px] and mx-auto */}
                  <img src={paidStamp2} alt="Paid Template 2" className={`w-full rounded-lg border-4 ${
                    currentThemes.PaidTheme === '2' ? 'border-green-500' : 'border-transparent'
                  }`} />
                </div>
                <button 
                  onClick={() => handleThemeUpdate('paid', '2')}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded ${
                    isUpdating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : currentThemes.PaidTheme === '2'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {currentThemes.PaidTheme === '2' ? 'Currently Selected' : 'Select Template 2'}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Due Stamps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-lg mb-4 max-w-[250px] mx-auto"> {/* Added max-w-[250px] and mx-auto */}
                  <img src={dueStamp1} alt="Due Template 1" className={`w-full rounded-lg border-4 ${
                    currentThemes.DueTheme === '1' ? 'border-red-500' : 'border-transparent'
                  }`} />
                </div>
                <button 
                  onClick={() => handleThemeUpdate('due', '1')}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded ${
                    isUpdating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : currentThemes.DueTheme === '1'
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {currentThemes.DueTheme === '1' ? 'Currently Selected' : 'Select Template 1'}
                </button>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-lg mb-4 max-w-[250px] mx-auto"> {/* Added max-w-[250px] and mx-auto */}
                  <img src={dueStamp2} alt="Due Template 2" className={`w-full rounded-lg border-4 ${
                    currentThemes.DueTheme === '2' ? 'border-red-500' : 'border-transparent'
                  }`} />
                </div>
                <button 
                  onClick={() => handleThemeUpdate('due', '2')}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded ${
                    isUpdating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : currentThemes.DueTheme === '2'
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {currentThemes.DueTheme === '2' ? 'Currently Selected' : 'Select Template 2'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StampTemplate;
