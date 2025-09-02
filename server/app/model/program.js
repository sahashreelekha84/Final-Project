const mongoose = require('mongoose')
const Schema = mongoose.Schema
const programSchema = new Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  coachId:{ type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
  name: String,
  goal: String,
  schedule: [{
    day: Number,
    items: [{
      exercise:String,
      sets: Number,
      reps: Number,
      durationSec: Number,
      notes: String
    }]
  }],
  createdBy: Schema.Types.ObjectId,
  visibility: { type: String, enum: ['private', 'workspace', 'public'], default: 'workspace' }
}, { timestamps: true });

const assignmentSchema = new Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  coachId:{ type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  mealPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['active', 'paused', 'completed'] }
}, { timestamps: true });

module.exports = {
  Program: mongoose.model('Program', programSchema),
  Assignment: mongoose.model('Assignment', assignmentSchema)
};
