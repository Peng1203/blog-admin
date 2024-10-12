import { ListApiBaseResponse } from 'Api'
export interface MomentData {
  id: number
  content: string
  userId: number
  mediaUrls: string[]
  isTop: BolEnum
  status: 1 | 2
}

export type LoginAuditLogListData = ListApiBaseResponse<MomentData>

export type AddMomentForm = Omit<MomentData, 'id'>
