import { Component } from 'vue'

export type ButtonTypeEnum =
  | ''
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'

export interface ButtonAttribute {
  label?: string
  size?: SizeEnum
  // 用于按钮内部
  icon?: string
  // 用于属性的icon
  iconClass?: string
  type?: ButtonTypeEnum
  primary?: boolean
  success?: boolean
  info?: boolean
  warning?: boolean
  danger?: boolean
  plain?: boolean
  round?: boolean
  circle?: boolean
  loading?: boolean
  dark?: boolean
  color?: string
}
