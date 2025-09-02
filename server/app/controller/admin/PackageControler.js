const fs = require("fs");
const {Package} = require("../../model/subscription");

class PackageController {

async createPackage(req, res) {
  try {
    const {
      workplace,
      name,
      price,
      currency,
      billingCycle,
      features,
      services // ✅ get services from req.body
    } = req.body;

    // Basic validation
    if (!workplace || !name || !price || !currency || !billingCycle) {
      return res.status(400).render("error", { message: "All fields are required" });
    }

    const packagedata = new Package({
      workplace,
      name,
      price,
      currency,
      billingCycle,

      // Handle features array
      features: features
        ? Array.isArray(features)
          ? features
          : features.split(",")
        : [],

      // ✅ Handle services array (each must contain icon, title, text)
      services: services
        ? Array.isArray(services)
          ? services
          : JSON.parse(services) // if coming as stringified JSON
        : []
    });

    const data = await packagedata.save();
    if (data) {
      return res.redirect("/package/list"); // success
    }
    res.redirect("/package/add"); // fallback
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
}



  async listPackage(req, res) {
    try {
      const data = await Package.find()// lean for performance
      res.render("package/list", { title: "Package List", data });
    } catch (error) {
      console.error("Error fetching package list:", error);
    
    }
  }


  async addPagePackage(req, res) {
    try {
      res.render("package/add", { title: "Add Package", data: req.user });
    } catch (error) {
      console.error("Error loading add page:", error);
     
    }
  }

  // ✅ Show edit form
  async editPackage(req, res) {
    try {
      const id = req.params.id;
      const editpackage = await Package.findById(id).lean();
      if (!editpackage) {
        return res.redirect("/package/list");
      }
      res.render("package/edit", { title: "Edit Package", data: editpackage });
    } catch (error) {
      console.error("Error loading edit page:", error);
    
    }
  }

  // ✅ Update package
  async update(req, res) {
    try {
      const id = req.params.id;
      const existingPackage = await Package.findById(id);
      if (!existingPackage) {
        return res.redirect("/package/list");
      }

      let updateData = { ...req.body };

      if (updateData.features) {
        if (Array.isArray(updateData.features)) {
          updateData.features = updateData.features;
        } else {
          updateData.features = updateData.features.split(",");
        }
      }

      if (req.file) {
        updateData.image = req.file.path;

        // Delete old image if exists
        if (existingPackage.image) {
          fs.unlink(existingPackage.image, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }
      }

      await Package.findByIdAndUpdate(id, updateData, { new: true });
      res.redirect("/package/list");
    } catch (error) {
      console.error("Update error:", error);
    
    }
  }

  // ✅ Soft delete a package
  async delete(req, res) {
    try {
      const id = req.params.id;
      await Package.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(), // keep deletion metadata
      });

      res.redirect("/package/list");
    } catch (error) {
      console.error("Delete error:", error);
     
    }
  }
}

module.exports = new PackageController();
