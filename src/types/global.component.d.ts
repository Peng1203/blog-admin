import Table from '@/components/Table';
import Form from '@/components/Form';

declare module 'vue' {
  interface GlobalComponents {
    Table: typeof Table;
    PengTable: typeof Table;

    Form: typeof Form
    PengForm: typeof Form
    'Peng-Form': typeof Form
  }


}
