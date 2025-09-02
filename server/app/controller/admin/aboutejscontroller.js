
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const AboutModel = require('../../model/about');
class AboutController {

    async createabout(req, res) {
        try {
            console.log("BODY:", req.body);
            console.log("FILES:", req.files);

            const {
                subtitle,
                title,
                highlight,
                text,
               isDeleted } = req.body;

            // Create new banner doc
            const sdata = new AboutModel({
                subtitle,
                title,
                highlight,
                text,
                isDeleted
            });

          

        if(req.file){
            sdata.image=req.file.path
        }

            // Save to DB
            const data = await sdata.save();

            if (data) {
                res.redirect("/about/list");
            } else {
                res.redirect("/about/add");
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating banner", error });
        }
    }

    async list(req, res) {
        try {
            const data = await AboutModel.find({ isDeleted: false });


            res.render('about/list',
                {
                    title: "About List",
                    data: data
                });
        } catch (error) {
            res.redirect('/about/list', { message: error.message })
        }
    }
    async addPage(req, res) {

        try {
            res.render('about/add', {
                title: "About add",
                data: req.user
            });
        } catch (error) {
            res.redirect('/about/add', { message: error.message })
        }
    }
    async edit(req, res) {
        try {
            const id = req.params.id
            const editdata = await AboutModel.findById(id)
            res.render('about/edit', {
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
            const existingBanner = await AboutModel.findById(id);
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
            const updatedBanner = await BannerModel.findByIdAndUpdate(id, updateData, {
                new: true,
            });

            if (!updatedBanner) {
                return res.status(404).json({
                    status: false,
                    message: "Banner not found",
                });
            }

            res.redirect('/banner/list');
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

            const updatedata = await AboutModel.findByIdAndUpdate(id, { isDeleted: true })
            if (!updatedata) {
                return res.status(404).json({
                    status: false,
                    message: "about not found",
                });
            }

            if (updatedata.image) {

                const absolutePath = path.join(__dirname, '..', '..', "..", updatedata.image);
                console.log("__dirname to delete:", __dirname);
                console.log("Attempting to delete:", absolutePath);

                if (fsSync.existsSync(absolutePath)) {
                    await fs.unlink(absolutePath);
                    console.log(absolutePath);

                    console.log("File deleted:", absolutePath);
                } else {
                    console.log("File not found:", absolutePath);
                }
            }

            res.redirect('/about/list')


        } catch (error) {
            console.log(error);
            console.error('Error deleting file:', err);
        }

    }
}
module.exports = new AboutController()