const { MealPlan } = require('../../model/recipe');
const Client = require('../../model/client'); // client model
const mongoose = require('mongoose');

class MealController {
  // Create a new meal plan (coach is logged in)


async  createMealPlan(req, res) {
  try {
    const coachId = req.user.id; // logged-in coach
    const { email, name, targetCalories, meals, rules } = req.body; // client email

    // Fetch the client assigned to this coach using email
    const client = await Client.findOne({ email, coachId });
    if (!client) {
      return res.status(404).json({ message: "Client not found or not assigned to this coach" });
    }
    console.log('client',client);
    

    const clientId = client._id;
    const userId = client.userId;

    // Create or update the meal plan
    const mealPlan = await MealPlan.findOneAndUpdate(
      { userId, coachId, clientId },
      { name, targetCalories, coachId, clientId, userId, meals, rules },
      { new: true, upsert: true }
    );

  

    res.status(201).json({ message: "Meal plan created successfully", mealPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}






async getmealByClient(req, res) {
  try {
    const userId = req.user?.id;      // logged-in user
    const role = req.user?.role;      // 'coach' or 'client'
    const { clientId } = req.params; // _id of the client

    console.log("Logged-in userId:", userId);
    console.log("Logged-in role:", role);
    console.log("Client ID param:", clientId);

    if (!clientId) {
      console.log("No clientId provided");
      return res.status(400).json({ message: "Client ID is required" });
    }

    let meal;

    if (role === 'coach') {
      console.log("Role is coach, checking assigned client...");
      const client = await Client.findOne({ _id: clientId, coachId: userId });
      console.log("Found client for coach:", client);

      if (!client) {
        console.log("Client not found or not assigned to this coach");
        return res.status(404).json({ message: "Client not found or not assigned to this coach" });
      }

      meal = await MealPlan.findOne({ 
        clientId: client._id.toString(),
        coachId: userId 
      });
      console.log("meal found for coach:", meal);

    } else if (role === 'client') {
      console.log("Role is client, checking own program...");
      const client = await Client.findOne({userId });
     
      console.log("Found client for client role:", client);

      if (!client) {
        console.log("Client not found");
        return res.status(404).json({ message: "Client not found" });
      }

      meal = await MealPlan.findOne({ clientId: client._id.toString() });
      console.log("meal found for client:", meal);

    } else {
      console.log("Unauthorized role:", role);
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!meal) {
      console.log("mealnot found for this client");
      return res.status(404).json({ message: "meal not found" });
    }

    console.log("Returning program:",meal);
    res.status(200).json({ success: true, meal });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

  async getMealPlans(req, res) {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }

      const plans = await MealPlan.find({ userId })
        .populate('coachId', 'name')    // coach info
        .populate('meals.recipeId');    // recipe info if needed

      res.json(plans);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

module.exports = new MealController();
