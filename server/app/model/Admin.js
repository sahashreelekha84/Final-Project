const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  firstLogin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", adminSchema);