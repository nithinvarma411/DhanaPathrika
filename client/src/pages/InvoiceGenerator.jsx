import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../assets/bg.jpg";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";

const InvoiceGenerator = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    amountPaid: "",
    discount: "",
    dueDate: "",
    paymentMethod: "",
    items: [{ itemName: "", amountPerItem: "", quantity: "" }],
  });

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      const updatedItems = [...formData.items];
      updatedItems[index][name] = value;
      setFormData((prevState) => ({
        ...prevState,
        items: updatedItems,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addItem = () => {
    setFormData((prevState) => ({
      ...prevState,
      items: [
        ...prevState.items,
        { itemName: "", amountPerItem: "", quantity: "" },
      ],
    }));
  };

  const fetchSuggestions = async (query, index) => {
    if (!query) return setSuggestions([]);
  
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/suggestions?query=${query}`, {withCredentials: true}
      );
      const items = res.data.suggestions; // your backend should return { suggestions: [...] }
      
      const updatedSuggestions = [...suggestions];
      updatedSuggestions[index] = items;
      setSuggestions(updatedSuggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const invoiceData = {
      CustomerName: formData.customerName,
      CustomerEmail: formData.customerEmail,
      AmountPaid: formData.amountPaid,
      DueDate: formData.dueDate,
      Discount: Number(formData.discount),
      PaymentMethod: formData.paymentMethod,
      Items: formData.items.map((item) => ({
        Name: item.itemName,
        Quantity: Number(item.quantity),
        AmountPerItem: Number(item.amountPerItem),
      })),
      Date: new Date().toISOString(),
      IsDue:
        formData.amountPaid <
        formData.items.reduce(
          (total, item) => total + item.amountPerItem * item.quantity,
          0
        ),
    };

    try {
      console.log(formData.discount);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/createInvoice`,
        invoiceData,
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setFormData({
        customerName: "",
        customerEmail: "",
        amountPaid: "",
        discount: 0,
        dueDate: "",
        paymentMethod: "",
        items: [{ itemName: "", amountPerItem: "", quantity: "" }],
      });
      navigate("/invoice");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again!"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const isFirstItemFilled =
    formData.items[0].itemName.trim() !== "" &&
    formData.items[0].amountPerItem.trim() !== "" &&
    formData.items[0].quantity.trim() !== "";

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Header />
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 md:p-8">
        <div className="bg-white w-full max-w-3xl p-6 md:p-8 rounded-lg shadow-lg relative">
          <h2 className="text-2xl font-bold text-center text-red-600 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            GENERATE INVOICE
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Dynamic Item Fields with Numbering */}
            {formData.items.map((item, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Item {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="itemName"
                      value={item.itemName}
                      onChange={(e) => {
                        handleChange(e, index);
                        fetchSuggestions(e.target.value, index);
                      }}
                      className="border rounded px-3 py-2 w-full"
                      required
                      autoComplete="off"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    />
                    {suggestions[index]?.length > 0 && (
                      <div className="absolute bg-white border border-gray-300 w-full mt-1 z-10 max-h-40 overflow-y-auto scrollbar-hide rounded shadow">
                        {suggestions[index].map((suggestion, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              const updatedItems = [...formData.items];
                              updatedItems[index].itemName = suggestion;
                              setFormData((prev) => ({
                                ...prev,
                                items: updatedItems,
                              }));

                              const updated = [...suggestions];
                              updated[index] = [];
                              setSuggestions(updated);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label className="absolute left-2 -top-3 bg-white px-1 text-sm text-gray-500">
                      Amount Per Item (after discount)
                    </label>
                    <input
                      type="number"
                      name="amountPerItem"
                      value={item.amountPerItem}
                      onChange={(e) => handleChange(e, index)}
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleChange(e, index)}
                      className="border rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Customer Details */}
            <div className="space-y-4">
              {[
                { label: "Customer Name", name: "customerName", type: "text" },
                {
                  label: "Customer Email",
                  name: "customerEmail",
                  type: "email",
                },
                { label: "Amount Paid", name: "amountPaid", type: "number" },
                { label: "Total Discount", name: "discount", type: "number" },
                { label: "Due Date", name: "dueDate", type: "date" },
                {
                  label: "Payment Method",
                  name: "paymentMethod",
                  type: "text",
                },
              ].map(({ label, name, type }) => (
                <div
                  className="flex flex-col md:flex-row md:items-center"
                  key={name}
                >
                  <label className="md:w-40 text-gray-700 mb-1 md:mb-0" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {label} :-
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full md:w-[55%] border-b border-black outline-none px-2 py-1"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6">
              {/* Add Item Button - Bottom Left */}
              <button
                type="button"
                onClick={addItem}
                disabled={!isFirstItemFilled}
                className={`py-2 px-4 rounded-full transition duration-300 ${
                  isFirstItemFilled
                    ? "bg-green-500 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                + Add Item
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#c21a1a] text-white py-3 px-6 rounded-full hover:bg-[#dc1414] transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};

export default InvoiceGenerator;
