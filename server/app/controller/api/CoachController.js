const { comparepassword, hashedpassword } = require("../../middleware/AuthCheck");
const Client = require("../../model/client");
const jwt = require('jsonwebtoken')

const Coach = require("../../model/coach");

const Role = require("../../model/role");

const nodemailer = require("nodemailer");
const userModel = require("../../model/user");
const { Assignment } = require("../../model/program");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.my_email, pass: process.env.my_password },
});
class CoachController {
  async createCoach(req, res) {
    try {
      const { email, name } = req.body;

      // 1. Get coach role automatically
      const role = await Role.findOne({ name: "coach" });
      if (!role) return res.status(400).json({ message: "Coach role not found" });
      const username = `${coach.name.replace(/\s+/g, "").toLowerCase()}${Date.now()}`;
      // 2. Generate random password
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashedpassword(password);

      // 3. Create coach
      const coach = await Coach.create({
        email,
        name,
        password: hashedPassword,
        roleId: role._id,
        // role: role.name,            
        // permissions: role.permissions || [],
        firstLogin: true,
      });

      // 4. Send credentials email
      await transporter.sendMail({
        from: process.env.my_email,
        to: email,
        subject: "Your Coach Account",
        text: `Hello ${coach.name},\n\nYour account has been approved.\nUsername: ${username}\nPassword: ${password}\n\nPlease login and change your password.`,
      });

      res.status(201).json({ message: "Coach created and email sent", coach });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // async logincoach(req, res) {
  //   const { email, password } = req.body;
  //   try {
  //     const coach = await coach.findOne({ email });
  //     if (!coach) return res.status(401).json({ message: 'Invalid credentials' });

  //     const isMatch = await comparepassword(password, coach.password);
  //     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  //     const token = jwt.sign({
  //       _id: coach._id,
  //       name: user.name,
  //       email: user.email,


  //     }, process.env.JWT_SECRECT_KEY, { expiresIn: '2h' })
  //     return res.status(200).json({
  //       status: true,
  //       message: 'coach login successfully',
  //       coach: {
  //         _id: coach._id,
  //         name: coach.name,
  //         email: coach.email,
  //       },
  //       token: token

  //     })
  //   } catch (error) {
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // }
  async onboardCoach(req, res) {
    const { workplace, clientCount, coachType } = req.body;
    const coach = await Coach.findById(req.user.id);

    const role = await Role.findOne({ name: 'coach' });
    if (!role) return res.status(400).json({ message: "Invalid role" });

    coach.roleId = role._id;
    coach.workplace = workplace;
    coach.clientCount = clientCount;
    coach.coachType = coachType
    coach.onboardingCompleted = true;

    await coach.save();
    res.json({ message: "Onboarding completed", coach });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
  async getCoachProfile(req, res) {
    try {
      const coach = await Coach.findById(req.user.id);
      if (!coach) return res.status(404).json({ message: "Coach not found" });

      const role = await Role.findById(coach.role);

      res.json({
        coach: {
          id: coach._id,
          name: coach.name,
          email: coach.email,
          role: role ? role.name : null,
          workplace: coach.workplace,
          coachType: coach.coachType,
          clientCount: coach.clientCount,
          onboardingCompleted: coach.onboardingCompleted
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async onboardClient(req, res) {
    try {
      const { name, location, email, phone, subscriptionPlan, fitnessInterests,status} = req.body;
      const coachId = req.user.id; // From Auth Middleware

      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if client already exists
      let client = await Client.findOne({ email });

      if (client) {
        // Update existing client
        client.name = name || client.name;
        client.location = location || client.location;
        client.phone = phone || client.phone;
        client.subscriptionPlan = subscriptionPlan || client.subscriptionPlan;
        client.fitnessInterests = fitnessInterests || client.fitnessInterests;
        client.coachId = coachId; // optionally update coach
     
       
        client.status='connected'
        await client.save();
      } else {
        // Create new client
        client = await Client.create({
          name,
          userId: user._id,
          location,
          email,
          phone,
          subscriptionPlan,
          fitnessInterests,
          coachId,
          status
        });
      }

      // Optionally update coach's onboarding progress
      const coach = await Coach.findById(coachId);
      coach.onboardingProgress = Math.min((coach.onboardingProgress || 0) + 50, 100);
      await coach.save();

      res.status(200).json({ message: "Client onboarded/updated successfully", client });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async forgotpassword(req, res) {
    try {
      const { email } = req.body
      if (!email) {
        return res.status(400).json({
          status: false,
          message: 'email is required'
        })
      }
      const user = await Coach.findOne({ email })
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'user not found'
        })
      }
      const token = jwt.sign({
        _id: user.id,
        name: user.name,
        email: user.email
      }, process.env.JWT_SECRECT_KEY, { expiresIn: '2h' })
      const resetUrl = `${process.env.Client_url}/resetpassword/${token}`;
      const mailOptions = {
        from: process.env.my_email,
        to: email,
        subject: 'Reset Your Password',
        html: `<p>Click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
      };
      await transporter.sendMail(mailOptions)
        return res.json({
        status: true,
        message: "Password reset link sent to your email.",
        token :token
      });
    } catch (error) {
      console.error('Forgot password error:', error.message);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  async resendpassword(req, res) {
    try {
      const token = req.params.token
      const { password } = req.body
      if (!token || !password) {
        return res.status(400).json({
          status: false,
          message: 'token and password required'
        })

      }
      const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY)
      console.log(decoded);
      
      const user = await Coach.findOne({ email: decoded.email })
      if (!user) return res.status(404).json({ message: 'User not found' });

      const newHashedPassword = await hashedpassword(password);
      user.password = newHashedPassword;
      await user.save();
      return res.status(200).json({ message: 'password resend successfull' });
    } catch (error) {
      console.error('Reset password error:', error.message);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
  }
  async getDashboardData(req, res) {
    try {
      const coachId = req.user.id;

      // Count of clients by status
      const allClients = await Client.find({ coachId });
      const connected = allClients.filter(c => c.status === "connected");
      const pending = allClients.filter(c => c.status === "pending");
      const offline = allClients.filter(c => c.status === "offline");
      const waiting = allClients.filter(c => c.status === "waiting Activation");

      res.json({
        status: true,
        data: {
          totalClients: allClients.length,
          connected: connected.length,
          pending: pending.length,
          offline: offline.length,
          waitingActivation: waiting.length
        }
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

  // Get clients by status
  async getClientsByStatus(req, res) {

    try {
      const coachId = req.user.id;

      const result = await Client.aggregate([
        { $match: { coachId } }, // only this coach’s clients
        {
          $group: {
            _id: "$status",
            clients: { $push: "$$ROOT" },
            count: { $sum: 1 }
          }
        }
      ]);

      // transform into a fixed object with all categories
      const grouped = {
        All: [],
        Connected: [],
        Pending: [],
        Offline: [],
        WaitingActivation: []
      };

      // Fill grouped data from aggregation
      result.forEach(item => {
        grouped[item._id] = item.clients;
        grouped.All = grouped.All.concat(item.clients);
      });

      res.json({ status: true, data: grouped });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }


  }
  // PATCH /api/client/:id/status
async updateClientStatus(req, res) {
  try {
    const id = req.params.id;
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ status: false, message: "Client not found" });
    }

    client.status =
      client.status === "connected" ? "offline" : "connected"; // sample toggle
    await client.save();

    res.json({
      status: true,
      message: `Client status updated to ${client.status}`,
      data: client,
    });
  } catch (error) {
    console.error("Toggle error:", error);   // <-- log actual error
    res.status(500).json({ status: false, message: error.message });
  }
}

  async getAssignedClients(req, res) {
    try {
      const coachId = req.user.id; // logged-in coach
      console.log(coachId);

      // Find all active clients assigned to this coach
      const assignments = await Assignment.find({ coachId })
        .populate('clientId', 'name email fitnessInterests subscriptionPlan status') // get client details
        .sort({ createdAt: -1 });
      console.log(assignments);

      // Extract just client info
      const clients = assignments.map(a => a.clientId);
      console.log(clients);

      res.json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}
module.exports = new CoachController()