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
                className="sm:text-2xl text-md text-red-700 font-bold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Stock Maintainance :-
              </h2>
              <div className="flex space-x-2">
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
              </div>
            </div>

            {isGroupCreationView && (
              <div className="flex justify-center mb-4">
                <input
                  type="text"
                  placeholder="Group Name"
                  className="px-4 py-2 border rounded-md m-2"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <button
                  onClick={handleCreateGroup}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 m-2"
                >
                  Create Group
                </button>
                <button
                  onClick={handleCancelGroupCreation}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 m-2"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-4">
              {groups.map((group, index) => (
                <button
                  key={index}
                  onClick={() => handleGroupClick(group)}
                  className={`px-4 py-2 rounded-md ${
                    isGroupView && filteredItems[0]?.Group === group
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-white text-black hover:bg-gray-200 border border-black"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            {isGroupView && (
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={() => {
                    setFilteredItems(items); // Reset to show all items
                    setIsGroupView(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                >
                  Show All Items
                </button>
                <button
                  onClick={handleAddItemButtonClick}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                >
                  Add Item
                </button>
                <button
                  onClick={() => handleDeleteGroup(filteredItems[0]?.Group)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                >
                  Delete Group
                </button>
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
                      <td className="border border-gray-300 px-4 py-2">
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
