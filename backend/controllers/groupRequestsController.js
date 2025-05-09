import GroupRequest from "../models/groupRequestModel.js";
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// @asec    Create a new group request
// @route   POST /group/request
// @access  Private
// @fields groupID
// @description This route is used to create a new group request. Only the user can send a request to join a group.
const createGroupRequest = asyncHandler(async (req, res) => {
    const { groupID } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const group = await Group.findById(groupID);
    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }

    const groupRequest = await GroupRequest.create({
        group: groupID,
        user: req.user._id,
        type: "request",
        status: "pending",
    });

    if (groupRequest) {
        res.status(201).json({
            _id: groupRequest._id,
            group: groupRequest.group,
            user: groupRequest.user,
            type: groupRequest.type,
            status: groupRequest.status,
        });
    } else {
        res.status(400);
        throw new Error("Invalid request data");
    }
});

// @desc    Create a new group invite
// @route   POST /group/invite
// @access  Private
// @fields groupID, userID
// @description This route is used to create a new group invite. Only the group manager can send invites.
const createGroupInvite = asyncHandler(async (req, res) => {
    const { groupID, userID } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const group = await Group.findById(groupID);
    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }

    if (req.user._id.toString() !== group.manager.toString()) {
        res.status(403);
        throw new Error("Only the group manager can send invites");
    }

    const groupRequest = await GroupRequest.create({
        group: groupID,
        user: userID,
        type: "invite",
        status: "pending",
    });

    if (groupRequest) {
        res.status(201).json({
            _id: groupRequest._id,
            group: groupRequest.group,
            user: groupRequest.user,
            type: groupRequest.type,
            status: groupRequest.status,
        });
    } else {
        res.status(400);
        throw new Error("Invalid request data");
    }
});

// @desc    Get all group requests
// @route   GET /group/requests
// @access  Private
// @fields groupID
// @description This route is used to get all group requests for a specific group. Only the group manager can view the requests.
const getGroupRequests = asyncHandler(async (req, res) => {
    const { groupID } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const group = await Group.findById(groupID);
    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }

    if (req.user._id.toString() !== group.manager.toString()) {
        res.status(403);
        throw new Error("Only the group manager can view requests");
    }

    const groupRequests = await GroupRequest.find({ group: groupID }).populate("user", "name email");

    if (groupRequests) {
        res.status(200).json(groupRequests);
    } else {
        res.status(404);
        throw new Error("No requests found for this group");
    }
});

// @desc    Get all group invites
// @route   GET /group/invites
// @access  Private
// @description This route is used to get all group invites for the logged-in user.
const getGroupsInvites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const groupRequests = await GroupRequest.find({ user: req.user._id, type: "invite" }).populate("group", "title description");
    if (groupRequests) {
        res.status(200).json(groupRequests);
    } else {
        res.status(404);
        throw new Error("No invites found for this user");
    }
});

// @desc    Response a group invite
// @route   PATCH /group/invite/:id/response
// @access  Private
// @fields status
// @description This route is used to accept or reject a group invite. Only the invited user can respond to the invite.
const responseGroupInvite = asyncHandler(async (req, res) => {
    const invite = await GroupRequest.findById(req.params.id);
    if (!invite) {
        res.status(404);
        throw new Error("Invite not found");
    }
    if (invite.status !== "pending") {
        res.status(400);
        throw new Error("Invite already accepted or rejected");
    }
    if (invite.type !== "invite") {
        res.status(400);
        throw new Error("This is not an invite request");
    }

    if (req.user._id.toString() !== invite.user.toString()) {
        res.status(403);
        throw new Error("Only the invited user can accept the invite");
    }

    const { status } = req.body;
    if (status !== "accepted" && status !== "rejected") {
        res.status(400);
        throw new Error("Invalid status value. Use 'accepted' or 'rejected'.");
    }
    if (status === "rejected") {
        invite.status = "rejected";
        await invite.save();
        res.status(200).json({ message: "Invite rejected", invite });
        return;
    }

    invite.status = "accepted";
    await invite.save();

    const user = await User.findById(invite.user);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    user.groups.push(invite.group);
    await user.save();
    res.status(200).json({ massage: "Invite accepted", invite });
});

// @desc    Response a group request
// @route   PATCH /group/request/:id/response
// @access  Private
// @fields status
// @description This route is used to accept or reject a group request. Only the group manager can respond to the request.
const responseGroupRequest = asyncHandler(async (req, res) => {
    const request = await GroupRequest.findById(req.params.id);
    if (!request) {
        res.status(404);
        throw new Error("Request not found");
    }
    if (request.status !== "pending") {
        res.status(400);
        throw new Error("Request already accepted or rejected");
    }
    if (request.type !== "request") {
        res.status(400);
        throw new Error("This is not a request");
    }

    const group = await Group.findById(request.group);
    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }
    if (req.user._id.toString() !== group.manager.toString()) {
        res.status(403);
        throw new Error("Only the group manager can respond to requests");
    }

    const { status } = req.body;
    if (status !== "accepted" && status !== "rejected") {
        res.status(400);
        throw new Error("Invalid status value. Use 'accepted' or 'rejected'.");
    }
    if (status === "rejected") {
        request.status = "rejected";
        await request.save();
        res.status(200).json({ message: "Request rejected", request });
        return;
    }

    request.status = "accepted";
    await request.save();

    const user = await User.findById(request.user);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    user.groups.push(request.group);
    await user.save();
    res.status(200).json({ message: "Request accepted", request });
});

// @desc    Delete a group request or invite
// @route   DELETE /group/request/:id
// @access  Private
// @description This route is used to delete a group request or invite. Only the user who created the request or the group manager can delete it.
const deleteGroupRequest = asyncHandler(async (req, res) => {
    const request = await GroupRequest.findById(req.params.id);
    if (!request) {
        res.status(404);
        throw new Error("Request not found");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (request.type === "request" && request.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Only the user who created the request can delete it");
    }

    if (request.type === "invite") {
        const group = await Group.findById(request.group);
        if (!group) {
            res.status(404);
            throw new Error("Group not found");
        }
        if (group.manager.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("Only the group manager can delete the invite");
        }
    }

    await request.remove();
    res.status(200).json({ message: "Request deleted" });
});

export {
    createGroupRequest,
    createGroupInvite,
    getGroupRequests,
    getGroupsInvites,
    responseGroupInvite,
    responseGroupRequest,
    deleteGroupRequest,
};

