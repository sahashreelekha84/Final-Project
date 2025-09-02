const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const Admin = require('../model/Admin')
const Coach = require('../model/coach')
const Client = require('../model/client')
const Role = require('../model/role')
const userModel = require('../model/user')

const hashedpassword = (password) => {
  const salt = 10
  const hash = bcryptjs.hashSync(password, salt)
  return hash
}
const comparepassword = async (password, hashedpassword) => {
  return bcryptjs.compareSync(password, hashedpassword)
}
// const Authcheck =async (req, res, next) => {

//     const token = req?.headers['x-access-token'];
//     if (!token) {
//         return res.status(400).json({
//             status: false,
//             message: 'pls login first to access this page'
//         })
//     }

//     try {
//        const user =
//       (await Admin.findById(decoded._id)) ||
//       (await coach.findById(decoded._id)) ||
//       (await client.findById(decoded._id));

//     if (!user) return res.status(404).json({ message: "User not found" });

//     req.user = {
//       id: user._id,
//       role: user.role || (user instanceof Admin ? "admin" : user instanceof Coach ? "coach" : "client"),
//       firstLogin: user.firstLogin || false,
//       email: user.email
//     };

//     next();

//     } catch (error) {
//         return res.status(400).json({
//             status: false,
//             message: error.message
//         })
//     }
//     next()
// }


const Authcheck = async (req, res, next) => {


  try {
    // Get token from headers
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // remove "Bearer "
    }
    //console.log(token);
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Please login first to access this page",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY)
    console.log(decoded._id);


    // Find user
    const user =
      (await Admin.findById(decoded.id)) ||
      (await Coach.findById(decoded.id)) ||
      (await userModel.findById(decoded._id)) ||
      (await Client.findById(decoded._id));

    if (!user) return res.status(404).json({ message: "User not found" });
    // console.log('user', user);

    let roleData = null;
    if (user.roleId) {
      roleData = await Role.findById(user.roleId);
     //console.log('roleData', roleData);
    }


    //  Attach user info to req
    req.user = {
      id: user.id,
      //role: user.role || (user instanceof Admin ? "admin" : user instanceof coach ? "coach" : "client"),
      firstLogin: user.firstLogin || false,
      role: roleData ? roleData.name : "unknown",
      permissions: roleData ? roleData.permissions : [],
      email: user.email,
    };
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};



const checkRole = (roleName) => (req, res, next) => {
  if (req.user.role !== roleName) {
    return res.status(403).json({ message: "Access denied: role required" });
  }
  next();
};

const checkPermission = (permission) => (req, res, next) => {
  if (!req.user.permissions.includes(permission)) {
    return res.status(403).json({ message: "Access denied: permission required" });
  }
  next();
};

module.exports = { hashedpassword, comparepassword, Authcheck, checkRole, checkPermission }