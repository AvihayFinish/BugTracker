import mongoose from "mongoose";

const groupRequestSchema = mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["request", "invite"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const GroupRequest = mongoose.model("GroupRequest", groupRequestSchema);
export default GroupRequest;
// This model represents a request from a user to join a group and invite from manager to join. It includes the group ID, user ID, 
// and the status of the request (pending, accepted, or rejected).