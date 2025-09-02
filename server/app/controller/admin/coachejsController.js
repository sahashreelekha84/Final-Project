const Coach = require("../../model/coach");
const Role = require("../../model/role");
const {transporter} = require("../../utils/sendEmail"); 
const {hashedpassword} = require("../../middleware/AuthCheck"); 

class CoachController {

  async createCoach(req, res) {
    try {
      const { email, name } = req.body;

      // Get coach role
      const role = await Role.findOne({ name: "coach" });
      if (!role) return res.status(400).send("Coach role not found");

      const username = `${name.replace(/\s+/g, "").toLowerCase()}${Date.now()}`;
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashedpassword(password);

      // Create coach
      const coach = await Coach.create({
        email,
        name,
        password: hashedPassword,
        roleId: role._id,
        firstLogin: true,
      });

      // Send email
      await transporter.sendMail({
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Your Coach Account",
        text: `Hello ${coach.name},\n\nYour account has been approved.\nUsername: ${username}\nPassword: ${password}\n\nPlease login and change your password.`,
      });

      // Redirect to coach list after successful creation
      res.redirect("/coach/list");
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async renderAddCoach(req, res) {
    try {
      res.render("coach/add", { title: "Add Coach",data: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }


  async renderCoachList(req, res) {
    try {
      const coachdata = await Coach.find().populate("roleId", "name");
      res.render("coach/list", { title: "Coach List", coachdata, data: req.user, });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
  async editcoach(req,res){
    const id=req.params.id
    const coachdata = await Coach.findById(id).populate("roleId", "name");
      res.render("coach/edit", { title: "Coach Edit", coachdata, data: req.user, });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
     async updatecoach(req, res) {
        try {
            const { id } = req.params;
          

            const existingcoach = await Coach.findById(id);
            if (!existingcoach) return res.redirect("/coach/list");

            const {name,email} = req.body || {};

            const updateData = {
                name: name || existingcoach.name,
                email: email || existingcoach.email,
                
            };

           
          
            await Coach.findByIdAndUpdate(id, updateData, { new: true });
            res.redirect("/coach/list");
        } catch (error) {
            console.error("Update coach error:", error);
            res.redirect("/coach/list");
        }
    }
    async deletecoach(req,res){
      const id=req.params.id
      await Coach.findByIdAndDelete(id)
      redirect('/coach/list')
    }
  
}

module.exports = new CoachController();
