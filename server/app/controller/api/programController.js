const { Program } = require("../../model/program");
const Client = require('../../model/client')
class programController {
  async createProgram(req, res) {
    try {
      const coachId = req.user.id;
      const { email,name, goal, schedule, visibility } = req.body;


      const client = await Client.findOne({ email, coachId });
      if (!client) {
        return res.status(404).json({ message: "Client not found or not assigned to this coach" });
      }

      const userId = client.userId;
      const clientId = client._id

      const program = await Program.findOneAndUpdate(
        { clientId, coachId, userId },
        { name, goal, schedule, visibility, coachId, clientId, userId, createdBy: coachId },
        { new: true, upsert: true }
      );

      res.status(201).json(program);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };


async getProgramByClient(req, res) {
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

    let program;

    if (role === 'coach') {
      console.log("Role is coach, checking assigned client...");
      const client = await Client.findOne({ _id: clientId, coachId: userId });
      console.log("Found client for coach:", client);

      if (!client) {
        console.log("Client not found or not assigned to this coach");
        return res.status(404).json({ message: "Client not found or not assigned to this coach" });
      }

      program = await Program.findOne({ 
        clientId: client._id.toString(),
        coachId: userId 
      });
      console.log("Program found for coach:", program);

    } else if (role === 'client') {
      console.log("Role is client, checking own program...");
      const client = await Client.findOne({userId });
      console.log("Found client for client role:", client);

      if (!client) {
        console.log("Client not found");
        return res.status(404).json({ message: "Client not found" });
      }

      program = await Program.findOne({ clientId: client._id.toString() });
      console.log("Program found for client:", program);

    } else {
      console.log("Unauthorized role:", role);
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!program) {
      console.log("Program not found for this client");
      return res.status(404).json({ message: "Program not found" });
    }

    console.log("Returning program:", program);
    res.status(200).json({ success: true, program });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}





  async getPrograms(req, res) {
    try {
      const { workspaceId } = req.query;
      const query = workspaceId ? { workspaceId } : {};
      const programs = await Program.find(query);
      res.json(programs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  async getProgramById(req, res) {
    try {
      const program = await Program.findById(req.params.id);
      if (!program) return res.status(404).json({ message: "Program not found" });
      res.json(program);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  //  Update program
  async updateProgram(req, res) {
    try {
      const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!program) return res.status(404).json({ message: "Program not found" });
      res.json(program);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  //  Delete program
  async deleteProgram(req, res) {
    try {
      const program = await Program.findByIdAndDelete(req.params.id);
      if (!program) return res.status(404).json({ message: "Program not found" });
      res.json({ message: "Program deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = new programController()