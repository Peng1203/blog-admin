import Table from '@/components/Table';
import Search from '@/components/Search';
import Drawer from '@/components/Drawer';
import Dialog from '@/components/Dialog';
import Form from '@/components/Form';
import Icon from '@/components/SymbolIcon/index.vue';
import Select from '@/components/Select';
import Skeleton from '@/components/Skeleton';

const ComponentHashMap = {
  [`Table`]: Table,
  [`Search`]: Search,
  [`Drawer`]: Drawer,
  [`Dialog`]: Dialog,
  [`Form`]: Form,
  [`Icon`]: Icon,
  [`Select`]: Select,
  [`Skeleton`]: Skeleton,

  [`Peng-Table`]: Table,
  [`Peng-Search`]: Search,
  [`Peng-Drawer`]: Drawer,
  [`Peng-Dialog`]: Dialog,
  [`Peng-Form`]: Form,
  [`Peng-Icon`]: Icon,
  [`Peng-Select`]: Select,
  [`Peng-Skeleton`]: Skeleton,
};

export default ComponentHashMap;
