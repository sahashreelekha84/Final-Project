const express=require('express')
const AboutApiController = require('../../controller/admin/aboutejscontroller')
const AboutImageupload=require('../../helper/aboutimageupload')
const router=express.Router()


router.post('/create/about',AboutImageupload.single('image'),AboutApiController.createabout)
router.get('/about/list',AboutApiController.list)
router.get('/about/add',AboutApiController.addPage)
router.get('/editabout/:id',AboutApiController.edit)
router.post('/updateabout/:id',AboutImageupload.single('image'),AboutApiController.update)
router.get('/deleteabout/:id',AboutApiController.delete)

module.exports=router