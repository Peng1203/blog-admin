interface UserData {
  code: number
  data: User[]
  message: MessageEnum
  total: number
}

interface User {
  id: number
  userName: string
  roleId: number
  // 角色状态
  state: number
  email: string | null
  unsealTime: string
  updateTime: string
  createdTime: string
  avatarUrl: string
}

interface UserOptionData {
  code: number
  message: MessageEnum
  data: OptionItem[]
}
