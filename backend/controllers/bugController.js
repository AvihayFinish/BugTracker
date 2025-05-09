import asyncHandler from "express-async-handler";
import Bug from "../models/bugModel.js";
import User from "../models/userModel.js";
import Group from "../models/groupModel.js";

// @desc    Create a new bug
// @route   POST /bugs
// @access  Private
// @fields title, description, status, priority, takedBy, groupID
// @description This route is used to create a new bug. Only the user can create a bug in a group.
const createBug = asyncHandler(async (req, res) => {
    const {title, description, status, priority, takedBy, groupID} = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (!user.groups.includes(groupID)) {
        res.status(403);
        throw new Error("Not authorized to create a bug in this group");
    }

    const bug = await Bug.create({
        title,
        description,
        status,
        priority,
        createdBy: req.user._id,
        takedBy,
        group: groupID,
    });
    if (bug) {
        res.status(201).json({
            _id: bug._id,
            title: bug.title,
            description: bug.description,
            status: bug.status,
            priority: bug.priority,
            createdBy: user.name,
            takedBy: bug.takedBy,
        });
    } else {
        res.status(400);
        throw new Error("Invalid bug data");
    }
});

// @desc    Get all bugs
// @route   GET /bugs
// @access  Private
// @description This route is used to get bugs. Only the user can see the bugs in their groups.
const getBugs = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    let { priority, status } = req.query;
    let filter = { group: { $in: user.groups } };
    if (priority) {
        filter.priority = priority;
    }
    if (status) { 
        filter.status = status;
    }
    const bugs = await Bug.find(filter).populate("createdBy", "name email").populate("takedBy", "name email").populate("group", "title description").sort({ createdAt: -1 });
    if (bugs) {
        res.status(200).json(bugs);
    } else {
        res.status(404);
        throw new Error("No bugs found");
    }
});

// @desc    Get a bug by ID
// @route   GET /bugs/:id
// @access  Private
// @description This route is used to get a bug by ID. Only the user can see the bug in their groups.
const getBugById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const bug = await Bug.findById(req.params.id).populate("createdBy", "name email").populate("takedBy", "name email");
    if (!bug) {
        res.status(404);
        throw new Error("Bug not found");
    }
    if (!user.groups.includes(bug.group._id)) {
        res.status(403);
        throw new Error("Not authorized to view this bug");
    }
    
    res.status(200).json(bug);
});

// @desc    Update a bug
// @route   PUT /bugs/:id
// @access  Private
// @fields title, description, status, priority
// @description This route is used to update a bug. Only the user can update the bug in their groups.
const updateBug = asyncHandler(async (req, res) => {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
        res.status(404);
        throw new Error("Bug not found");
    }

    const group = await Group.findById(bug.group).select("manager");
    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }

    const user = await User.findById(req.user._id);
    const isAuthorized = group.manager.toString() === user._id.toString() || 
                        bug.createdBy.toString() === user._id.toString() ||
                        bug.takedBy.toString() === user._id.toString();
    if (!isAuthorized) {
        res.status(403);
        throw new Error("Not authorized to update this bug");
    }

    const { title, description, status, priority } = req.body;
    if (bug) {
        bug.title = title || bug.title;
        bug.description = description || bug.description;
        bug.status = status || bug.status;
        bug.priority = priority || bug.priority;

        const updatedBug = await bug.save();
        res.status(200).json({
            _id: updatedBug._id,
            title: updatedBug.title,
            description: updatedBug.description,
            status: updatedBug.status,
            priority: updatedBug.priority,
        });
    }
});

// @desc    Take a bug
// @route   PUT /bugs/take/:id
// @access  Private
// @description This route is used to take a bug. Only the user can take the bug in their groups.
const takeBug = asyncHandler(async (req, res) => {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
        res.status(404);
        throw new Error("Bug not found");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (!user.groups.includes(bug.group)) {
        res.status(403);
        throw new Error("Not authorized to take this bug");
    }
    if (bug.takedBy !== "no one") {
        res.status(400);
        throw new Error("Bug already taken by someone else");
    }
    bug.takedBy = user._id;
    await bug.save();
    res.status(200).json({ message: "Bug taken successfully" });
});

// @desc    Delete a bug
// @route   DELETE /bugs/:id
// @access  Private
// @description This route is used to delete a bug. Only the user and the manager can delete the bug in their groups.
const deleteBug = asyncHandler(async (req, res) => {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
        res.status(404);
        throw new Error("Bug not found");
    }
    const group = await Group.findById(bug.group).select("manager");
    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }
    const user = await User.findById(req.user._id);
    const isAuthorized = group.manager.toString() === user._id.toString() || 
                        bug.createdBy.toString() === user._id.toString();
    if (!isAuthorized) {
        res.status(403);
        throw new Error("Not authorized to update this bug");
    }

    await bug.deleteOne();
    res.status(200).json({ message: "Bug removed" });
});

export { createBug, getBugs, getBugById, updateBug, takeBug, deleteBug };