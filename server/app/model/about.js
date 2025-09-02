const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aboutSchema = new Schema(
  {
title: { type: String, required: true },
subtitle:{type: String, required: true },
  description: { type: String },
  highlight: { type: String } ,
  text:{type:String},
  image:{type:String},

    // Soft delete flag
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AboutModel = mongoose.model("about", aboutSchema);
module.exports = AboutModel;
