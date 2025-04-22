import { Stock } from "../models/stock.model.js";
import mongoose from 'mongoose';

const addStock = async (req, res) => {
    try {
        const { ItemName, CostPrice, SellingPrice, AvailableQuantity, MinQuantity, ItemCode, Group, Unit } = req.body;
        const userId = req.user.id;

        if (!ItemName || isNaN(CostPrice) || isNaN(SellingPrice) || isNaN(AvailableQuantity) || isNaN(MinQuantity) || !Unit) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        if (!['pcs', 'kg', 'L'].includes(Unit)) {
            return res.status(400).send({ "message": "Invalid Unit value" });
        }

        const existedItem = await Stock.findOne({ ItemName, user: userId });

        if (existedItem) {
            return res.status(409).send({ "message": "Item already exists in your stock" });
        }

        if (Group) {
            const groupConflict = await Stock.findOne({ Group, user: userId, ItemName: { $ne: ItemName } });
            if (groupConflict) {
                return res.status(409).send({ "message": "Group already contains another item" });
            }
        }

        const newStock = new Stock({
            ItemName,
            CostPrice,
            SellingPrice,
            AvailableQuantity,
            MinQuantity,
            ItemCode,
            Group,
            Unit,
            user: userId
        });

        await newStock.save();

        return res.status(201).send({ "message": "Item added successfully", newStock });
    } catch (error) {
        console.error("error adding stock", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const getStock = async (req, res) => {
    try {
        const userId = req.user.id;
        const stockItems = await Stock.find({ user: userId });

        if (!stockItems.length) {
            return res.status(404).send({ "message": "No stock items found for this user" });
        }

        return res.status(200).send(stockItems);
    } catch (error) {
        console.error("error in getting items", error);
        res.status(500).send({ "message": "Internal Server Error" });
    }
};

const getStockByGroup = async (req, res) => {
    try {
        const { group } = req.params;
        const userId = req.user.id;

        const stockItems = await Stock.find({ Group: group, user: userId });

        if (!stockItems.length) {
            return res.status(404).send({ "message": "No items found in this group" });
        }

        return res.status(200).send(stockItems);
    } catch (error) {
        console.error("Error fetching group items:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const updateStock = async (req, res) => {
    try {
        let { id } = req.params;
        id = id.replace(":", "");
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ "message": "Invalid stock ID" });
        }

        const { ItemName, CostPrice, SellingPrice, AvailableQuantity, MinQuantity, ItemCode, Group } = req.body;
        const userId = req.user.id;

        if (!ItemName || isNaN(CostPrice) || isNaN(SellingPrice) || isNaN(AvailableQuantity) || isNaN(MinQuantity)) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        if (Group) {
            const groupConflict = await Stock.findOne({ Group, user: userId, _id: { $ne: id } });
            if (groupConflict) {
                return res.status(409).send({ "message": "Group already contains another item" });
            }
        }

        const stockItem = await Stock.findOne({ _id: id, user: userId });

        if (!stockItem) {
            return res.status(404).send({ "message": "Stock item not found or unauthorized access" });
        }

        const updatedStock = await Stock.findByIdAndUpdate(
            id,
            { ItemName, CostPrice, SellingPrice, AvailableQuantity, MinQuantity, ItemCode, Group },
            { new: true }
        );

        return res.status(200).send({ "message": "Stock updated successfully", stock: updatedStock });

    } catch (error) {
        console.error("Error updating stock:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const deleteStock = async (req, res) => {
    try {
        let { id } = req.params;
        id = id.replace(":", "");
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ "message": "Invalid stock ID" });
        }
        const userId = req.user.id;

        const stockItem = await Stock.findOne({ _id: id, user: userId });

        if (!stockItem) {
            return res.status(404).send({ "message": "Item not found or not owned by this user" });
        }

        await Stock.findByIdAndDelete(id);

        return res.status(200).send({ "message": "Item deleted successfully" });

    } catch (error) {
        console.error("Error deleting stock:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const createGroup = async (req, res) => {
    try {
        const { groupName, itemIds } = req.body;
        const userId = req.user.id;

        if (!groupName) {
            return res.status(400).send({ "message": "Group name is required" });
        }

        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).send({ "message": "At least one item must be selected for the group" });
        }

        const groupConflict = await Stock.findOne({ Group: groupName, user: userId });
        if (groupConflict) {
            return res.status(409).send({ "message": "Group name already exists" });
        }

        // Ensure no item is already part of another group
        const conflictingItems = await Stock.find({
            _id: { $in: itemIds },
            Group: { $ne: null },
            user: userId
        });

        if (conflictingItems.length > 0) {
            return res.status(409).send({
                "message": "Some items are already part of another group",
                conflictingItems: conflictingItems.map((item) => item.ItemName)
            });
        }

        // Update items to associate them with the new group
        await Stock.updateMany(
            { _id: { $in: itemIds }, user: userId },
            { $set: { Group: groupName } }
        );

        return res.status(201).send({ "message": "Group created successfully", groupName });
    } catch (error) {
        console.error("Error creating group:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { groupName } = req.body;
        const userId = req.user.id;

        if (!groupName) {
            return res.status(400).send({ message: "Group name is required" });
        }

        const groupExists = await Stock.findOne({ Group: groupName, user: userId });
        if (!groupExists) {
            return res.status(404).send({ message: "Group not found" });
        }

        // Remove the group from all associated items
        await Stock.updateMany({ Group: groupName, user: userId }, { $set: { Group: null } });

        return res.status(200).send({ message: `Group "${groupName}" deleted successfully` });
    } catch (error) {
        console.error("Error deleting group:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const removeFromGroup = async (req, res) => {
    try {
        const { itemIds } = req.body;
        const userId = req.user.id;

        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).send({ message: "At least one item must be selected" });
        }

        await Stock.updateMany(
            { _id: { $in: itemIds }, user: userId },
            { $set: { Group: null } }
        );

        return res.status(200).send({ message: "Items removed from group successfully" });
    } catch (error) {
        console.error("Error removing items from group:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const stockSuggestions = async (req, res) => {
    const query = req.query.query.toLowerCase();
    const userId = req.user.id;
  
    try {
      const userStocks = await Stock.find({ user: userId });
  
      const matched = userStocks
        .filter(stock => stock.ItemName.toLowerCase().includes(query))
        .map(stock => stock.ItemName);
  
      res.status(200).send({ suggestions: matched.slice(0, 10) });
    } catch (err) {
      res.status(500).send({ message: "Server error while fetching suggestions" });
    }
  }
  
const addToGroup = async (req, res) => {
    try {
      const { itemId, groupName } = req.body;
      const userId = req.user.id;
  
      if (!itemId || !groupName) {
        return res.status(400).send({ message: "Item ID and group name are required" });
      }
  
      const item = await Stock.findOne({ _id: itemId, user: userId });
  
      if (!item) {
        return res.status(404).send({ message: "Item not found or unauthorized access" });
      }
  
      if (item.Group) {
        return res.status(409).send({ message: "Item already belongs to a group" });
      }
  
      await Stock.findByIdAndUpdate(itemId, { $set: { Group: groupName } });
  
      return res.status(200).send({ message: "Item added to group successfully" });
    } catch (error) {
      console.error("Error adding item to group:", error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };
  
const getStockByName = async (req, res) => {
    try {
        const { name } = req.query;
        const userId = req.user.id;

        const stockItem = await Stock.findOne({ ItemName: name, user: userId });

        if (!stockItem) {
            return res.status(404).send({ message: "Stock item not found" });
        }

        return res.status(200).send({ unit: stockItem.Unit });
    } catch (error) {
        console.error("Error fetching stock by name:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

export { addStock, getStock, getStockByGroup, updateStock, deleteStock, createGroup, deleteGroup, removeFromGroup, stockSuggestions, addToGroup, getStockByName };