enum Permission {
  READ,
  WRITE,
  DELETE,
}

type User = {
  login: string
}

type AdminPermission = {
  permission: Permission
}

// BEGIN (write your solution here)

// END

export { User, Admin, Permission }
export default addAdmin
