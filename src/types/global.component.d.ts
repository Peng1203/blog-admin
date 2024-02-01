import Table from '@/components/Table';
import Form from '@/components/Form';
import Dialog from '@/components/Dialog';

declare module 'vue' {
  interface GlobalComponents {
    Table: typeof Table;
    PengTable: typeof Table;

    Form: typeof Form;
    PengForm: typeof Form;
    'Peng-Form': typeof Form;

    Dialog: typeof Dialog;
    PengDialog: typeof Dialog;
    'Peng-Dialog': typeof Dialog;
  }
}
