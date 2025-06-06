import React, { useEffect, useState } from "react";
import bgImage from "../assets/bg.jpg";
import Header from "../components/Header";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";

function StockMaintainance() {
  const [items, setItems] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isGroupView, setIsGroupView] = useState(false);
  const [isGroupCreationView, setIsGroupCreationView] = useState(false);
  const [isAddItemView, setIsAddItemView] = useState(false); // New state for Add Item view
  const [selectedGroup, setSelectedGroup] = useState(null); // Track the selected group
  const [isExporting, setIsExporting] = useState(false);
  const [showAllGroups, setShowAllGroups] = useState(false);

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

          const uniqueGroups = [
            ...new Set(sortedItems.map((item) => item.Group).filter(Boolean)),
          ];
          setGroups(uniqueGroups); // Extract unique groups
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
        ItemCode: editedData.ItemCode,
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
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const sourceItems = isGroupView
      ? items.filter((item) => item.Group === filteredItems[0]?.Group)
      : items;
    const filtered = sourceItems.filter(
      (item) =>
        item.ItemName.toLowerCase().includes(query) ||
        (item.ItemCode && item.ItemCode.toLowerCase().includes(query)) // Check if ItemCode exists
    );
    setFilteredItems(filtered);
  };

  const handleGroupClick = (group) => {
    const groupItems = items.filter((item) => item.Group === group);
    setFilteredItems(groupItems); // Update the table to show only group items
    setIsGroupView(true);
    setSelectedGroup(group); // Set the selected group
    setIsAddItemView(false); // Reset Add Item view
    setShowAllGroups(false); // Close the dropdown when a group is selected
  };

  const handleItemSelection = (itemId) => {
    setSelectedItems(
      (prevSelected) =>
        prevSelected.includes(itemId)
          ? prevSelected.filter((id) => id !== itemId) // Deselect if already selected
          : [...prevSelected, itemId] // Select if not already selected
    );
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }

    if (newGroupName.trim().length > 20) {
      toast.error("Group name cannot exceed 20 characters");
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Please select at least one item for the group");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/createGroup`,
        { groupName: newGroupName, itemIds: selectedItems },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        setNewGroupName("");
        setSelectedItems([]);
        setIsGroupCreationView(false); // Reset group creation view
        window.location.reload(); // Refresh the page
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating group");
    }
  };

  const handleGroupButtonClick = () => {
    if (isGroupView) {
      setFilteredItems(items); // Reset to show all items
      setIsGroupView(false); // Exit group view mode
    }
    // Filter items that don't belong to any group
    const ungroupedItems = items.filter(item => !item.Group);
    setFilteredItems(ungroupedItems);
    setIsGroupCreationView(true);
    setSelectedItems([]); // Reset selected items
  };

  const handleCancelGroupCreation = () => {
    setIsGroupCreationView(false);
    setNewGroupName("");
    setSelectedItems([]);
  };

  const handleDeleteGroup = async (group) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `This will delete the group "${group}" and remove it from all associated items.`,
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
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/deleteGroup`,
          { groupName: group },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setGroups((prevGroups) => prevGroups.filter((g) => g !== group));
          setFilteredItems(
            items.map((item) =>
              item.Group === group ? { ...item, Group: null } : item
            )
          );
          setIsGroupView(false);
          toast.success(response.data.message);
          window.location.reload();
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting group");
    }
  };

  const handleRemoveItemFromGroup = async (itemId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/removeFromGroup`,
        { itemIds: [itemId] },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        window.location.reload(); // Reload the page after successful removal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error removing item from group"
      );
    }
  };

  const handleAddItemButtonClick = () => {
    setFilteredItems(items.filter((item) => !item.Group)); // Show items without a group
    setIsAddItemView(true);
  };

  const handleAddItemToGroup = async (itemId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/addToGroup`,
        { itemId, groupName: selectedGroup },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        window.location.reload(); // Reload the page after successful addition
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error adding item to group"
      );
    }
  };

  const handleExportStock = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const userResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/profile/getProfile`,
        { withCredentials: true }
      );
      
      const email = userResponse.data.profile.Email;
      const stockData = items.map(item => ({
        ItemName: item.ItemName || '',
        CostPrice: parseFloat(item.CostPrice) || 0,
        SellingPrice: parseFloat(item.SellingPrice) || 0,
        AvailableQuantity: parseInt(item.AvailableQuantity) || 0,
        MinQuantity: parseInt(item.MinQuantity) || 0,
        ItemCode: item.ItemCode || '',
        Group: item.Group || '',
        Unit: item.Unit || 'pcs'
      }));
      
      const response = await axios.post(`${import.meta.env.VITE_GO_BACKEND_URL}export-stock`, {
        email: email,
        stock: stockData
      });
      
      if (response.status === 200) {
        toast.success('Stock exported and sent to your email!');
      } else {
        throw new Error('Failed to export stock');
      }
    } catch (error) {
      console.error('Error exporting stock:', error);
      toast.error('Failed to export stock');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleShowAllGroups = () => {
    if (isGroupView) return; // Don't toggle if a group is selected
    setShowAllGroups(!showAllGroups);
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
                placeholder="Search by Name or Code ..."
                className="px-4 py-2 border rounded-md w-[50%]"
                value={searchQuery}
                onChange={handleSearch}
                style={{ fontFamily: "Arial, sans-serif" }}
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2
                className="hidden sm:block text-2xl text-red-700 font-bold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Stock Maintainance :-
              </h2>
              <div className="flex justify-between sm:space-x-4 w-full sm:w-auto">
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
                <button
                  onClick={handleGroupButtonClick}
                  className={`px-4 py-2 rounded-md ${
                    isEditing
                      ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  disabled={isEditing}
                >
                  <span className="mr-1">+</span> Group
                </button>
                <button
                  onClick={handleExportStock}
                  disabled={isExporting}
                  className={`px-4 py-2 rounded-md ${
                    isExporting 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-purple-500 hover:bg-purple-600"
                  } text-white flex items-center gap-2`}
                >
                  {isExporting ? (
                    <>
                      <ClipLoader size={16} color="white" />
                      Exporting...
                    </>
                  ) : (
                    "Export Stock"
                  )}
                </button>
              </div>
            </div>

            {isGroupCreationView && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-6 shadow-md">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                  <div className="relative w-fit">
                    <input
                      type="text"
                      placeholder="Enter Group Name"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      maxLength={20}
                      style={{ width: `${Math.max(200, newGroupName.length * 12)}px` }}
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {newGroupName.length}/20
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateGroup}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create Group
                    </button>
                    <button
                      onClick={handleCancelGroupCreation}
                      className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              <div className={`flex overflow-x-auto scrollbar-hide gap-3 mb-6 py-2 ${showAllGroups ? 'hidden' : 'block'}`}>
                {groups.slice(0, 3).map((group, index) => (
                  <button
                    key={index}
                    onClick={() => handleGroupClick(group)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap
                      ${isGroupView && filteredItems[0]?.Group === group
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-500 hover:text-red-500"
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    {group}
                  </button>
                ))}
                {groups.length > 3 && !isGroupView && (
                  <button
                    onClick={toggleShowAllGroups}
                    className="px-4 py-2 rounded-lg bg-white text-gray-700 border-2 border-gray-200 hover:border-red-500 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Dropdown menu for all groups */}
              {showAllGroups && !isGroupView && (
                <div className="absolute z-10 w-full bg-black rounded-lg shadow-xl py-2 mb-6 max-h-[80vh] overflow-auto">
                  <div className="flex justify-end px-4 sticky top-0 bg-black">
                    <button
                      onClick={() => setShowAllGroups(false)}
                      className="text-white hover:text-red-500 transition-colors p-2"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
                    {groups.map((group, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleGroupClick(group);
                          setShowAllGroups(false);
                        }}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 whitespace-nowrap bg-gray-800 text-white hover:bg-gray-700 text-sm md:text-base"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        <span className="truncate">{group}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isGroupView && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-6 shadow-md">
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => {
                      setFilteredItems(items);
                      setIsGroupView(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Show All Items
                  </button>
                  <button
                    onClick={handleAddItemButtonClick}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Item
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(filteredItems[0]?.Group)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete Group
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto scrollbar-hide">
              <table
                className="w-full border-collapse"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                <thead>
                  <tr>
                    {isGroupCreationView ? (
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Select
                      </th>
                    ) : (
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        S.No
                      </th>
                    )}
                    <th className="border border-gray-300 px-4 py-2 text-left min-w-[200px] sm:min-w-0">
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
                      {isGroupCreationView ? (
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleItemSelection(item._id)}
                          />
                        </td>
                      ) : (
                        <td
                          className="border border-gray-300 px-4 py-2"
                          style={{ fontFamily: "Arial, sans-serif" }}
                        >
                          {index + 1}
                        </td>
                      )}
                      <td className="border border-gray-300 px-4 py-2 min-w-[200px] sm:min-w-0">
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
                          style={{ fontFamily: "Arial, sans-serif" }}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
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
                              : `${item.AvailableQuantity} ${
                                  item.Unit === "l" ? "L" : item.Unit || ""
                                }`.trim()
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
                              : `${item.MinQuantity} ${
                                  item.Unit === "l" ? "L" : item.Unit || ""
                                }`.trim()
                          }
                          onChange={(e) => handleChange(e, "MinQuantity")}
                          disabled={editingRow !== index}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex justify-center space-x-2">
                          {isAddItemView ? (
                            <button
                              className="px-4 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleAddItemToGroup(item._id)}
                            >
                              Add this Item
                            </button>
                          ) : editingRow === index ? (
                            <button
                              className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={() => handleSave(item._id)}
                              disabled={actionLoading === item._id}
                            >
                              {actionLoading === item._id
                                ? "Saving..."
                                : "Save"}
                            </button>
                          ) : (
                            <button
                              className={`px-4 py-1 rounded ${
                                isEditing
                                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                                  : "bg-green-500 hover:bg-green-600 text-white"
                              }`}
                              onClick={() => handleEdit(index, item)}
                              disabled={isEditing}
                            >
                              Edit
                            </button>
                          )}
                          {!isAddItemView && (
                            <button
                              className={`px-4 py-1 rounded ${
                                isEditing
                                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                                  : "bg-red-500 hover:bg-red-600 text-white"
                              }`}
                              onClick={() => handleDelete(item._id)}
                              disabled={isEditing}
                            >
                              Delete
                            </button>
                          )}
                          {isGroupView && item.Group && !isAddItemView && (
                            <button
                              className="px-4 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                              onClick={() =>
                                handleRemoveItemFromGroup(item._id)
                              }
                            >
                              Remove from Group
                            </button>
                          )}
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
      <Chatbot />
    </div>
  );
}

export default StockMaintainance;
