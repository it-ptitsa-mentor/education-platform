enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
}

interface User {
  login: string;
}

interface AdminPermission {
  permission: Permission;
}

export type Admin = AdminPermission & User;

export const addAdmin = (user: User): Admin => {
  return { ...user, permission: Permission.READ };
};
