const TeamMember = require("../../model/team_member"); 
class TeamMemberController{


// Add Team Member
async addTeamMember (req, res) {
  try {
    const { workspaceId, coachId, role, status } = req.body;

    const member = await TeamMember.create({
      workspaceId,
      coachId,
      role,
      status: status || "active"
    });

    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit Team Member (update role, etc.)
async editTeamMember (req, res)  {
  try {
    const { memberId } = req.params;
    const { role } = req.body;

    const updatedMember = await TeamMember.findByIdAndUpdate(
      memberId,
      { role },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change Team Member Status (active/inactive/suspended)
async changeTeamStatus (req, res) {
  try {
    const { memberId } = req.params;
    const { status } = req.body;

    const updatedMember = await TeamMember.findByIdAndUpdate(
      memberId,
      { status },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({ message: "Status updated", member: updatedMember });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

}
module.exports=new TeamMemberController()