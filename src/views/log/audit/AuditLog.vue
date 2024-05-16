<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <div class="mb15 flex-sb-c">
        <UserSelect
          v-model="tableState.userId"
          :otherOptions="[{ label: '未知', value: -1 }]"
          @change="getDataList"
        />

        <DatePicker
          :type="2"
          v-model="tableState.timeVal"
          @change="getDataList"
        />
      </div>
      <Peng-Table
        :stripe="false"
        isFilterShowColumn
        :data="tableState.data"
        :loading="tableState.loading"
        :row-class-name="tableRowStatus"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        @pageNumOrSizeChange="handlePagerChange"
      >
        <!-- 请求方式 -->
        <template #methodSlot="{ row, prop }">
          <el-tag
            w60
            style="border: none"
            effect="dark"
            :color="handleMethodTagColor(row[prop])"
          >
            {{ handleMethodTagText(row[prop]) }}
          </el-tag>
        </template>

        <template #operStatusSlot="{ row, prop }">
          <el-tag
            effect="dark"
            type="success"
            v-if="row[prop]"
          >
            {{ `成 功` }}
          </el-tag>

          <el-tag
            effect="dark"
            type="danger"
            v-else
          >
            {{ `失 败` }}
          </el-tag>
        </template>

        <template #requestTimeSlot="{ row, prop }">
          <el-tooltip
            effect="dark"
            placement="top-start"
            :content="row[prop]"
          >
            {{ getFromNow(row[prop]) }}
          </el-tooltip>
        </template>
      </Peng-Table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useAuditApi } from '@/api';
import { getFromNow } from '@/utils/date';
import { ColumnItem, PageChangeParams, PageInfo } from '@/components/Table';
import DatePicker from '@/components/Date';
import { AuditLogData, AuditLogListData } from './types';
import { resourceMethodOptions } from '@/views/auth/authPermission';
import UserSelect from '@/views/user/user/components/UserSelect.vue';

const { getAuditLogs } = useAuditApi();

const tableState = reactive({
  loading: false,
  data: <AuditLogData[]>[],
  tableColumns: ref<ColumnItem<AuditLogData>[]>([
    // {
    //   label: 'ID',
    //   prop: 'id',
    //   minWidth: 100,
    // },
    {
      label: '请求资源',
      prop: 'router',
      minWidth: 130,
      fixed: 'left',
      tooltip: true,
    },
    {
      label: '请求方式',
      prop: 'method',
      minWidth: 100,
      fixed: 'left',
      slotName: 'methodSlot',
    },
    // {
    //   label: '操作状态',
    //   prop: 'operationStatus',
    //   minWidth: 100,
    //   slotName: 'operStatusSlot',
    // },
    {
      label: '状态码',
      prop: 'statusCode',
      minWidth: 100,
    },
    {
      label: '响应耗时 (ms)',
      prop: 'responseTime',
      minWidth: 120,
    },
    {
      label: '请求查询参数',
      prop: 'requestQueryParams',
      minWidth: 120,
      tooltip: true,
    },
    {
      label: '请求主体参数',
      prop: 'requestBodyParams',
      minWidth: 120,
      tooltip: true,
    },
    {
      label: '错误消息',
      prop: 'errMessage',
      width: 130,
      tooltip: true,
    },
    {
      label: '描述',
      prop: 'description',
      width: 130,
      tooltip: true,
    },

    {
      label: '用户代理',
      prop: 'userAgent',
      minWidth: 100,
      tooltip: true,
    },
    {
      label: 'IP',
      prop: 'ip',
      minWidth: 130,
    },
    // {
    //   label: '用户ID',
    //   prop: 'userId',
    //   minWidth: 100,
    // },
    {
      label: '用户',
      prop: 'userName',
      minWidth: 80,
      fixed: 'right',
    },
    {
      label: '请求于',
      prop: 'createTime',
      minWidth: 100,
      slotName: 'requestTimeSlot',
      fixed: 'right',
    },
  ]),
  timeVal: <string[]>[],
  column: '',
  order: '',
  queryStr: '',
  userId: 0,
  pagerInfo: ref<PageInfo>({
    page: 1,
    pageSize: 50,
    total: 0,
  }),
});

const getDataList = async () => {
  try {
    tableState.loading = true;
    const [startTime, endTime] = tableState.timeVal;
    const params = {
      queryStr: tableState.queryStr,
      column: tableState.column,
      order: tableState.order,
      page: tableState.pagerInfo.page,
      pageSize: tableState.pagerInfo.pageSize,
      userId: tableState.userId,
      startTime,
      endTime,
    };
    const { data: res } = await getAuditLogs<AuditLogListData>(params);
    const { code, data, success } = res;
    if (code !== 20000 || !success) return;
    tableState.data = data.list;
    tableState.pagerInfo.total = data.total;
  } catch (e) {
    console.log('e', e);
  } finally {
    tableState.loading = false;
  }
};

const handlePagerChange = ({ page, pageSize }: PageChangeParams) => {
  tableState.pagerInfo.page = page;
  tableState.pagerInfo.pageSize = pageSize;
  getDataList();
};

const handleMethodTagColor = (value: any) => {
  return resourceMethodOptions.find(item => item.value === value)!.color;
};

const handleMethodTagText = (value: any) => {
  return resourceMethodOptions.find(item => item.value === value)!.label;
};

const tableRowStatus = ({ row }: { row: AuditLogData }) => {
  return row.operationStatus ? 'success-row' : 'fail-row';
};

onMounted(() => {
  getDataList();
});
</script>
