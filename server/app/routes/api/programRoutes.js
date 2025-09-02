const express = require("express");
const {
  createProgram,
  getProgramByClient,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} = require("../../controller/api/programController");
const {Authcheck} = require("../../middleware/AuthCheck");

const router = express.Router();


router.post("/create", Authcheck, createProgram);  
router.get("/:clientId", Authcheck, getProgramByClient);         
router.get("/", getPrograms);            
router.get("/:id", getProgramById);     
router.put("/:id", updateProgram);        
router.delete("/:id", deleteProgram);     

module.exports = router;
