const express=require('express')
const coachejsController = require('../../controller/admin/coachejsController')
const AuthCheck = require('../../middleware/auth')


const router=express.Router()


router.post('/create/coach',coachejsController.createCoach)
router.get('/coach/list',AuthCheck, coachejsController.renderCoachList)
router.get('/coach/add',coachejsController.renderAddCoach)
router.get('/editcoach/:id',AuthCheck,coachejsController.editcoach)
router.post('/updatecoach/:id',coachejsController.updatecoach)
router.get('/deletecoach/:id',coachejsController.deletecoach)

module.exports=router