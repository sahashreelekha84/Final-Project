const { comparepassword, hashedpassword } = require("../../middleware/AuthCheck");
const Admin = require("../../model/Admin");
const jwt = require('jsonwebtoken');
const Coach = require("../../model/coach");
const Client = require("../../model/client");
const Role = require("../../model/role");
class AdminController {
  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;

      // 1️⃣ Find user across all models
      const user =
        (await Admin.findOne({ email })) ||
        (await Coach.findOne({ email })) ||
        (await Client.findOne({ email }));

      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      // 2️⃣ Compare password
      const isMatch = await comparepassword(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      // 3️⃣ Fetch role info
      const role = await Role.findById(user.roleId);

      // 4️⃣ Create JWT payload
      const payload = {
        id: user._id,
        email: user.email,
        roleId: user.roleId,
        roleName: role?.name,
        permissions: role?.permissions || [],
        firstLogin: user.firstLogin || false,
      };

      // 5️⃣ Generate token
      const token = jwt.sign(payload, process.env.JWT_SECRECT_KEY, {
        expiresIn: user.firstLogin ? "15m" : "7d",
      });

      // 6️⃣ Send response
      res.status(200).json({
        status: true,
        message: user.firstLogin
          ? "OTP verified. Please set your password"
          : "Login successful",
        user: {
          _id: user._id,
          email: user.email,
          roleId: user.roleId,
          roleName: role?.name,
          permissions: role?.permissions || [],
        },
        token,
        firstLogin: user.firstLogin,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  async setPassword(req, res) {
    try {
      const { password } = req.body;
      const userId = req.user.id;

      // Find user in all models
      let user =
        (await Admin.findById(userId)) ||
        (await Coach.findById(userId)) ||
        (await Client.findById(userId));

      if (!user) return res.status(404).json({ message: "User not found" });
      if (!user.firstLogin)
        return res.status(400).json({ message: "Password already set" });

      // Set new password
      user.password = await hashedpassword(password);
      user.firstLogin = false;
      await user.save();

      res.json({ message: "Password set successfully. You can now log in." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
module.exports = new AdminController()