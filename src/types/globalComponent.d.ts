import Table from '@/components/Table';
import Form from '@/components/Form';
import Dialog from '@/components/Dialog';
import Skeleton from '@/components/Skeleton';
import Search from '@/components/Search';
import Select from '@/components/Select';

/** 封装Form表单的实例 */
declare module 'MyComponent' {
  type FormInstance = InstanceType<typeof Form>;
}

declare module 'vue' {
  interface GlobalComponents {
    'Peng-Table': typeof Table;
    'Peng-Form': typeof Form;
    'Peng-Dialog': typeof Dialog;
    'Peng-Skeleton': typeof Skeleton;
    'Peng-Search': typeof Search;
    'Peng-Select': typeof Select;
  }

  type FormInstance = InstanceType<typeof Form>;
}
