import Table from '@/components/Table';

declare module 'vue' {
  interface GlobalComponents {
    Table: typeof Table;
  }
}
