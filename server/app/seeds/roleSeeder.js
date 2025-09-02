// utils/seedRoles.js
const Role = require("../model/role");

const createRoles = async () => {
  const roles = [
    {
      name: "client",
      permissions: ["view-program", "track-progress", "message-coach"],
    },
    {
      name: "coach",
      permissions: [
        "create-client",
        "view-dashboard",
        "assign-subscription",
        "message-client",
      ],
    },
    {
      name: "admin",
      permissions: [
        "create-coach",
        "view-all-clients",
        "manage-subscriptions",
        "manage-resources",
        "view-analytics",
      ],
    },
  ];

  for (const role of roles) {
    const exists = await Role.findOne({ name: role.name });
    if (!exists) {
      await Role.create(role);
      console.log(`Role ${role.name} created`);
    }
  }

  console.log("All roles seeded successfully!");
};

module.exports = createRoles;
