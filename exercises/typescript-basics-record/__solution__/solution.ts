export const createAccessChecker =
  <Role extends string, Resource extends string>(
    permissions: Record<Role, Array<Resource>>,
  ) =>
  (role: Role, resource: Resource): boolean => {
    return permissions[role]?.includes(resource) ?? false;
  };
