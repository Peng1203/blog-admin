interface ArticleData {
  code: number
  data: Article[]
  message: MessageEnum
  total: number
}

interface Article {
  id: number
  title: string
  brief: string
  authorId: number
  cover: string
  tags: Tag[]
  commentCount: number
  likeCount: number
  dislikeCount: number
  viewCount: number
  state: number
  categoryId: number
  categoryName: string
  createdTime: string
  updateTime: string
  authorName: string
  authorAvatar: string
  content?: string
  // 解决模板中 动态渲染报错问题
  [key: string]: any
}
