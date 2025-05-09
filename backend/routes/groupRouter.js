import express from "express";
import { createGroup, getGroup, updateGroup, deleteGroup } from "../controllers/groupController.js";
import { createGroupRequest, 
        createGroupInvite, 
        getGroupRequests,
        getGroupsInvites,
        responseGroupInvite,
        responseGroupRequest,
        deleteGroupRequest, } from "../controllers/groupRequestsController.js";
import { protect } from "../midlleware/authMiddleware.js";
import validateIdMongo from "../utils/validateIdMongo.js";

const groupRouter = express.Router();

groupRouter.route("/").post(protect, createGroup);
groupRouter.route("/request").post(protect, createGroupRequest);
groupRouter.route("/requests").get(protect, getGroupRequests);
groupRouter.route("/invite").post(protect, createGroupInvite);
groupRouter.route("/invites").get(protect, getGroupsInvites);
groupRouter.route("/invite/:id/response").patch(protect, validateIdMongo, responseGroupInvite);
groupRouter.route("/request/:id/response").patch(protect, validateIdMongo, responseGroupRequest);
groupRouter.route("/request/:id").delete(protect, validateIdMongo, deleteGroupRequest);
groupRouter.route("/:id")
            .put(protect, validateIdMongo, updateGroup)
            .delete(protect, validateIdMongo, deleteGroup)
            .get(protect, validateIdMongo, getGroup);


export default groupRouter;
// This code defines the routes for managing groups in a project management application. 
// It uses Express.js to create a router that handles HTTP requests