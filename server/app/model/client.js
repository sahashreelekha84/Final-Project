const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
 
  name: { type: String, required: true },
  email: String,
  contactNumber: String,
  location: String,
subscriptionPlan: [{ type: String, enum: ["monthly", "quarterly", "yearly"] }],
 fitnessInterests: [{
    type: String,
    enum: ["weight_loss", "muscle_gain", "cardio", "flexibility", "endurance"]
  }],
  roleId:{ type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
  status: {
    type: String,
    enum: ['connected', 'pending', 'offline', 'waiting-activation'],
    default: 'pending'
  },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
