const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/banner');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const StudentImageupload = multer({ storage: storage });

// 👇 allow both single "image" and multiple "icons"
module.exports = StudentImageupload.fields([
  { name: "image", maxCount: 1 },
  { name: "icons", maxCount: 10 }
]);
