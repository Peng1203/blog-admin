import { ListApiBaseResponse } from 'Api';

export interface CategoryData {
  id: number;
  categoryName: string;
  createTime: string;
  updateTime: string;
  articles?: any[];
}

export type CategoryListDate = ListApiBaseResponse<CategoryData>;

export type AddCategoryType = Partial<CategoryData>;

export interface EditProps {
  editRow: CategoryData;
}
