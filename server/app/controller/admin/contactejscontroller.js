
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { ContactListModel } = require("../../model/contact");

class ContactController {

  async createContact(req, res) {
    try {
      console.log("BODY:", req.body);

      const { description, address, phone, gmail } = req.body;

      // Create new contact info document
      const contactInfo = new ContactListModel({
        description,
        address,
        phone,
        gmail,
      });

      // Save to DB
      const data = await contactInfo.save();

      if (data) {
       return res.redirect('/contact/list')
      } else {
       return res.redirect('/contact/add')
      }
    } catch (error) {
      return res.redirect('/contact/add')
    }
  }
    async list(req, res) {
        try {
            const data = await ContactListModel.find();


            res.render('contact/list',
                {
                    title: "Contact List",
                    data: data
                });
        } catch (error) {
            res.redirect('/contact/list', { message: error.message })
        }
    }
    async addPage(req, res) {

        try {
            res.render('contact/add', {
                title: "contact add",
                data: req.user
            });
        } catch (error) {
            res.redirect('/contact/add', { message: error.message })
        }
    }
    async edit(req, res) {
        try {
            const id = req.params.id
            const editdata = await  ContactListModel.findById(id)
            res.render('contact/edit', {
                title: "edit page",
                data: editdata
            })

        } catch (error) {
            console.log(error);


        }

    }



    async update(req, res) {
        try {
            const id = req.params.id;

            // Fetch the existing banner document
            const existingBanner = await  ContactListModel.findById(id);
            if (!existingBanner) {
                return res.status(404).json({
                    status: false,
                    message: "About not found",
                });
            }

            let updateData = { ...req.body };

            // If a new image is uploaded
            if (req.file) {
                // Delete the old image file if it exists
                if (existingBanner.image) {
                    const oldImagePath = path.join(__dirname, '..', '..', "..", existingBanner.image);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error("Error deleting old image:", err);
                        } else {
                            console.log("Old image deleted successfully.");
                        }
                    });
                }

                // Update the image path in the update data
                updateData.image = req.file.path;
                console.log("New image uploaded and path added:", req.file.path);
            }

            // Update the banner document
            const updatedBanner = await  ContactListModel.findByIdAndUpdate(id, updateData, {
                new: true,
            });

            if (!updatedBanner) {
                return res.status(404).json({
                    status: false,
                    message: "Banner not found",
                });
            }

            res.redirect('/contact/list');
        } catch (error) {
            console.error("Update error:", error);
            return res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }


    async delete(req, res) {
        console.log(req.body);

        try {
            const id = req.params.id

            await  ContactListModel.findByIdAndDelete(id)
          

         

            res.redirect('/contact/list')


        } catch (error) {
            console.log(error);
            console.error('Error deleting file:', err);
        }

    }
}
module.exports = new ContactController()