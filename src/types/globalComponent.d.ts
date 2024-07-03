import Table from '@/components/Table'
import Search from '@/components/Search'
import Drawer from '@/components/Drawer'
import Dialog from '@/components/Dialog'
import Form from '@/components/Form'
import Icon from '@/components/SymbolIcon/index.vue'
import Select from '@/components/Select'
import Skeleton from '@/components/Skeleton'

/** 封装Form表单的实例 */
declare module 'MyComponent' {
  type FormInstance = InstanceType<typeof Form>
}

declare module 'vue' {
  interface GlobalComponents {
    'Peng-Table': typeof Table
    'Peng-Search': typeof Search
    'Peng-Dialog': typeof Dialog
    'Peng-Drawer': typeof Drawer
    'Peng-Form': typeof Form
    'Peng-Skeleton': typeof Skeleton
    'Peng-Select': typeof Select
    'Peng-Icon': typeof Icon
  }

  type FormInstance = InstanceType<typeof Form>
}
