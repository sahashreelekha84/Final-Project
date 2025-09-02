const Client = require("../../model/client");

class ClientController{
async addClient (req, res)  {
  const { name, email, contactNumber, location, plan } = req.body;

  try {
    const client = new Client({
      coach: req.user._id,
      name,
      email,
      contactNumber,
      location,
      plan
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add client' });
  }
};

// Get All Clients for Coach
async getClients  (req, res){
  try {
    const clients = await Client.find({ coach: req.user._id });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch clients' });
  }
};

// Get Client by ID
async getClientById (req, res){
  try {
    const client = await Client.findOne({ _id: req.params.id, coach: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch client' });
  }
};

// Update Client
async updateClient (req, res) {
  try {
    const client = await client.findOneAndUpdate(
      { _id: req.params.id, coach: req.user._id },
      req.body,
      { new: true }
    );
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update client' });
  }
};

// Delete Client
async deleteClient  (req, res)  {
  try {
    const client = await client.findOneAndDelete({ _id: req.params.id, coach: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete client' });
  }
}
async getClientStatusCounts(req, res){
  try {
    const statusGroups = await client.aggregate([
      { $match: { coach: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(statusGroups); // e.g. [{ _id: 'connected', count: 3 }, ...]
  } catch (error) {
    res.status(500).json({ message: 'Failed to group clients' });
  }
};
async filterClients  (req, res){
  const { status, plan } = req.query;

  let matchStage = { coach: req.user._id };
  if (status) matchStage.status = status;
  if (plan) matchStage.plan = plan;

  try {
    const clients = await client.aggregate([
      { $match: matchStage },
      {
        $project: {
          name: 1,
          email: 1,
          plan: 1,
          status: 1
        }
      }
    ]);

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter clients' });
  }
};
}
module.exports=new ClientController()