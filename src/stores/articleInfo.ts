import { defineStore } from 'pinia'
import { useCategoryApi } from '../api/category'
import { useTagApi } from '../api/tag'

const { getCategoryList } = useCategoryApi()

const { getTagList } = useTagApi()

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
    allCategoryList: [],
    // 分类下拉全部数据
    allCategoryOptions: [],
    // 标签全部数据
    allTagList: [],
    // 标签下拉全部数据
    allTagOptions: [],
  }),
  actions: {
    // 获取全部文章分类数据
    async getAllCategoryList(updata?: boolean) {
      try {
        if (
          this.allCategoryList.length &&
          this.allCategoryOptions.length &&
          !updata
        )
          return
        const { data: res } = await getCategoryList(this.allParams)
        const { code, message, data } = res
        if (code !== 200 || message !== 'Success') {
          this.allCategoryList = []
          this.allCategoryOptions = []
        } else {
          this.allCategoryList = data
          this.allCategoryOptions = data.map(({ categoryName, id }: any) => ({
            label: categoryName,
            value: id,
          }))
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取全部标签列表
    async getAllTagList(updata?: boolean) {
      try {
        if (this.allTagList.length && this.allTagOptions.length && !updata)
          return
        const { data: res } = await getTagList(this.allParams)
        const { code, message, data } = res
        if (code !== 200 || message !== 'Success') {
          this.allTagList = []
          this.allTagOptions = []
        } else {
          this.allTagList = data
          this.allTagOptions = data.map(({ tagName, id }: any) => ({
            label: tagName,
            value: id,
          }))
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
})
