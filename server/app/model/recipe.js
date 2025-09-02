const mongoose=require('mongoose')
const Schema=mongoose.Schema
const recipeSchema = new Schema({

  name: String,
  ingredients: [{ name: String, qty: String }],
  steps: [String],
  nutrition: {
    cal: Number, protein: Number, carbs: Number, fat: Number
  },
  tags: [String]
}, { timestamps: true });

const mealPlanSchema = new Schema({

  name: String,
  email:{type:String,required:true},
  targetCalories: Number,
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
 clientId:{ type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  meals: [{
    time: String,
   
    overrides: Schema.Types.Mixed
  }],
  rules: Schema.Types.Mixed
}, { timestamps: true });

module.exports = {
  Recipe: mongoose.model('Recipe', recipeSchema),
  MealPlan: mongoose.model('MealPlan', mealPlanSchema)
};
