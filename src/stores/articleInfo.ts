import { defineStore } from 'pinia';
import { useCategoryApi } from '../api/category';
import { useTagApi } from '../api/tag';
import { ref } from 'vue';
import { TagData, TagListData } from '@/views/article/tag';

const { getCategoryList } = useCategoryApi();

const { getTags } = useTagApi();

export const useArticleInfo = defineStore('articleInfo', {
  state: () => ({
    allParams: {
      queryStr: '',
      column: '',
      order: '',
      page: 1,
      pageSize: 9999,
    },
    // 分类全部数据
    categoryList: [],
    // 分类下拉全部数据
    categoryOption: ref<OptionItem[]>([]),
    // 标签全部数据
    tagList: ref<TagData[]>([]),
    // 标签下拉全部数据
    tagOption: ref<OptionItem[]>([]),
  }),
  actions: {
    // 获取全部文章分类数据
    async getCategoryData(updata?: boolean) {
      try {
        if (this.categoryList.length && this.categoryOption.length && !updata) return;
        const { data: res } = await getCategoryList(this.allParams);
        const { code, message, data } = res;
        if (code !== 200 || message !== 'Success') {
          this.categoryList = [];
          this.categoryOption = [];
        } else {
          this.categoryList = data;
          this.categoryOption = data.map(({ categoryName, id }: any) => ({
            label: categoryName,
            value: id,
          }));
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取全部标签列表
    async getTagData(updata?: boolean) {
      try {
        if (this.tagList.length && this.tagOption.length && !updata) return;
        const { data: res } = await getTags<TagListData>(this.allParams);
        const { code, message, data, success } = res;
        if (code !== 20000 || !success) return;

        this.tagList = data.list;
        this.tagOption = data.list.map(({ tagName, id }) => ({
          label: tagName,
          value: id,
        }));
      } catch (e) {
        console.log(e);
      }
    },
  },
});
