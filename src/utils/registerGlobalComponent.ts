import Table from '@/components/Table';
import Search from '@/components/Search/index.vue';
import Drawer from '@/components/Drawer/index.vue';
import Dialog from '@/components/Dialog';
import Form from '@/components/Form';
import Icon from '@/components/SymbolIcon/index.vue';
import Select from '@/components/Select/index.vue';

const commonName = 'Peng';

const ComponentHashMap = {
  [`${commonName}Table`]: Table,
  [`${commonName}Search`]: Search,
  [`${commonName}Drawer`]: Drawer,
  [`${commonName}Dialog`]: Dialog,
  [`${commonName}Form`]: Form,
  [`${commonName}Icon`]: Icon,
  [`${commonName}Select`]: Select,
};

export default ComponentHashMap;
