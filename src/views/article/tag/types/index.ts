import { ListApiBaseResponse } from 'Api';

export interface TagData {
  id: number;
  tagName: string;
  icon: string;
  categoryDesc: string;
  createTime: string | Date;
  updateTime: string | Date;
  articles: any[];
}

export type TagListData = ListApiBaseResponse<TagData>;

export type AddTagType = Partial<TagData>;
