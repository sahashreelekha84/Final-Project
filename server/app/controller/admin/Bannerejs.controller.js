const BannerModel = require('../../model/banner')
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
class BannerController {

 async createbanner(req, res) {
    try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const {
            title,
            subtitle,
            overlay,
            videoHref,
            videoText,
            videoIcon,
            boxes, // JSON string
        } = req.body;

        // Create new banner doc
        const sdata = new BannerModel({
            title,
            subtitle,
            overlay: overlay === "true" || overlay === true,
            video: {
                href: videoHref,
                text: videoText,
                iconClass: videoIcon,
            },
        });

        // ✅ handle main image
        if (req.files && req.files["image"] && req.files["image"][0]) {
            sdata.image = req.files["image"][0].path;
        }

        // ✅ handle icons (multiple)
        if (req.files && req.files["icons"]) {
            const uploadedIcons = req.files["icons"].map(f => f.path);

            // If boxes JSON provided, merge icons into it
            if (boxes) {
                try {
                    let parsedBoxes = JSON.parse(boxes);

                    // Attach uploaded icons (replace "icon" fields in order)
                    parsedBoxes = parsedBoxes.map((box, idx) => ({
                        ...box,
                        icon: uploadedIcons[idx] || box.icon, // use uploaded path if exists
                    }));

                    sdata.boxes = parsedBoxes;
                } catch (err) {
                    console.error("❌ Boxes JSON invalid:", err.message);
                    return res.status(400).send("Invalid JSON format for boxes");
                }
            } else {
                // if no boxes JSON, still store icons
                sdata.boxes = uploadedIcons.map(iconPath => ({
                    icon: iconPath,
                    title: "",
                    text: "",
                    link: "",
                }));
            }
        } else if (boxes) {
            // If no icon uploads but JSON exists
            try {
                sdata.boxes = JSON.parse(boxes);
            } catch (err) {
                console.error("❌ Boxes JSON invalid:", err.message);
                return res.status(400).send("Invalid JSON format for boxes");
            }
        }

        // Save to DB
        const data = await sdata.save();

        if (data) {
            res.redirect("/banner/list");
        } else {
            res.redirect("/banner/add");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating banner", error });
    }
}

    async list(req, res) {
        try {
            const data = await BannerModel.find({ isDeleted: false });


            res.render('banner/list',
                {
                    title: "Banner List",
                    data: data
                });
        } catch (error) {
            res.redirect('/banner/list', { message: error.message })
        }
    }
    async addPage(req, res) {

        try {
            res.render('banner/add', {
                title: "Banner add",
                data: req.user
            });
        } catch (error) {
            res.redirect('/banner/add', { message: error.message })
        }
    }
    async edit(req, res) {
        try {
            const id = req.params.id
            const editdata = await BannerModel.findById(id)
            res.render('banner/edit', {
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
            const existingBanner = await BannerModel.findById(id);
            if (!existingBanner) {
                return res.status(404).json({
                    status: false,
                    message: "Banner not found",
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

            const updatedata = await BannerModel.findByIdAndUpdate(id, { isDeleted: true })
            if (!updatedata) {
                return res.status(404).json({
                    status: false,
                    message: "banner not found",
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

            res.redirect('/banner/list')


        } catch (error) {
            console.log(error);
            console.error('Error deleting file:', err);
        }

    }
}
module.exports = new BannerController()