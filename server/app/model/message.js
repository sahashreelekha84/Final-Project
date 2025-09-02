const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const conversationSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace" },
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // Optional: store last message for quick dashboard query
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },

    isGroup: { type: Boolean, default: false }, // group vs 1-to-1 chat
    name: { type: String }, // group name
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const messageSchema = new Schema(
  {
    convoId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    senderId: { type: Schema.Types.ObjectId, ref: "User" },

    type: { type: String, enum: ["text", "image", "video", "file", "reaction"], default: "text" },

    body: { type: String, trim: true },
    mediaRef: { type: String },
    reaction: { type: String },

    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = {
  Conversation: mongoose.model("Conversation", conversationSchema),
  Message: mongoose.model("Message", messageSchema),
};
