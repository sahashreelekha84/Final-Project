const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const teamMemberSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    coachId: { type: Schema.Types.ObjectId, ref: "coach", required: true },

    role: {
      type: String,
      enum: ["owner", "admin", "member", "viewer"], 
      default: "member",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    addedBy: { type: Schema.Types.ObjectId, ref: "coach" }, 
  },
  { timestamps: true }
);

module.exports = model("TeamMember", teamMemberSchema);
