interface AuthPermissionData {
  code: number
  data: AuthPermission[]
  message: MessageEnum
  total: number
}

interface AuthPermission {
  id: number
  desc: string
  permissionCode: string
  permissionName: string
  updateTime: string
  createdTime: string
}
