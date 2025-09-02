const express = require("express");
const router = express.Router();
const testimonialController = require("../../controller/admin/testimonialejs");
const upload = require("../../helper/testimonialimageupload"); 
const AuthCheck = require('../../middleware/auth')
// List all testimonials
router.get("/testimonial/list", AuthCheck, testimonialController.listTestimonials);

// Add testimonial form
router.get("/testimonial/add",AuthCheck, testimonialController.addForm);

// Create testimonial
router.post("/create/testimonial",  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 }
  ]),AuthCheck, testimonialController.createTestimonial);

// Edit testimonial form
router.get("/testimonial/edit/:id", AuthCheck,testimonialController.editForm);

// Update testimonial
router.post("/testimonial/update/:id",  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 }
  ]),AuthCheck, testimonialController.updateTestimonial);

// Delete testimonial
router.get("/testimonial/delete/:id", AuthCheck,testimonialController.deleteTestimonial);

module.exports = router;
