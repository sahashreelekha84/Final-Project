const { hashedpassword, comparepassword } = require("../../middleware/AuthCheck");
const Client = require("../../model/client");
const Coach = require('../../model/coach');
const Role = require("../../model/role");
const userModel = require("../../model/user")
const { generateotp, sendEmail, transporter, mailOptions } = require("../../utils/sendEmail")
const jwt = require('jsonwebtoken')
class AuthController {
    // async register(req, res) {
    //     try {
    //         const { name, email, phone, password, role } = req.body
    //         const existemail = await userModel.findOne({ email })
    //         if (existemail) {
    //             return res.status(400).json({
    //                 status: false,
    //                 message: 'Email has already exist',

    //             })
    //         }
    //         const hash = await hashedpassword(password)
    //         const otp = generateotp()
    //         const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
    //         console.log(otpExpiry.toString());
    //         const udata = new userModel({
    //             name, email, phone, password: hash, otp, otpExpiry, role
    //         })
    //         await sendEmail({
    //             to: email,
    //             name: name,
    //             otp: otp
    //         });
    //         const data = await udata.save()
    //         return res.status(201).json({
    //             status: true,
    //             message: 'user registered Successfully',
    //             data: data
    //         })

    //     } catch (error) {
    //         return res.status(500).json({
    //             status: false,
    //             message: error.message,

    //         })
    //     }
    // }
    // controllers/clientController.js


    // Utility to generate OTP
    //const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    async register(req, res) {
        try {
            const { name, email, password, phone, subscriptionPlan, coachId, fitnessInterests } = req.body;

            // 1️⃣ Check if user exists
            let existingUser = await userModel.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "Email already exists" });

            // 2️⃣ Hash password
            const hash = await hashedpassword(password);

            // 3️⃣ Generate OTP
            const otp = generateotp();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

            // 4️⃣ Get roleId for 'client' from Role model
            const role = await Role.findOne({ name: 'client' });
            if (!role) return res.status(500).json({ message: "Client role not found in Role model" });

            // 5️⃣ Create User
            const user = await userModel.create({
                name,
                roleId: role._id,
                role: role.name,
                email,
                password: hash,
                phone,
                otp,
                otpExpiry,
                status: true,
                isVerify: false,
            });

            // 6️⃣ Create Client
            const client = await Client.create({
                name,
                email,
                userId: user._id,

                roleId: role._id,           // use role _id from Role model
                contactNumber: phone,
                subscriptionPlan,
                coachId,
                fitnessInterests,
                status: 'pending',
            });

            // 7️⃣ Send OTP via email
            await sendEmail({
                to: email,
                name: name,
                otp: otp
            });

            res.status(201).json({ message: "Client registered successfully", userId: user._id, clientId: client._id });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };

    async verifyotp(req, res) {
        try {
            const { email, otp } = req.body
            if (!email || !otp) {
                return res.status(400).json({
                    message: 'email and otp are required'
                })
            }
            const user = await userModel.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'user not found'
                })
            }
            if (user.isVerify) {
                return res.status(400).json({
                    status: false,
                    message: 'user is verified already'
                })
            }
            if (String(user.otp) != String(otp)) {
                return res.status(400).json({
                    status: false,
                    message: 'invailed otp'
                })
            }
            if (user.otpExpiry < new Date()) {
                return res.status(400).json({
                    status: false,
                    message: 'otp has expired'
                })
            }
            user.isVerify = true
            user.otp = undefined
            user.otpExpiry = undefined
            await user.save();
            return res.status(200).json({
                status: true,
                message: 'email verified successfully'
            })
        } catch (error) {
            console.error('Verify OTP error:', error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async resendotp(req, res) {
        try {
            const { email } = req.body
            const user = await userModel.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                })
            }
            if (user.isVerify) {
                return res.status(400).json({
                    message: 'User already verified'
                })
            }
            const otp = generateotp()
            user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
            await user.save()
            await sendEmail({
                to: user.email, name: user.name, otp: otp
            })
            return res.status(200).json({
                message: 'otp send successfully'
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await userModel.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'user not found'

                })
            }
            const ismatch = await comparepassword(password, user.password)
            if (!ismatch) {
                return res.status(400).json({
                    status: false,
                    message: 'invalid token'

                })
            }
            if (!user.isVerify) {
                return res.status(400).json({
                    status: false,
                    message: 'user not verified,pls verify by email',

                })
            }
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role

            }, process.env.JWT_SECRECT_KEY, { expiresIn: '2h' })
            return res.status(200).json({
                status: true,
                message: 'user login successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role

                },
                token: token

            })

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message,


            })
        }
    }
 async forgotpassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email is required",
        });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }

      // Create reset token
      const token = jwt.sign(
        { _id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRECT_KEY,
        { expiresIn: "2h" }
      );

      const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${token}`;

      // Send email
      const mailOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Reset Your Password",
        html: `<p>Click the link to reset your password:</p>
               <a href="${resetUrl}">${resetUrl}</a>`,
      };

      await transporter.sendMail(mailOptions);

      // ✅ Send response back
      return res.json({
        status: true,
        message: "Password reset link sent to your email.",
        token :token
      });
    } catch (error) {
      console.error("Forgot password error:", error.message);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // 2. Reset Password
async resendpassword(req, res) {
  try {
    // 🔹 decodeURIComponent ensures URL-encoded JWT works
    const token = decodeURIComponent(req.params.token);
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        status: false,
        message: "Token and password are required",
      });
    }

    // 🔹 Make sure your ENV key matches your sign() function
    const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY);

    // Find user by email from token
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash and save new password
    const newHashedPassword = await hashedpassword(password);
    user.password = newHashedPassword;
    await user.save();

    return res.json({
      status: true,
      message: "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
}

    async dashboard(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ status: false, message: "Unauthorized" });
            }

            const userId = req.user.id;

            // Fetch client by userId
            const client = await Client.findOne({ userId }).lean();
            if (!client) {
                return res.status(404).json({ status: false, message: "Client not found" });
            }
            console.log(client.coachId);

            // Fetch coach details if coachId exists
            let coach = null;
            if (client.coachId) {
                coach = await Coach.findById(client.coachId, { name: 1, email: 1 }).lean();
                console.log(coach);

            }

            // Respond with client + coach info
            res.status(200).json({

                status: true,
                role: client.role,
                name: client.name,
                email: client.email,
                subscriptionPlan: client.subscriptionPlan,
                status: client.status,
                coach, // full coach details
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }


    // async profile(req, res) {
    //     try {
    //         return res.status(200).json({
    //             status: true,
    //             message: 'Welcome to user profile',
    //             data: req.user
    //         })

    //     } catch (error) {
    //         return res.status(500).json({
    //             status: false,
    //             message: error.message
    //         })
    //     }

    // }
    async profile(req, res) {
        try {
            const userId = req.user.id;
            console.log(userId);


            const user = await userModel.findById(userId).lean();
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found",
                });
            }

            let extraData = null;

            if (user.role === "client") {
                extraData = await Client.findOne({ userId }).lean();
            }


            return res.status(200).json({
                status: true,
                message: "Welcome to user profile",
                data: {
                    ...user,
                    clientData: extraData, // will be null if not a client
                },
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }

}

module.exports = new AuthController()