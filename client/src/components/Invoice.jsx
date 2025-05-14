import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Invoice = ({ invoice, profile, isEditing, onUpdate }) => {
  const [editableInvoice, setEditableInvoice] = useState(invoice);
  const [units, setUnits] = useState({}); // Store units for each item
  const [isLoadingUnits, setIsLoadingUnits] = useState(true); // Track loading state for units

  const calculateTotals = (items) => {
    return {
      totalQuantity: items.reduce((sum, item) => sum + item.Quantity, 0),
      totalAmount: items.reduce((sum, item) => sum + (item.Quantity * item.AmountPerItem), 0),
      dueAmount: items.reduce((sum, item) => sum + (item.Quantity * item.AmountPerItem), 0) - editableInvoice.AmountPaid - (editableInvoice.Discount || 0)
    };
  };

  useEffect(() => {
    setEditableInvoice(invoice);
  }, [invoice]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const unitMap = {};
        for (const item of invoice.Items) {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/getStockByName?name=${item.Name}`,
            { withCredentials: true }
          );
          unitMap[item.Name] = res.data.unit || "";
        }
        setUnits(unitMap);
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setIsLoadingUnits(false); // Mark unit fetching as complete
      }
    };

    if (invoice?.Items?.length) {
      fetchUnits();
    }
  }, [invoice]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('item-')) {
      const [_, field, idx] = name.split('-');
      const newItems = [...editableInvoice.Items];
      const oldItem = newItems[idx];
      const newValue = field === 'Quantity' || field === 'AmountPerItem' ? Number(value) : value;

      if (field === 'Quantity' && newValue > 100) {
        Swal.fire({
          title: 'Warning',
          text: 'Are you sure about this quantity?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            newItems[idx] = { ...oldItem, [field]: newValue };
            setEditableInvoice({ ...editableInvoice, Items: newItems });
          }
        });
        return;
      }

      if (field === 'AmountPerItem') {
        const percentChange = Math.abs((newValue - oldItem.AmountPerItem) / oldItem.AmountPerItem * 100);
        if (percentChange > 20) {
          Swal.fire({
            title: 'Significant Price Change',
            text: `The price change is more than 20%. Are you sure?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
              newItems[idx] = { ...oldItem, [field]: newValue };
              setEditableInvoice({ ...editableInvoice, Items: newItems });
            }
          });
          return;
        }
      }

      newItems[idx] = { ...oldItem, [field]: newValue };
      setEditableInvoice({ ...editableInvoice, Items: newItems });
    } else {
      setEditableInvoice({ ...editableInvoice, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editableInvoice);
  };

  const handleRemoveItem = async (indexToRemove) => {
    const result = await Swal.fire({
      title: 'Remove Item',
      html: `
        <div class="space-y-4">
          <p>Are you sure you want to remove this item?</p>
          <div class="text-left">
            <label class="block text-sm font-medium text-gray-700">Reason for removal:</label>
            <select id="removalReason" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="wrongItem">Wrong Item Selected</option>
              <option value="priceError">Price Error</option>
              <option value="quantityError">Quantity Error</option>
              <option value="customerRequest">Customer Request</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Remove',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4f46e5',
      focusConfirm: false,
      preConfirm: () => {
        return document.getElementById('removalReason').value;
      }
    });

    if (result.isConfirmed) {
      const reason = result.value;
      const newItems = editableInvoice.Items.filter((_, index) => index !== indexToRemove);
      const removedItem = editableInvoice.Items[indexToRemove];
      
      // Calculate new totals after removal
      const { totalAmount } = calculateTotals(newItems);
      
      // If amount paid is more than new total, adjust it
      const newAmountPaid = Math.min(editableInvoice.AmountPaid, totalAmount);
      
      setEditableInvoice({
        ...editableInvoice,
        Items: newItems,
        AmountPaid: newAmountPaid,
        IsDue: newAmountPaid < totalAmount,
        _deletedItems: [
          ...(editableInvoice._deletedItems || []),
          {
            ...removedItem,
            removalReason: reason,
            removedAt: new Date()
          }
        ]
      });

      // Show toast notification about the price change
      toast.info(`Total amount updated after removing ${removedItem.Name}`);
    }
  };

  if (!invoice || !profile || isLoadingUnits) {
    return <p className="text-center p-4">Loading...</p>;
  }

  if (isEditing) {
    const { totalAmount, dueAmount } = calculateTotals(editableInvoice.Items);

    return (
      <form onSubmit={handleSubmit} className="p-4 space-y-6 bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Customer Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input
                type="text"
                name="CustomerName"
                value={editableInvoice.CustomerName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Email</label>
              <input
                type="email"
                name="CustomerEmail"
                value={editableInvoice.CustomerEmail}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Payment Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
              <input
                type="number"
                name="AmountPaid"
                value={editableInvoice.AmountPaid}
                onChange={handleInputChange}
                max={totalAmount}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount</label>
              <input
                type="number"
                name="Discount"
                value={editableInvoice.Discount}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            {editableInvoice.AmountPaid < totalAmount && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  name="DueDate"
                  value={editableInvoice.DueDate ? new Date(editableInvoice.DueDate).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Invoice Items</h2>
          <div className="space-y-4">
            {editableInvoice.Items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-md shadow-sm">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Name</label>
                    <input
                      type="text"
                      name={`item-Name-${index}`}
                      value={item.Name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      name={`item-Quantity-${index}`}
                      value={item.Quantity}
                      onChange={handleInputChange}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount Per Item</label>
                    <input
                      type="number"
                      name={`item-AmountPerItem-${index}`}
                      value={item.AmountPerItem}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="mt-6 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div className="text-gray-700 space-y-2">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">₹{totalAmount}</span>
              </p>
              <p className="flex justify-between">
                <span>Discount:</span>
                <span className="font-medium text-red-600">-₹{editableInvoice.Discount || 0}</span>
              </p>
              <p className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-medium text-green-600">₹{editableInvoice.AmountPaid}</span>
              </p>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="flex justify-between font-bold">
                  <span>Balance Due:</span>
                  <span className={dueAmount > 0 ? 'text-red-600' : 'text-green-600'}>
                    ₹{Math.max(0, dueAmount)}
                  </span>
                </p>
              </div>
            </div>
            <div className="space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  const totalQuantity = invoice.Items.reduce((sum, item) => sum + item.Quantity, 0);
  const totalAmount = invoice.Items.reduce((sum, item) => sum + item.Quantity * item.AmountPerItem, 0);

  return (
    <div className="flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 gap-4">
          <div className="border-2 border-red-600 rounded-full py-2 px-3 w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-red-600 text-center truncate">
              {profile.CompanyName}
            </h1>
          </div>
          <div className="text-center sm:text-right">
            <p className="font-medium text-sm sm:text-base">Invoice No. - {invoice._id || "N/A"}</p>
          </div>
        </div>

        {/* Payment info section */}
        <div className="border-t border-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
            <div className="p-4">
              <h2 className="font-bold mb-2">Payable To</h2>
              <p className="font-bold">{profile.UserName || "N/A"}</p>
              <p className="text-sm md:text-base break-words">{profile.BussinessAdress || "N/A"}</p>
              <p className="text-sm md:text-base break-words">{profile.Email || "N/A"}</p>
            </div>

            <div className="p-4">
              <h2 className="font-bold mb-2">Date</h2>
              <p>{new Date(invoice.Date).toLocaleDateString("en-GB") || "N/A"}</p>
            </div>

            <div className="p-4">
              <h2 className="font-bold mb-2">Due Date</h2>
              <p>{invoice.DueDate ? new Date(invoice.DueDate).toLocaleDateString("en-GB") : "No Due"}</p>
            </div>
          </div>
        </div>

        {/* Billing and items section */}
        <div className="border-t border-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
            <div className="p-4">
              <h2 className="font-bold mb-2">Billed To</h2>
              <p className="font-bold">{invoice.CustomerName || "N/A"}</p>
              <p className="text-sm md:text-base break-words">{invoice.CustomerEmail || "N/A"}</p>
            </div>

            <div className="col-span-1 sm:col-span-2 overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 px-2 sm:px-4 text-left">Item Name</th>
                    <th className="py-2 px-2 sm:px-4 text-right w-16 sm:w-24">Qty</th>
                    <th className="py-2 px-2 sm:px-4 text-right w-24 sm:w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.Items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="py-2 px-2 sm:px-4 break-words">{item.Name}</td>
                      <td className="py-2 px-2 sm:px-4 text-right">
                        {item.Quantity} {units[item.Name] || ""}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-right">
                        ₹ {item.Quantity * item.AmountPerItem}
                      </td>
                    </tr>
                  ))}

                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-2 sm:px-4 font-bold">TOTAL</td>
                    <td className="py-2 px-2 sm:px-4 text-right">{totalQuantity}</td>
                    <td className="py-2 px-2 sm:px-4 text-right">₹ {totalAmount}</td>
                  </tr>

                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-2 sm:px-4 font-bold">Discount</td>
                    <td className="py-2 px-2 sm:px-4 text-right"></td>
                    <td className="py-2 px-2 sm:px-4 text-right">₹ {invoice.Discount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="border-t border-gray-300 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
          <div className="p-4">
            <h2 className="font-bold mb-2">Contact</h2>
            <p className="text-sm md:text-base break-words">{profile.Email}</p>
            <p className="text-sm md:text-base break-words">{profile.BussinessAdress}</p>
            <p className="text-sm md:text-base">{profile.MobileNumber}</p>
          </div>
          <div className="col-span-1 sm:col-span-2 p-4 flex items-center justify-center sm:justify-end">
            <div className="border-2 border-red-600 rounded-full px-4 sm:px-8 py-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-red-600">Thank you</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
