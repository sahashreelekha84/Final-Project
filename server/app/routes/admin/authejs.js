const express=require('express')
const AuthEjsController = require('../../controller/admin/authejsController')
const AuthCheck = require('../../middleware/auth')

const router=express.Router()



router.get('/register',AuthEjsController.register)
router.post('/register/create',AuthEjsController.creareregister)
router.get('/',AuthEjsController.loginview)
router.post('/login/create',AuthEjsController.logincreate)

router.get('/forgetpassword',AuthEjsController.forgotview)
router.post('/forgetpassword/create',AuthEjsController.forgotcreate)
router.get('/reset-password/:token',AuthEjsController.resetview)
router.post('/reset-password/:token',AuthEjsController.resetpassword)
router.get('/admin/dashboard',AuthCheck,AuthEjsController.CheckAuth,AuthEjsController.adminDashboard)
router.get('/logout',AuthEjsController.logout)



module.exports=router