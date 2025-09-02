const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for contact form submissions
const contactSchema = new Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true }, 
  message: { type: String, required: true } 
}, { timestamps: true }); 

// Schema for company contact details
const contactlistSchema = new Schema({
  description: { type: String },
  address: { type: String },
  phone: { type: String },
  gmail: { type: String },
   name: { type: String,}, 
  email: { type: String, }, 
  message: { type: String,  } 
});

module.exports = {
  ContactModel: mongoose.model("Contact", contactSchema),
  ContactListModel: mongoose.model("ContactList", contactlistSchema),
};
