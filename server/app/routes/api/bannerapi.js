const express=require('express')


const StudentImageupload = require('../../helper/studentimageupload');

const BannerApiController = require('../../controller/api/BannerApiController');
const router=express.Router()




router.post('/create/banner',StudentImageupload.single('image'),BannerApiController.createbanner)
router.get('/detail',BannerApiController.bannerlist)
router.get('/detail/edit/:id',BannerApiController.editbanner)
router.post('/detail/update/:id',BannerApiController.Updatebanner)
router.delete('/detail/delete/:id',BannerApiController.deletebanner)




module.exports=router