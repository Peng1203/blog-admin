/** 文章相关静态数据 */
export const ARTICLE = {
  // 文章类型筛选数据
  typeOptions: [
    { label: '全部', value: 0 },
    { label: '原创', value: 1 },
    { label: '转载', value: 2 },
    { label: '翻译', value: 3 },
  ],
  radioTypeOptions: [
    { label: '原创', value: 1 },
    { label: '转载', value: 2 },
    { label: '翻译', value: 3 },
  ],

  // 文章状态筛选数据
  statusOptions: [
    { label: '全部', value: 0 },
    { label: '已发布', value: 1 },
    { label: '私密', value: 2 },
    { label: '草稿箱', value: 3 },
    { label: '已删除', value: 4 },
    { label: '待审核', value: 5 },
    { label: '已拒绝', value: 6 },
  ],
  radioStatusOptions: [
    { label: '公开', value: 1 },
    { label: '私密', value: 2 },
    { label: '草稿箱', value: 3 },
  ],
}

export const MB = 1024 * 1024
