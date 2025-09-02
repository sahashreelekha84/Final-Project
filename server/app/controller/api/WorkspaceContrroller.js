const Workspace = require("../../model/Workspace");

class WorkspaceController{
//  Create Workspace
async createWorkspace (req, res) {
  try {
    const workspace = await Workspace.create(req.body);
    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Workspaces
async getWorkspaces(req, res){
  try {
    const workspaces = await Workspace.find();
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Workspace by ID
async getWorkspaceById(req, res){
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update Workspace
async updateWorkspace(req, res)  {
  try {
    const workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Workspace
async deleteWorkspace (req, res) {
  try {
    const workspace = await Workspace.findByIdAndDelete(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


}
module.exports=new WorkspaceController()