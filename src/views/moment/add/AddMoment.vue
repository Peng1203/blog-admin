<template>
  <div class="layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <template #header>
        <div class="card-header">
          <span>发布动态</span>

          <PengButton type="primary">发 布</PengButton>
        </div>
      </template>
      {{ form }}
      <br />
      {{ fileList }}
      <PengForm
        ref="addFormRef"
        :labelW="'120px'"
        :formItems="formItems"
        v-model="form"
      >
        <template #mediaUrlSlot>
          <div style="width: 100%; min-height: 12rem">
            <el-upload
              action="#"
              list-type="picture-card"
              accept="image/*,video/*"
              :file-list="fileList"
              :auto-upload="false"
              :on-change="handleSelectFileChange"
            >
              <el-icon><Plus /></el-icon>

              <template #file="{ file }">
                <div class="file-pre-item">
                  <img
                    :src="file.url"
                    class="el-upload-list__item-thumbnail"
                    v-if="file.raw.type.includes('image')"
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePreview(file)"
                    >
                      <el-icon>
                        <zoom-in />
                      </el-icon>
                    </span>

                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>
          </div>
        </template>
      </PengForm>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFormState } from '@/hooks'
import { useUserInfo } from '@/stores/userInfo'
import type { AddMomentForm } from '../types'
import type { UploadFile } from 'element-plus'

const store = useUserInfo()

const fileList = ref([])
const { form, formItems, setFormItems } = useFormState<AddMomentForm>({
  content: '',
  isTop: 0,
  mediaUrls: [],
  status: 1,
  userId: store.userInfos.id,
})

setFormItems([
  {
    type: 'textarea',
    label: '内容',
    prop: 'content',
    span: 16,
  },
  {
    type: 'slot',
    label: '图片',
    prop: 'mediaUrls',
    slotName: 'mediaUrlSlot',
    span: 16,
  },
  {
    type: 'switch',
    label: '置顶',
    prop: 'isTop',
    tValue: 1,
    fValue: 0,
    span: 16,
  },
  {
    type: 'radio',
    label: '状态',
    prop: 'status',
    placeholder: '',
    options: [
      { label: '公开', value: 1 },
      { label: '私密', value: 2 },
    ],
    span: 16,
  },
])

const handleSelectFileChange = (uploadFile: UploadFile) => {
  console.log(`%c uploadFile ----`, 'color: #fff;background-color: #000;font-size: 18px', uploadFile)
}
const handlePreview = (uploadFile: UploadFile) => {}
const handleRemove = (uploadFile: UploadFile) => {}
</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card),
:deep(.el-upload-list__item),
.file-pre-item {
  width: 70px;
  height: 70px;
}
</style>
