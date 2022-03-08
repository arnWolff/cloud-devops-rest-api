const allRoles = {
  user: [], //'getProject', 'manageProject', 'getProjects'], //['getUser', 'manageUser', 'getProject', 'manageProject'],
  admin: ['getUsers', 'getUser', 'manageUsers', 'manageUser', 'getProjects', 'getProject', 'manageProjects', 'manageProject', 'toolCli'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
