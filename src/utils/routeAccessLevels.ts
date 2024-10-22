const routesAccessLevels: Record<string, number> = {
  //club routes
  "/api/club/assign_role": 3,
  "/api/club/add_members": 2,
  "/api/club/remove_member": 3,
  "/api/club/remove_role": 3,

  //role routes
  "/api/create_role": 3,
  "/api/list_roles": 1,
};

export default routesAccessLevels;
