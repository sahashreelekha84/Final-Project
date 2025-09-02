const express = require("express");
const router = express.Router();
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} = require("../../controller/api/WorkspaceContrroller");

// CRUD Routes
router.post("/", createWorkspace);
router.get("/", getWorkspaces);
router.get("/:id", getWorkspaceById);
router.put("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);

module.exports = router;
