const express=require('express')
const contactApiController = require('../../controller/admin/contactejscontroller')

const router=express.Router()


router.post('/create/contact',contactApiController.createContact)
router.get('/contact/list',contactApiController.list)
router.get('/contact/add',contactApiController.addPage)
router.get('/editcontact/:id',contactApiController.edit)
router.post('/updatecontact/:id',contactApiController.update)
router.get('/deletecontact/:id',contactApiController.delete)

module.exports=router