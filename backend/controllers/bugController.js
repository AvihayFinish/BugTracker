import asyncHandler from "express-async-handler";
import Bug from "../models/bugModel.js";
import User from "../models/userModel.js";

// @desc    Create a new bug
// @route   POST /bugs
// @access  Private
const createBug = asyncHandler(async (req, res) => {
    const {title, description, status, priority, takedBy} = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const bug = await Bug.create({
        title,
        description,
        status,
        priority,
        createdBy: req.user._id,
        takedBy,
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
const getBugs = asyncHandler(async (req, res) => {
    let { priority, status } = req.query;
    let filter = {};
    if (priority) {
        filter.priority = priority;
    }
    if (status) { 
        filter.status = status;
    }
    const bugs = await Bug.find(filter).populate("createdBy", "name email").populate("takedBy", "name email");
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
const getBugById = asyncHandler(async (req, res) => {
    const bug = await Bug.findById(req.params.id).populate("createdBy", "name email").populate("takedBy", "name email");
    if (bug) {
        res.status(200).json(bug);
    } else {
        res.status(404);
        throw new Error("Bug not found");
    }
});

// @desc    Update a bug
// @route   PUT /bugs/:id
// @access  Private
const updateBug = asyncHandler(async (req, res) => {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
        res.status(404);
        throw new Error("Bug not found");
    }
    const user = await User.findById(req.user._id);
    if (!user.isAdmin && bug.createdBy.toString() !== req.user._id.toString() && bug.takedBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this bug");
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
const deleteBug = asyncHandler(async (req, res) => {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
        res.status(404);
        throw new Error("Bug not found");
    }
    const user = await User.findById(req.user._id);
    if (!user.isAdmin && bug.createdBy.toString() !== req.user._id.toString() && bug.takedBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this bug");
    }
    if (bug) {
        await bug.deleteOne();
        res.status(200).json({ message: "Bug removed" });
    }
});

export { createBug, getBugs, getBugById, updateBug, takeBug, deleteBug };