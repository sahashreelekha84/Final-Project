const express=require('express')
const packageController = require('../../controller/admin/PackageControler')

const router=express.Router()


router.post('/create/package',packageController.createPackage)
router.get('/package/list',packageController.listPackage)
router.get('/package/add',packageController.addPagePackage)
router.get('/editpackage/:id',packageController.editPackage)
router.post('/updatepackage/:id',packageController.update)
router.get('/deletepackage/:id',packageController.delete)

module.exports=router