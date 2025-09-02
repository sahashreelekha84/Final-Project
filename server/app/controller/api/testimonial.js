const Testimonial = require("../../model/testimonial");

class testimonialController{
async listTestimonials (req, res)  {
  try {
    const testimonials = await Testimonial.find();
    res.render("testimonial/list", { testimonials });
  } catch (err) {
    console.error(err);
    res.send("Error fetching testimonials");
  }
};

// Add form
async addForm(req, res) {
  res.render("testimonial/add");
};

// Create testimonial
async createTestimonial(req, res){
  try {
    const { name, title, text, rating } = req.body;
    const image = req.files && req.files.length ? req.files[0].filename : null;
    const gallery = req.files && req.files.length > 1
      ? req.files.slice(1).map(file => file.filename)
      : [];

    const newTestimonial = new Testimonial({ name, title, text, rating, image, gallery });
    await newTestimonial.save();
    res.redirect("/testimonial/list");
  } catch (err) {
    console.error(err);
    res.send("Error creating testimonial");
  }
};

// Edit form
async editForm(req, res)  {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    res.render("testimonial/edit", { testimonial });
  } catch (err) {
    console.error(err);
    res.send("Error fetching testimonial");
  }
};

// Update testimonial
 async updateTestimonial(req, res) {
  try {
    const { name, title, text, rating } = req.body;
    let updateData = { name, title, text, rating };

    if (req.files && req.files.length) {
      updateData.image = req.files[0].filename;
      if (req.files.length > 1) updateData.gallery = req.files.slice(1).map(file => file.filename);
    }

    await Testimonial.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/testimonial/list");
  } catch (err) {
    console.error(err);
    res.send("Error updating testimonial");
  }
};

// Delete testimonial
async deleteTestimonial(req, res)  {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.redirect("/testimonial/list");
  } catch (err) {
    console.error(err);
    res.send("Error deleting testimonial");
  }
};

}
module.exports=new testimonialController()