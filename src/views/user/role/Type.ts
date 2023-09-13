interface RoleDate {
  code: number
  data: Role[]
  message: MessageEnum
  total: number
}

interface Role {
  id: number
  roleName: string
  roleDesc: string
  menus: number[]
  operationPermissions: number[]
  updateTime: string
  createdTime: string
}
