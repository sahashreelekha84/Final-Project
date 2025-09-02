const express=require('express')
const clientejsController = require('../../controller/admin/clientejsController');
const { checkRole, Authcheck } = require('../../middleware/AuthCheck');
const AuthCheck = require('../../middleware/auth');



const router=express.Router()


router.get('/user/list',clientejsController.renderClentList)
router.post("/clients/:id/assign", clientejsController.assignClientToCoach);
// router.get('/editpackage/:id',packageController.editPackage)
// router.post('/updatepackage/:id',packageController.update)
// router.get('/deletepackage/:id',packageController.delete)

module.exports=router