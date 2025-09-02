const express = require('express')

const { Authcheck, checkRole, checkPermission } = require('../../middleware/AuthCheck');
const CoachController = require('../../controller/api/CoachController');
const router = express.Router()
router.post(
  "/create-coach",
  Authcheck,
  checkRole("admin"),
  checkPermission("create-coach"), CoachController.createCoach);
router.post(
  "/onboard-client",
  Authcheck,
  checkRole("coach"), CoachController.onboardClient
);
router.post('/onboarding', Authcheck, CoachController.onboardCoach);
router.get('/getprofile', Authcheck, CoachController.getCoachProfile);
router.post('/forgotpassword', CoachController.forgotpassword)
router.post('/resendpassword/:token', CoachController.resendpassword)
// Dashboard overview
router.get("/dashboard", Authcheck, checkRole("coach"), CoachController.getDashboardData);
router.get('/clients', Authcheck, CoachController.getAssignedClients);
// Get clients by status: All, Connected, Pending, Offline, Waiting Activation
router.patch("/clients/:status", Authcheck, checkRole("coach"), CoachController.getClientsByStatus);
router.patch(
  "/client/:id/toggle-status",
  Authcheck,
  checkRole("coach"),
  CoachController.updateClientStatus
);
module.exports = router