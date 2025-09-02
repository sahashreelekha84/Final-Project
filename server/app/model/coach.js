const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  userId:{type: mongoose.Schema.Types.ObjectId, ref: "user" },
  name: String,
  coachType: String,
  workplace: String,
  clientCount: {
    type: String,
    enum: ["1-10", "11-50", "50+"],
    default: "1-10"
  },
  onboardingCompleted: { type: Boolean, default: false },
  firstLogin: { type: Boolean, default: true },
  status: { type: String, enum: ["active", "inactive", "pending"], default: "pending" }
});

module.exports = mongoose.model('Coach', coachSchema);
