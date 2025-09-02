const Client = require("../../model/client");
const Coach = require('../../model/coach')
const { Assignment } = require('../../model/program')
class clientejsController {

  async renderClentList(req, res) {
    try {
      // const data = await Client.find()
      // console.log('data',data);
      const data = await Client.find().populate('coachId', 'name'); // populate coach name
      const coaches = await Coach.find(); // list of all coaches
      res.render("user/list", { title: "Client List", data, coaches, user: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
  // async assignClientToCoach(req, res) {
  //   try {
  //     const { id } = req.params; // client id
  //     const { coachId } = req.body;



  //     await Client.findByIdAndUpdate(
  //       id,
  //       { coachId },
  //       { new: true }
  //     );

  //     // Optionally, add flash message
  //     req.flash('success', 'Coach assigned successfully');
  //     res.redirect("/user/list");
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send(error.message);
  //   }
  // }
  async assignClientToCoach(req, res) {
    try {
      const { id } = req.params; // clientId
      const { coachId } = req.body;
      const user = await Client.findById(id)
      // Update client’s coach reference
      await Client.findByIdAndUpdate(id, { coachId }, { new: true });

      // Store mapping in separate collection
      await Assignment.create({ clientId: id, userId: user.userId, coachId, status: "active" });
     
      req.flash("success", "Coach assigned successfully");
      res.redirect("/user/list");
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

}
module.exports = new clientejsController()