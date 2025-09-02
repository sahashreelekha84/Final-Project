const mongoose=require('mongoose')
const Schema=mongoose.Schema
const workspaceSchema = new Schema({
  orgName: String,
  settings: Schema.Types.Mixed,
  commissionPercent: Number,
  plan: String
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);
