const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testimonialSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true }, // e.g., "Client"
  image: { type: String }, // single main testimonial image
  text: { type: String, required: true },
  rating: { type: Number, default: 5 },
  gallery: [{ type: String }], // array of gallery images
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
