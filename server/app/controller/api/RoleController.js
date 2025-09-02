const role = require("../../model/role");

class RoleController{
    async createRole (req, res){
  try {
    const role = await role.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async getRoles(req, res){
  try {
    const roles = await role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
}
module.exports=new RoleController()