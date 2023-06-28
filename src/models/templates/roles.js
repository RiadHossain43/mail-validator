const role = {
  type: Object,
  enum: [
    {
      name: "Administrator",
      value: "admin",
    },
    {
      name: "Editor",
      value: "editor",
    },
    {
      name: "Moderator",
      value: "moderator",
    },
    {
      name: "Tester",
      value: "tester",
    },
  ],
};
module.exports = { role };
