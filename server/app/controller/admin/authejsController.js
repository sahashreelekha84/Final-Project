const User = require('../../model/user')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer')
const { hashedPassword } = require('../../middleware/AuthCheck')
const Admin = require('../../model/Admin')
const userModel = require('../../model/user')
const Coach = require('../../model/coach')
const {Package} = require("../../model/subscription");
class AuthEjsController {

    async CheckAuth(req, res, next) {
        try {
            if (req.user) {
                next()
            } else {
                res.redirect('/');
            }
        } catch (err) {
            console.log(err)
        }
    }


    async register(req, res) {
        console.log(req.user);

        try {
            res.render('register', {
                title: "register",
                data: req.user
            })

        } catch (error) {
            console.log(error.message);

        }
    }




    async creareregister(req, res) {
        try {
            const { name, email, phone, password, } = req.body

            const existEmail = await User.findOne({ email })
            if (existEmail) {
                console.log('email is already exist');
                return res.redirect('/register')

            }
            const salt = 10;
            const hash = bcryptjs.hashSync(password, salt);
            const data = await new User({
                name, email, password: hash, phone,
            }).save()
            console.log('user', data);

            //const result=await data.save()
            if (data) {
                req.flash("message", "user regiaster successfully")
                return res.redirect('/login')
            } else {
                req.flash("message", "user regiaster failed")
                return res.redirect('/register')
            }

        } catch (error) {
            console.log(error.message);

        }
    }


    async loginview(req, res) {
        try {
            const message = req.flash('message')
            res.render('login', {
                title: "login",
                message,
                data: req.user
            })

        } catch (error) {
            console.log(error.message);

        }
    }


    async logincreate(req, res) {

        try {
            const { email, password } = req.body
            if (!email || !password) {
                console.log('all filed is require');
                return res.redirect('/login')
            }

            const user = await Admin.findOne({ email })
            if (!user) {
                console.log('email does not exist');
                return res.redirect('/login')

            }

            //const ismatch= comparePassword(password,user.password)
            const ismatch = bcryptjs.compareSync(password, user.password)

            if (!ismatch) {
                console.log('invalid password');
                return res.redirect('/login')
            }
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                // role:user.role
            }, "helloworldwelcometowebskitters", { expiresIn: "2h" })

            if (token) {
                res.cookie('usertoken', token)
                return res.redirect('/admin/dashboard')
            } else {
                return res.redirect('/login')
            }


        } catch (error) {
            console.log(error);

        }
    }
    async forgotview(req, res) {
        try {

            res.render('forgetpassword', {
                title: "forgetpassword",

            })

        } catch (error) {
            console.log(error.message);

        }
    }
    async forgotcreate(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                console.log('Email is required');
                return res.redirect('/forgetpassword');
            }

            const user = await User.findOne({ email });

            if (!user) {
                console.log('Email does not exist');
                return res.redirect('/forgetpassword');
            }

            const token = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                process.env.JWT_SECRECT_KEY,
                { expiresIn: "2h" }
            );

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.my_email,
                    pass: process.env.my_password
                }
            });

            const mailOptions = {
                from: "sahashreelekha84@gmail.com",
                to: email,
                subject: "Password Reset Request",
                text: `Click the link to reset your password: ${process.env.admin_url}/reset-password/${token}`
            };

            const data = await transporter.sendMail(mailOptions);

            if (data) {
                req.flash("message", "Password reset link sent to your email.");
                return res.redirect(`/reset-password/${token}`);
            }

        } catch (error) {
            console.log("Email sending error:", error.message);
            req.flash("error", "Something went wrong. Try again later.");
            return res.redirect('/forgetpassword');
        }
    }
    async resetview(req, res) {
        try {
            const { token } = req.params;  // get token from URL params
            res.render('resetpassword', {
                title: "Reset Password",
                token,   // pass token here
                error: null
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async resetpassword(req, res) {
        try {
            const token = req.params.token;
            const { password } = req.body;

            if (!token) {
                return res.send("Invalid reset link.");
            }

            if (!password) {
                return res.render('resetpassword', { error: 'Please provide a new password', token });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY);
            const user = await User.findOne({ email: decoded.email });

            if (!user) {
                return res.render('resetpassword', { error: 'User not found', token: null });
            }

            const newhashpassword = await hashedPassword(password);
            user.password = newhashpassword;
            await user.save();

            return res.redirect('/login');
        } catch (error) {
            console.log(error.message);
            return res.render('resetpassword', { error: 'Something went wrong', token: req.params.token });
        }
    }

    async adminDashboard(req, res) {
        const totaluser = await userModel.countDocuments();
        const totalcoach = await Coach.countDocuments();
         const totalpackage = await Package.countDocuments();
        console.log(req.user);
        try {
            res.render('dashboard', {
                data: req.user,
                totaluser,
                totalcoach,
                totalpackage
            })

        } catch (error) {
            console.log(error.message);

        }

    }

    async logout(req, res) {
        try {
            res.clearCookie('usertoken');
            return res.redirect('/')

        } catch (error) {
            console.log(error.message);

        }

    }



}



module.exports = new AuthEjsController()