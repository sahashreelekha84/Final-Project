const express = require("express");
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require("../../controller/api/AssignmentController");

const router = express.Router();


router.post("/", createAssignment);        
router.get("/", getAssignments);           
router.get("/:id", getAssignmentById);    
router.put("/:id", updateAssignment);      
router.delete("/:id", deleteAssignment);   

module.exports = router;
