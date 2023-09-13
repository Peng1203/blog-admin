import Table from '@/components/Table/index.vue'
import Search from '@/components/Search/index.vue'
import Drawer from '@/components/Drawer/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import Form from '@/components/Form/index.vue'
import Icon from '@/components/SymbolIcon/index.vue'
import Select from '@/components/Select/index.vue'

const commonName = 'Peng'

const ComponentHashMap = {
  [`${commonName}Table`]: Table,
  [`${commonName}Search`]: Search,
  [`${commonName}Drawer`]: Drawer,
  [`${commonName}Dialog`]: Dialog,
  [`${commonName}Form`]: Form,
  [`${commonName}Icon`]: Icon,
  [`${commonName}Select`]: Select,
}

export default ComponentHashMap
