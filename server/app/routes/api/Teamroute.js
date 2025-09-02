const express = require("express");
const router = express.Router();
const teamController = require("../../controller/api/TeammemberController");
const { Authcheck } = require("../../middleware/AuthCheck");


// Add member
router.post("/team", Authcheck, teamController.addTeamMember);

// Edit member
router.put("/team/:memberId", Authcheck, teamController.editTeamMember);

// Change status
router.patch("/team/:memberId/status", Authcheck, teamController.changeTeamStatus);

module.exports = router;
