import Group from "../models/groupModel.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// @desc    Create a new group
// @route   POST /group
// @access  Private
// @fields title, description
// @description This route is used to create a new group. Only the user can create a group.
const createGroup = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const group = await Group.create({
        title,
        description,
        manager: req.user._id,
    });
    if (group) {
        user.groups.push(group);
        await user.save();
        res.status(201).json({
            _id: group._id,
            name: group.title,
            description: group.description,
            manager: group.manager,
        });
    } else {
        res.status(400);
        throw new Error("Invalid group data");
    }
});

// @desc   Get your group
// @route  GET /group/:id
// @access Private
// @description This route is used to get a group. Only the user can see their groups.
const getGroup = asyncHandler(async (req, res) => {
    const groupID = new mongoose.Types.ObjectId(req.params.id);
    const members = await User.find({ groups: groupID }).select("name email");
    if (!members) {
        res.status(404);
        throw new Error("No members found in this group");
    }
    const group = await Group.findById(groupID).populate("manager", "name email");
    if (group) {
        res.status(200).json({
            title: group.title,
            manager: group.manager,
            members: members,
        });
    } else {
        res.status(404);
        throw new Error("No groups found");
    }
});

// @desc  Update group
// @route PUT /group/:id
// @access Private
// @fields title, description
// @description This route is used to update a group. Only the manager can update their groups.
const updateGroup = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }
    if (group.manager.toString() !== req.user_id) {
        res.status(401);
        throw new Error("Not authorized to update this group");
    }
    group.title = title || group.title;
    group.description = description || group.description;
    const updatedGroup = await group.save();
    if (!updatedGroup) {
        res.status(400);
        throw new Error("Invalid group data");
    }
    res.status(200).json({
        _id: updatedGroup._id,
        title: updatedGroup.title,
        description: updatedGroup.description,
    });
});

// @desc  Delete group
// @route DELETE /group/:id
// @access Private
// @description This route is used to delete a group. Only the manager can delete their groups.
const deleteGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);
    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (group.manager.toString() !== user._id.toString()) {
        res.status(401);
        throw new Error("Not authorized to delete this group");
    }
    user.groups.remove(group._id);
    await user.save();
    await group.remove();
    res.status(200).json({ message: "Group removed" });
});

export { createGroup, getGroup, updateGroup, deleteGroup };
