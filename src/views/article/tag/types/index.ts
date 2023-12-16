import { ListApiBaseResponse } from 'Api';

export interface TagData {
  id: number;
  tagName: string;
  icon: string;
  createTime: string;
  updateTime: string;
  articles?: any[];
}

export type TagListData = ListApiBaseResponse<TagData>;

export type AddTagType = Partial<TagData>;

export interface EditProps {
  editRow: TagData;
}
