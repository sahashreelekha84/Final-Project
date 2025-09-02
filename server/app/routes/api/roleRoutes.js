const express = require("express");
const { createRole, getRoles } = require("../../controller/api/RoleController");
const router = express.Router();

router.post("/", createRole);
router.get("/", getRoles);

module.exports = router;
