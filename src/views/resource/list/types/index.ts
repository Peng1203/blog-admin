// import { ListApiBaseResponse } from 'Api'

export interface ResourceData {
  dev: number
  mode: number
  nlink: number
  uid: number
  gid: number
  rdev: number
  blksize: number
  ino: number
  size: number
  blocks: number
  atimeMs: number
  mtimeMs: number
  ctimeMs: number
  birthtimeMs: number
  name: string
  type: string
  mimeType: string
  atime: string
  mtime: string
  ctime: string
  birthtime: string
  url: string
}

// export type ResourceListData = ListApiBaseResponse<ResourceData>
export type ResourceListData = ResourceData[]
