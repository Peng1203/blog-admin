<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <div class="mb15 flex-sb-c">
        <div>
          <UserSelect
            v-model="tableState.userId"
            :otherOptions="[{ label: '未知', value: -1 }]"
            @change="getDataList"
          />

          <el-button
            ml10
            size="default"
            type="danger"
            :disabled="!tableState.selectVal.length"
            @click="handleDelete({} as any, 2)"
          >
            <el-icon>
              <Delete />
            </el-icon>
            删 除
          </el-button>
        </div>

        <DatePicker
          :type="2"
          v-model="tableState.timeVal"
          @change="getDataList"
        />
      </div>
      <Peng-Table
        isSelection
        operationColumn
        isFilterShowColumn
        :stripe="false"
        :data="tableState.data"
        :loading="tableState.loading"
        :row-class-name="tableRowStatus"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        :operationColumnBtns="['delete']"
        @deleteBtn="row => handleDelete(row, 1)"
        @pageNumOrSizeChange="handlePagerChange"
        @selectionChange="(val: any) => tableState.selectVal = val.map((item: any)=> item.id)"
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
import { useLoginAuditApi } from '@/api';
import { getFromNow } from '@/utils/date';
import { ColumnItem, PageChangeParams, PageInfo } from '@/components/Table';
import DatePicker from '@/components/Date';
import { LoginAuditLogData, LoginAuditLogListData } from './types';
import { resourceMethodOptions } from '@/views/auth/authPermission';
import UserSelect from '@/views/user/user/components/UserSelect.vue';
import { useNotificationMsg } from '@/utils/notificationMsg';

const { getLoginAuditLogs, deleteById, deletes } = useLoginAuditApi();

const tableState = reactive({
  selectVal: ref<number[]>([]),
  loading: false,
  data: <LoginAuditLogData[]>[],
  tableColumns: ref<ColumnItem<LoginAuditLogData>[]>([
    // {
    //   label: 'ID',
    //   prop: 'id',
    //   minWidth: 100,
    // },
    {
      label: '用户名',
      prop: 'userName',
      minWidth: 130,
      tooltip: true,
    },
    {
      label: '设备',
      prop: 'device',
      minWidth: 100,
    },
    {
      label: '状态码',
      prop: 'loginStatus',
      minWidth: 100,
    },
    {
      label: '失败原因',
      prop: 'failureReason',
      minWidth: 150,
    },
    {
      label: '登录时长',
      prop: 'loginDuration',
      minWidth: 120,
    },
    {
      label: '登录地点',
      prop: 'location',
      minWidth: 120,
      tooltip: true,
    },
    {
      label: '登录方式',
      prop: 'loginMethod',
      minWidth: 120,
      tooltip: true,
    },
    {
      label: '浏览器',
      prop: 'browser',
      width: 130,
      tooltip: true,
    },
    {
      label: '操作系统',
      prop: 'os',
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
    {
      label: '用户ID',
      prop: 'userId',
      minWidth: 100,
    },
    {
      label: '登录时间',
      prop: 'loginTime',
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
    const { data: res } = await getLoginAuditLogs<LoginAuditLogListData>(
      params
    );
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

const tableRowStatus = ({ row }: { row: LoginAuditLogData }) => {
  return row.loginStatus === 1 ? 'success-row' : 'fail-row';
};

const handleDelete = async (row: LoginAuditLogData, type: 1 | 2) => {
  const delRes = type === 1 ? await deleteAudit(row.id) : await batchDelete();
  if (!delRes) return;
  getDataList();
};

const deleteAudit = async (id: number) => {
  try {
    const { data: res } = await deleteById(id);
    const { code, message, data, success } = res;

    if (code !== 20000 || !success) return false;
    useNotificationMsg(message, data);
    return true;
  } catch (e) {
    console.log('e', e);
    return false;
  }
};

const batchDelete = async () => {
  try {
    const { data: res } = await deletes(tableState.selectVal);
    const { code, message, data, success } = res;
    if (code !== 20000 || !success) return false;
    useNotificationMsg(message, data);
    return true;
  } catch (e) {
    console.log('e', e);
    return false;
  }
};

onMounted(() => {
  getDataList();
});
</script>
