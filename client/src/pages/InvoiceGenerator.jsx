import React, { useState, useEffect } from "react";
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
  const [units, setUnits] = useState({});
  const [errors, setErrors] = useState({
    items: [{ itemName: "", amountPerItem: "", quantity: "" }],
    customerName: "",
    customerEmail: "",
    amountPaid: "",
    discount: "",
    dueDate: "",
    paymentMethod: "",
  });

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    amountPaid: "",
    discount: "",
    dueDate: "",
    paymentMethod: "",
    items: [{ itemName: "", amountPerItem: "", quantity: "" }],
  });

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);

  // Add new useEffect for due date validation
  useEffect(() => {
    const netAmount = calculateNetAmount();
    if (Number(formData.amountPaid) < netAmount) {
      setErrors(prev => ({
        ...prev,
        dueDate: formData.dueDate ? "" : "Due date is required when full payment is not made"
      }));
    } else {
      setErrors(prev => ({ ...prev, dueDate: "" }));
    }
  }, [formData.amountPaid, formData.discount]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('input[name="itemName"]')) {
        setSuggestions([]);
        setActiveSuggestionIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Calculates the net amount after applying discount
  const calculateNetAmount = () => {
    const subtotal = formData.items.reduce(
      (total, item) => total + Number(item.amountPerItem) * Number(item.quantity),
      0
    );
    return subtotal - Number(formData.discount || 0);
  };

  // Calculates detailed invoice amounts including subtotal, total, and balance
  const calculateTotalAmount = () => {
    const subtotal = formData.items.reduce(
      (total, item) => 
        total + (Number(item.amountPerItem) || 0) * (Number(item.quantity) || 0),
      0
    );
    const discount = Number(formData.discount) || 0;
    const total = subtotal - discount;
    const amountPaid = Number(formData.amountPaid) || 0;
    const balance = total - amountPaid;
    
    return { subtotal, total, balance };
  };

  // Validates form fields and updates error states
  const validateField = (name, value, index = null) => {
    if (index !== null) {
      const itemErrors = [...errors.items];

      switch (name) {
        case "itemName":
          itemErrors[index].itemName = value.trim()
            ? ""
            : "Item name is required";
          break;
        case "amountPerItem":
          if (!value) {
            itemErrors[index].amountPerItem = "Amount is required";
          } else if (Number(value) <= 0) {
            itemErrors[index].amountPerItem = "Amount must be greater than 0";
          } else {
            itemErrors[index].amountPerItem = "";
          }
          break;
        case "quantity":
          if (!value) {
            itemErrors[index].quantity = "Quantity is required";
          } else if (Number(value) <= 0) {
            itemErrors[index].quantity = "Quantity must be greater than 0";
          } else {
            itemErrors[index].quantity = "";
          }
          break;
      }
      setErrors((prev) => ({ ...prev, items: itemErrors }));
    } else {
      switch (name) {
        case "customerName":
          setErrors((prev) => ({
            ...prev,
            customerName: value.trim() ? "" : "Customer name is required",
          }));
          break;
        case "customerEmail":
          if (!value.trim()) {
            setErrors((prev) => ({
              ...prev,
              customerEmail: "Email is required",
            }));
          } else if (!/\S+@\S+\.\S+/.test(value)) {
            setErrors((prev) => ({
              ...prev,
              customerEmail: "Invalid email format",
            }));
          } else {
            setErrors((prev) => ({ ...prev, customerEmail: "" }));
          }
          break;
        case "amountPaid":
          if (!value) {
            setErrors(prev => ({ ...prev, amountPaid: "Amount paid is required" }));
          } else if (Number(value) < 0) {
            setErrors(prev => ({ ...prev, amountPaid: "Amount cannot be negative" }));
          } else {
            setErrors(prev => ({ ...prev, amountPaid: "" }));
          }
          break;
        case "discount":
          setErrors(prev => ({
            ...prev,
            discount: Number(value) < 0 ? "Discount cannot be negative" : ""
          }));
          break;
        case "dueDate":
          { const totalAfterDiscount = calculateNetAmount();
          if (Number(formData.amountPaid) < totalAfterDiscount && !value) {
            setErrors(prev => ({
              ...prev,
              dueDate: "Due date is required when full payment is not made"
            }));
          } else {
            setErrors(prev => ({ ...prev, dueDate: "" }));
          }
          break; }
      }
    }
  };

  // Handles form field changes and performs necessary validations
  const handleChange = async (e, index = null) => {
    const { name, value } = e.target;
    validateField(name, value, index);

    if (index !== null) {
      const updatedItems = [...formData.items];
      updatedItems[index][name] = value;
      setFormData((prevState) => ({
        ...prevState,
        items: updatedItems,
      }));

      if (name === "itemName") {
        setActiveSuggestionIndex(index);
        if (value.trim() !== "") {
          try {
            const res = await axios.get(
              `${
                import.meta.env.VITE_BACKEND_URL
              }api/v1/stock/suggestions?query=${value}`,
              { withCredentials: true }
            );
            const items = res.data.suggestions;

            const updatedSuggestions = [...suggestions];
            updatedSuggestions[index] = items;
            setSuggestions(updatedSuggestions);

            // Fetch the unit for the selected item
            const stockItemRes = await axios.get(
              `${
                import.meta.env.VITE_BACKEND_URL
              }api/v1/stock/getStockByName?name=${value}`,
              { withCredentials: true }
            );
            if (stockItemRes.data && stockItemRes.data.unit) {
              setUnits((prevUnits) => ({
                ...prevUnits,
                [index]: stockItemRes.data.unit,
              }));
            } else {
              setUnits((prevUnits) => ({
                ...prevUnits,
                [index]: null, // Reset unit if not found
              }));
            }
          } catch (err) {
            console.error("Error fetching item details:", err);
            setUnits((prevUnits) => ({
              ...prevUnits,
              [index]: null, // Reset unit on error
            }));
          }
        } else {
          const updatedSuggestions = [...suggestions];
          updatedSuggestions[index] = [];
          setSuggestions(updatedSuggestions);
        }
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Adds a new empty item to the invoice
  const addItem = () => {
    setFormData((prevState) => ({
      ...prevState,
      items: [
        ...prevState.items,
        { itemName: "", amountPerItem: "", quantity: "" },
      ],
    }));

    // Add corresponding error state for the new item
    setErrors((prevState) => ({
      ...prevState,
      items: [
        ...prevState.items,
        { itemName: "", amountPerItem: "", quantity: "" },
      ],
    }));
  };

  // Fetches item suggestions based on user input
  const fetchSuggestions = async (query, index) => {
    if (!query) return setSuggestions([]);

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }api/v1/stock/suggestions?query=${query}`,
        { withCredentials: true }
      );
      const items = res.data.suggestions; // your backend should return { suggestions: [...] }

      const updatedSuggestions = [...suggestions];
      updatedSuggestions[index] = items;
      setSuggestions(updatedSuggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Handles form submission and invoice generation
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
        Number(formData.amountPaid) <
        (formData.items.reduce(
          (total, item) => total + item.amountPerItem * item.quantity,
          0
        ) - Number(formData.discount || 0)),
    };

    try {
      // console.log(formData.discount);

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

  // Gets the appropriate label for amount input based on unit type
  const getAmountPerItemLabel = (index) => {
    const unit = units[index];
    if (unit === "pcs") return "Amount Per Item (Before discount)";
    if (unit === "kg") return "Amount Per kg (Before discount)";
    if (unit === "L") return "Amount Per Litre (Before discount)";
    return "Amount Per Item"; // Default label
  };

  // Checks if all fields in an item are filled
  const isItemFilled = (item) => {
    return item.itemName.trim() !== '' && 
           item.amountPerItem.trim() !== '' && 
           item.quantity.trim() !== '';
  };

  // Checks if a new item can be added based on existing items' state
  const canAddNewItem = () => {
    // Check if all existing items are filled
    return formData.items.every(item => isItemFilled(item));
  };

  // Deletes an item from the invoice and updates related states
  const handleDeleteItem = (indexToDelete) => {
    setFormData(prevState => ({
      ...prevState,
      items: prevState.items.filter((_, index) => index !== indexToDelete)
    }));

    setErrors(prevState => ({
      ...prevState,
      items: prevState.items.filter((_, index) => index !== indexToDelete)
    }));

    // Clear suggestions and units for deleted item
    setSuggestions(prev => prev.filter((_, index) => index !== indexToDelete));
    setUnits(prev => {
      const newUnits = { ...prev };
      delete newUnits[indexToDelete];
      // Reindex the remaining units
      Object.keys(newUnits).forEach(key => {
        if (Number(key) > indexToDelete) {
          newUnits[Number(key) - 1] = newUnits[key];
          delete newUnits[key];
        }
      });
      return newUnits;
    });
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Header />
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 md:p-8">
        <div className="bg-white w-full max-w-3xl p-6 md:p-8 rounded-lg shadow-lg relative">
          <h2
            className="text-2xl font-bold text-center text-red-600 mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            GENERATE INVOICE
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Dynamic Item Fields with Numbering */}
            {formData.items.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Item {index + 1}</h3>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded-full transition duration-300"
                    >
                      ✕ Delete
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label
                      className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
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
                      className={`border rounded px-3 py-2 w-full ${
                        errors.items[index]?.itemName ? "border-red-500" : ""
                      }`}
                      required
                      autoComplete="off"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    />
                    {errors.items[index]?.itemName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.items[index].itemName}
                      </p>
                    )}
                    {suggestions[index]?.length > 0 && (
                      <div className="absolute bg-white border border-gray-300 w-full mt-1 z-10 max-h-40 overflow-y-auto scrollbar-hide rounded shadow">
                        {suggestions[index].map((suggestion, i) => (
                          <div
                            key={i}
                            onClick={async () => {
                              const updatedItems = [...formData.items];
                              updatedItems[index].itemName = suggestion;
                              setFormData((prev) => ({
                                ...prev,
                                items: updatedItems,
                              }));

                              const updated = [...suggestions];
                              updated[index] = [];
                              setSuggestions(updated);

                              // Fetch the unit for the selected item
                              try {
                                const stockItemRes = await axios.get(
                                  `${
                                    import.meta.env.VITE_BACKEND_URL
                                  }api/v1/stock/getStockByName?name=${suggestion}`,
                                  { withCredentials: true }
                                );
                                if (
                                  stockItemRes.data &&
                                  stockItemRes.data.unit
                                ) {
                                  setUnits((prevUnits) => ({
                                    ...prevUnits,
                                    [index]: stockItemRes.data.unit,
                                  }));
                                } else {
                                  setUnits((prevUnits) => ({
                                    ...prevUnits,
                                    [index]: null, // Reset unit if not found
                                  }));
                                }
                              } catch (err) {
                                console.error(
                                  "Error fetching item details:",
                                  err
                                );
                                setUnits((prevUnits) => ({
                                  ...prevUnits,
                                  [index]: null, // Reset unit on error
                                }));
                              }
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
                    <label className="absolute left-1 -top-3 bg-white px-0 text-sm text-gray-500">
                      {getAmountPerItemLabel(index)}
                    </label>
                    <input
                      type="number"
                      name="amountPerItem"
                      value={item.amountPerItem}
                      onChange={(e) => handleChange(e, index)}
                      onWheel={(e) => e.target.blur()}
                      className={`border rounded px-1 py-2 w-full no-spinners ${
                        errors.items[index]?.amountPerItem
                          ? "border-red-500"
                          : ""
                      }`}
                      required
                    />
                    {errors.items[index]?.amountPerItem && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.items[index].amountPerItem}
                      </p>
                    )}
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
                      onWheel={(e) => e.target.blur()}
                      className={`border rounded px-3 py-2 w-full no-spinners ${
                        errors.items[index]?.quantity ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.items[index]?.quantity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.items[index].quantity}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Total Amount Display */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6 flex justify-between items-center">
              <div className="text-lg font-semibold">Total Amount (After Discount):</div>
              <div className="text-xl font-bold text-red-600">
                ₹{calculateTotalAmount().total.toFixed(2)}
              </div>
            </div>

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
                {
                  label: "Due Date",
                  name: "dueDate",
                  type: "date",
                  min: new Date().toISOString().split("T")[0],
                },
                {
                  label: "Payment Method",
                  name: "paymentMethod",
                  type: "text",
                },
              ].map(({ label, name, type, min }) => (
                <div
                  className="flex flex-col md:flex-row md:items-center"
                  key={name}
                >
                  <label
                    className="md:w-40 text-gray-700 mb-1 md:mb-0"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {label} :-
                  </label>
                  <div className="w-full md:w-[55%]">
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      onWheel={type === 'number' ? (e) => e.target.blur() : undefined}
                      className={`w-full border-b border-black outline-none px-2 py-1 ${
                        type === "number" ? "no-spinners" : ""
                      } ${
                        errors[name] ? "border-red-500" : ""
                      }`}
                      style={{ fontFamily: "Arial, sans-serif" }}
                      min={min}
                    />
                    {errors[name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[name]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6">
              {/* Add Item Button - Bottom Left */}
              <button
                type="button"
                onClick={addItem}
                disabled={!canAddNewItem()}
                className={`py-2 px-4 rounded-full transition duration-300 ${
                  canAddNewItem()
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
      <Chatbot />
    </div>
  );
};

export default InvoiceGenerator;
