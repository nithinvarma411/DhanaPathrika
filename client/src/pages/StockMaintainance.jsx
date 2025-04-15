import React, { useEffect, useState } from "react";
import bgImage from "../assets/bg.jpg";
import Header from "../components/Header";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function StockMaintainance() {
  const [items, setItems] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/getStock`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const sortedItems = response.data.sort((a, b) =>
            a.ItemName.localeCompare(b.ItemName)
          );
          setItems(sortedItems);
          setFilteredItems(sortedItems);
          toast.success(response.data.message);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  const handleEdit = (index, item) => {
    setEditingRow(index);
    setEditedData(item);
    setIsEditing(true);
  };

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSave = async (id) => {
    setActionLoading(id); // Start loading

    try {
      const formattedData = {
        ItemName: editedData.ItemName,
        CostPrice: Number(editedData.CostPrice),
        SellingPrice: Number(editedData.SellingPrice),
        AvailableQuantity: Number(editedData.AvailableQuantity),
        MinQuantity: Number(editedData.MinQuantity),
        ItemCode: editedData.ItemCode
      };

      if (
        typeof formattedData.ItemName !== "string" ||
        isNaN(formattedData.CostPrice) ||
        isNaN(formattedData.SellingPrice) ||
        isNaN(formattedData.AvailableQuantity) ||
        isNaN(formattedData.MinQuantity)
      ) {
        toast.error("Invalid data type. Please enter valid values.");
        setActionLoading(null);
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/update/${id}`,
        formattedData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === id ? response.data.stock : item
          )
        );
        setEditingRow(null);
        setIsEditing(false);
        toast.success(response.data.message);
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error while saving");
    } finally {
      setActionLoading(null); // End loading
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "custom-swal",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/delete/${id}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setItems((prevItems) => prevItems.filter((item) => item._id !== id));
          Swal.fire("Deleted!", "Your item has been deleted.", "success").then(
            () => {
              window.location.reload();
            }
          );
          toast.success(response.data.message);
        } else {
          Swal.fire("Error!", response.data.message, "error");
          toast.error(response.data.message);
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", error);
        toast.error(error.response.data.message);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = items.filter((item) =>
      item.ItemName.includes(e.target.value)
    );
    setFilteredItems(filtered);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }}
    >
      <div className="container mx-auto px-4">
        <Header />

        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <ClipLoader size={100} color={"white"} loading={loading} />
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 mt-4 shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <input
                type="text"
                placeholder="Search Item..."
                className="px-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl text-red-700 font-bold">Item Form :</h2>
              <button
                onClick={() => navigate("/add-stock")}
                className={`px-4 py-2 rounded-md flex items-center ${
                  isEditing
                    ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                disabled={isEditing}
              >
                <span className="mr-1">+</span> Add
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      S.No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Item Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Item Code
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Cost Price
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Selling Price
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Available Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Min Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={item._id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 overflow-x-auto px-4 py-2">
                        <input
                          type="text"
                          className="w-full focus:outline-none"
                          value={
                            editingRow === index
                              ? editedData.ItemName
                              : item.ItemName
                          }
                          onChange={(e) => handleChange(e, "ItemName")}
                          disabled={editingRow !== index}
                        />
                      </td>
                      <td className="border border-gray-300 overflow-x-auto px-4 py-2">
                        <input
                          type="text"
                          className="w-full focus:outline-none"
                          value={
                            editingRow === index
                              ? editedData.ItemCode
                              : item.ItemCode
                          }
                          onChange={(e) => handleChange(e, "ItemCode")}
                          disabled={editingRow !== index}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          className="w-full focus:outline-none"
                          value={
                            editingRow === index
                              ? editedData.CostPrice
                              : item.CostPrice
                          }
                          onChange={(e) => handleChange(e, "CostPrice")}
                          disabled={editingRow !== index}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          className="w-full focus:outline-none"
                          value={
                            editingRow === index
                              ? editedData.SellingPrice
                              : item.SellingPrice
                          }
                          onChange={(e) => handleChange(e, "SellingPrice")}
                          disabled={editingRow !== index}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          className="w-full focus:outline-none"
                          value={
                            editingRow === index
                              ? editedData.AvailableQuantity
                              : item.AvailableQuantity
                          }
                          onChange={(e) => handleChange(e, "AvailableQuantity")}
                          disabled={editingRow !== index}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          className="w-full focus:outline-none"
                          value={
                            editingRow === index
                              ? editedData.MinQuantity
                              : item.MinQuantity
                          }
                          onChange={(e) => handleChange(e, "MinQuantity")}
                          disabled={editingRow !== index}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex justify-center space-x-2">
                          {editingRow === index ? (
                            <button
                              className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white flex items-center"
                              onClick={() => handleSave(item._id)}
                              disabled={actionLoading === item._id}
                            >
                              {actionLoading === item._id ? (
                                <ClipLoader size={15} color="#fff" />
                              ) : (
                                "Save"
                              )}
                            </button>
                          ) : (
                            <button
                              className={`px-4 py-1 rounded ${
                                isEditing
                                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700 text-white"
                              }`}
                              onClick={() => handleEdit(index, item)}
                              disabled={isEditing}
                            >
                              Edit
                            </button>
                          )}

                          <button
                            className={`px-4 py-1 rounded ${
                              isEditing && editingRow !== index
                                ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            } flex items-center`}
                            disabled={
                              (isEditing && editingRow !== index) ||
                              actionLoading === item._id
                            }
                            onClick={() => handleDelete(item._id)}
                          >
                            {actionLoading === item._id ? (
                              <ClipLoader size={15} color="#fff" />
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockMaintainance;
