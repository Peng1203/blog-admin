type Themes = 'light' | 'dark'

type preThemes =
  | 'default'
  | 'github'
  | 'vuepress'
  | 'mk-cute'
  | 'smart-blue'
  | 'cyanosis'
  | 'arknights'
type codeTheme =
  | 'atom'
  | 'a11y'
  | 'github'
  | 'gradient'
  | 'kimbie'
  | 'paraiso'
  | 'qtcreator'
  | 'stackoverflow'

type toolbarConfigs = 'all' | 'common'

interface MarkdownEditorAttibute {
  // toolbar配置
  config?: toolbarConfigs
  // 内容
  modelValue: string
  // 主题
  theme?: Themes | undefined
  // 预览主题
  preTheme?: preThemes | undefined
  // 语言
  lang?: string
  // 代码块主题
  codeTheme?: codeTheme
  // 代码块是否显示行数
  showCodeRowNumber?: boolean
  // 提示
  placeholder?: string
  // 不展示的工具栏
  toolbarsExclude?: []
}

// 上传图片函数参数
type UploadImgParams = {
  files: File[]
  callback: (urls: string) => void
}
