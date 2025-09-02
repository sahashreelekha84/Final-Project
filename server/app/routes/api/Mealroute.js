const express = require("express");
const { createMealPlan, getMealPlans, getmealByClient } = require("../../controller/api/MealController");
const { Authcheck } = require('../../middleware/AuthCheck');
const router = express.Router();

router.post("/create", Authcheck, createMealPlan);
router.get("/mealslist/:clientId",Authcheck,getmealByClient);
router.get("/:clientId", Authcheck,getMealPlans);

module.exports = router;
