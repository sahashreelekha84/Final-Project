const { Assignment } = require("../../model/program");

class AssignmentController{
async createAssignment (req, res) {
  try {
    const { clientId, programId, mealPlanId, startDate, endDate, status } = req.body;
    const assignment = await Assignment.create({ clientId, programId, mealPlanId, startDate, endDate, status });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
async getAssignments(req, res) {
  try {
    const { clientId } = req.query;
    const query = clientId ? { clientId } : {};
    const assignments = await Assignment.find(query);
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
async  getAssignmentById (req, res){
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update assignment
async updateAssignment(req, res){
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Delete assignment
async deleteAssignment(req, res){
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
}
module.exports=new AssignmentController()