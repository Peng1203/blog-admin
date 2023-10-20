<template>
  <div class="blog-form-container">
    <el-form
      ref="formRef"
      :size="size"
      :model="formData"
      :disabled="disabled"
      :label-width="labelW"
      :label-position="labelP"
    >
      <el-row :gutter="gutter">
        <!--  -->
        <template
          v-for="(
            {
              type,
              label,
              prop,
              size,
              rules,
              required,
              disabled,
              placeholder,
              span,
              offset,
              xs = 24,
              sm,
              md,
              lg,
              xl,
              isShow,
              slotName,
              options,
              multiple,
              tValue,
              fValue,
              tText,
              fText,
              tIcon,
              fIcon,
              tBgColor,
              fBgColor,
              isInline,
              clearable,
              strengthLevel,
              autocomplete = false,
              width = 80,
              height = 80,
              accept,
              limit,
              ...args
            },
            i
          ) in formItemList"
          :key="i"
        >
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-if="type === 'slot'"
          >
            <!-- 自定义插槽 -->
            <el-form-item
              :prop="prop"
              :label="label"
              :required="required"
              v-show="isShow === undefined ? true : isShow"
            >
              <slot :name="slotName" />
            </el-form-item>
          </el-col>

          <!-- 输入框 -->
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-else-if="type === 'input'"
          >
            <el-form-item
              :size="size"
              :prop="prop"
              :label="label"
              :rules="rules"
              :required="required"
              v-show="isShow === undefined ? true : isShow"
            >
              <el-input
                :size="size"
                :placeholder="placeholder"
                :disabled="disabled || false"
                :clearable="clearable || true"
                :autocomplete="autocomplete ? 'on' : 'off'"
                aria-autocomplete="none"
                auto-complete="new-password"
                v-model="formData[prop]"
                readonly
                @focus="(e: any) => e.target.removeAttribute('readonly')"
              />
            </el-form-item>
          </el-col>

          <!-- 密码框框 -->
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-else-if="type === 'pwd'"
          >
            <el-form-item
              :size="size"
              :prop="prop"
              :label="label"
              :rules="rules"
              :required="required"
              class="pwd-form-item"
              v-show="isShow === undefined ? true : isShow"
            >
              <el-input
                type="password"
                show-password
                aria-autocomplete="none"
                auto-complete="new-password"
                :size="size"
                :placeholder="placeholder"
                :disabled="disabled || false"
                :clearable="clearable || true"
                :autocomplete="autocomplete ? 'on' : 'off'"
                v-model="formData[prop]"
              />

              <!-- 密码强度检测 -->
              <div
                w100
                mt2px
                h5px
                flex-sb-c
                class="pwd-strength-detection"
              >
                <span
                  style="background-color: #fb8172"
                  :style="{ opacity: strengthLevel! >= 1 ? 1 : 0 }"
                ></span>
                <span
                  style="background-color: #fdd752"
                  :style="{ opacity: strengthLevel! >= 2 ? 1 : 0 }"
                ></span>
                <span
                  style="background-color: #01aa8f"
                  :style="{ opacity: strengthLevel! >= 3 ? 1 : 0 }"
                ></span>
              </div>
            </el-form-item>
          </el-col>

          <!-- 下拉选择框 -->
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-else-if="type === 'select'"
          >
            <el-form-item
              :size="size"
              :prop="prop"
              :label="label"
              :rules="rules"
              :required="required"
              v-show="isShow === undefined ? true : isShow"
            >
              <el-select
                :multiple="multiple"
                :placeholder="placeholder"
                :disabled="disabled || false"
                v-model="formData[prop]"
                @change="handleSelectChange($event, prop, i)"
              >
                <el-option
                  v-for="item in options"
                  :size="size"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- switch 选择器 -->
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-else-if="type === 'switch'"
          >
            <el-form-item
              :size="size"
              :prop="prop"
              :label="label"
              :rules="rules"
              :required="required"
              v-show="isShow === undefined ? true : isShow"
            >
              <el-switch
                :size="size"
                :placeholder="placeholder"
                :active-text="tText"
                :active-value="tValue"
                :active-icon="tIcon"
                :inactive-text="fText"
                :inactive-value="fValue"
                :inactive-icon="fIcon"
                :inline-prompt="isInline === undefined ? false : isInline"
                :style="`--el-switch-on-color: ${tBgColor || '#13ce66'} ; --el-switch-off-color: ${
                  fBgColor || '#ff4949'
                } `"
                @change="handleSwitchChange($event, prop, i)"
                v-model="formData[prop]"
              />
            </el-form-item>
          </el-col>

          <!-- radio 单选框 -->
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-else-if="type === 'radio'"
          >
            <el-form-item
              :size="size"
              :prop="prop"
              :label="label"
              :rules="rules"
              :required="required"
              v-show="isShow === undefined ? true : isShow"
            >
              <el-radio-group
                :disabled="disabled"
                v-model="formData[prop]"
                @change="handleRadioChange($event, prop, i)"
              >
                <el-radio
                  v-for="item in options"
                  :disabled="disabled"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                  :size="item.size || size"
                >
                  {{ item.label }}
                </el-radio>
                <!-- <el-radio :size="size" label="2">Option 2</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 多选框 -->
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-else-if="type === 'checkbox'"
          >
            <el-form-item
              :size="size"
              :prop="prop"
              :label="label"
              :rules="rules"
              :required="required"
              v-show="isShow === undefined ? true : isShow"
            >
              <el-checkbox-group
                :size="size"
                :disabled="disabled"
                v-model="formData[prop]"
              >
                <!-- 当绑定的复选框为一个 对象时 -->
                <!-- <template v-if="options"></template> -->
                <el-checkbox
                  :key="i"
                  :label="item.value"
                  v-for="(item, i) of options"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <!-- 富文本输入框 -->
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-else-if="type === 'textarea'"
          >
            <el-form-item
              :size="size"
              :prop="prop"
              :label="label"
              :rules="rules"
              :required="required"
              v-show="isShow === undefined ? true : isShow"
            >
              <el-input
                type="textarea"
                :size="size"
                :placeholder="placeholder"
                :disabled="disabled || false"
                :clearable="clearable || true"
                v-model="formData[prop]"
              />
            </el-form-item>
          </el-col>

          <!-- 透明占位符 -->
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-else-if="type === 'transparent'"
          ></el-col>

          <!-- 上传文件 -->
          <el-col
            :span="span"
            :offset="offset"
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            :class="i + 1 === formItemList.length ? '' : isShow === true || isShow === undefined ? 'mb20' : ''"
            v-else-if="type === 'upload'"
          >
            <el-form-item
              :size="size"
              :prop="prop"
              :label="label"
              :rules="rules"
              :required="required"
              v-show="isShow === undefined ? true : isShow"
            >
              <el-upload
                drag
                class="avatar-uploader"
                :limit="limit"
                :multiple="multiple"
                :disabled="disabled"
                :auto-upload="args.autoUpload"
                :style="{ width: `${width}px`, height: `${height}px` }"
                :accept="accept ? accept.join(',') : ''"
                :show-file-list="args.fsShow"
                :http-request="args.customUploadCb"
                :before-upload="(rawFile: UploadRawFile) => handlebeforeUpload(rawFile, { accept, limit, fileMaxSize: args.fileMaxSize || 1  })"
              >
                <img
                  v-if="formData[prop]"
                  :src="(formData[prop] as string)"
                  :style="{ width: `${width}px`, height: `${height}px` }"
                  class="avatar"
                />
                <el-icon
                  v-else
                  class="avatar-uploader-icon"
                >
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormAttribute, UploadLimit } from './types';
import { UploadRawFile, ElMessage } from 'element-plus';

const emit = defineEmits(['switchChange', 'selectChange', 'radioChange']);

const props = withDefaults(defineProps<FormAttribute>(), {
  formData: () => ({}),
  formItemList: () => [],
  labelW: 'auto',
  labelP: 'right', // left right top
  size: 'large', // large default small
  disabled: false,
  inline: false,
  gutter: 30,
});

const formRef = ref<any>(null);
// 获取Form表单的Ref
const getRef = () => formRef.value;

// switch 切换
const handleSwitchChange = (newVal: any, prop: string, index: number) => {
  // console.log('switch切换 -----', newVal, prop, index)
  emit('switchChange', { newVal, prop, index });
};

// 下拉框 切换
const handleSelectChange = (newVal: any, prop: string, index: number) => {
  // console.log('switch切换 -----', newVal, prop, index)
  emit('selectChange', { newVal, prop, index });
};

// 单选框切换
const handleRadioChange = (newVal: string | number | boolean, prop: string, index: number) => {
  emit('radioChange', { newVal, prop, index });
};

/** 文件上传前的回调 返回 false 或者 Promise.reject() 停止上传 */
const handlebeforeUpload = (rawFile: UploadRawFile, limitInfo: UploadLimit): boolean => {
  const { size, name } = rawFile;
  // 判断 选中的文件类型不在 限制返回内
  const isPass = limitInfo.accept!.some(extName => name.includes(extName));
  if (!isPass) {
    ElMessage.warning('文件类型有误');
    return false;
  }

  if (size > (limitInfo?.fileMaxSize || 1) * 1024 ** 2) {
    ElMessage.warning('文件大小超出限制!');
    return false;
  }

  return true;
};

// 暴露出 可被父组件调用的变量或方法
defineExpose({ getRef });
</script>

<style lang="scss" scoped>
.blog-form-container {
  .avatar-uploader {
    :deep(.el-upload) {
      width: 100%;
      height: 100%;
    }
    :deep(.el-upload-dragger) {
      width: 100%;
      height: 100%;
      padding: 0;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.el-select {
  width: 100%;
}
</style>

<style>
textarea {
  min-height: 100px;
}

.pwd-strength-detection {
  padding: 0 5px;
}
.pwd-strength-detection > span {
  flex: 1;
  height: 100%;
  transition: 0.5s;
}

.avatar-uploader .avatar {
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
