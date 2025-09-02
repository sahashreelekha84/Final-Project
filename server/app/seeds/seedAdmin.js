const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const role = require("../model/role");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.my_email || 'shreelekhasaha2000@gmail.com',
    pass: process.env.my_password || 'cvmgyapcgnbtnkrz',
  },
});
const seedAdmin = async () => {


  // Generate random one-time password
  const email = `sourao113@yopmail.com`;
  const password = Math.random().toString(36).slice(-8);
  const hashedpassword = await bcrypt.hash(password, 10);
  const adminRole = await role.findOne({ name: "admin" });

    const exists = await Admin.findOne({email});
    if (exists) {
      console.log("Admin already exists",exists.password);
      return;
    }
  await Admin.create({
    email,
    password: hashedpassword,
    firstLogin: true,
    roleId: adminRole._id // Require admin to set a new password
  });
  await transporter.sendMail({
    from: process.env.my_email || 'shreelekhasaha2000@gmail.com',
    to: email,
    subject: "Your Admin OTP",
    text: `Your one-time password for first login is: ${password}`,
  });


  console.log(`Admin OTP created: ${password} (email/send via email)`);
};

module.exports = seedAdmin;
