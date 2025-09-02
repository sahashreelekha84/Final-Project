const express=require('express')
const BannerApiController = require('../../controller/admin/Bannerejs.controller')
const StudentImageupload=require('../../helper/bannerimageupload')
const router=express.Router()


router.post('/create',StudentImageupload,BannerApiController.createbanner)
router.get('/banner/list',BannerApiController.list)
router.get('/banner/add',BannerApiController.addPage)
router.get('/edit/:id',BannerApiController.edit)
router.post('/update/:id',StudentImageupload,BannerApiController.update)
router.get('/delete/:id',BannerApiController.delete)

module.exports=router