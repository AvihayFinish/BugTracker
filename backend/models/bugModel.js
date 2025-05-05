import mongoose from "mongoose";

const bugSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "in progress", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    takedBy: {
        type: String,
        default: "no one",
    }
  },
  {
    timestamps: true,
  }
);

const Bug = mongoose.model("Bug", bugSchema);
export default Bug;