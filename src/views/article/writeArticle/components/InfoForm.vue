<template>
  <Peng-Form
    ref="infoFormRef"
    labelW="200"
    v-model="articleForm"
    :formItems="formItemList"
    @radioChange="handleRadioChange"
  />
</template>

<script setup lang="ts">
import { PropType, nextTick, ref } from 'vue';
import { FormItem } from '@/components/Form';
import { AddArticleType } from '../../article';
import { ARTICLE } from '@/constants';
import { useArticleInfo } from '@/stores/articleInfo';
import { onMounted } from 'vue';

const articleForm = defineModel({
  type: Object as PropType<AddArticleType>,
  required: true,
});

const articleInfoStore = useArticleInfo();

const formItemList = ref<FormItem<AddArticleType>[]>([
  {
    span: 13,
    type: 'input',
    label: '标题',
    prop: 'title',
    placeholder: '文章标题',
    disabled: true,
    // rules: [{ required: true, trigger: 'blur', message: '文章标题不能为空' }],
  },
  {
    span: 13,
    type: 'select',
    label: '分类',
    prop: 'category',
    placeholder: '文章分类',
    options: [],
    rules: [{ required: true, trigger: 'blur', message: '文章分类不能为空' }],
  },
  {
    span: 16,
    type: 'select',
    label: '标签',
    prop: 'tags',
    multiple: true,
    multipleLimit: 3,
    placeholder: '标签',
    options: [],
    rules: [{ required: true, trigger: 'change', message: '文章标签不能为空' }],
  },
  {
    type: 'switch',
    label: '置顶',
    prop: 'isTop',
    tText: '是',
    fText: '否',
    tValue: 1,
    fValue: 0,
  },
  {
    type: 'radio',
    label: '类型',
    prop: 'type',
    options: ARTICLE.typeOptions.splice(1),
  },
  {
    type: 'radio',
    label: '状态',
    prop: 'status',
    // options: ARTICLE.statusOptions.splice(1),
    options: [
      { label: '公开', value: 1 },
      { label: '私密', value: 2 },
      { label: '草稿箱', value: 3 },
    ],
  },
  {
    span: 13,
    type: 'pwd',
    label: '访问密码',
    prop: 'accessPassword',
    isShow: false,
    rules: [{ required: true, trigger: 'blur', message: '私密文章 访问不能为空' }],
  },
  {
    type: 'upload',
    label: '封面',
    prop: 'cover',
  },
  {
    type: 'textarea',
    label: '摘要',
    prop: 'summary',
    width: 250,
    height: 150,
    placeholder: '默认取文章内容的前300个字符',
  },
]);

const infoFormRef = ref<RefType>();

// 校验表单
const validateForm = async (): Promise<boolean> => {
  console.log(`%c articleForm.va ----`, 'color: #fff;background-color: #000;font-size: 18px', articleForm.value);
  const { status, ...args } = articleForm.value;
  // 当为私密文章时 调用整个表单校验 否则调用 局部校验
  const [validateMethod, validateProps] = status === 2 ? ['validate', undefined] : ['validateField', Object.keys(args)];

  // return await infoFormRef.value.va;
  const validateStatus = await infoFormRef.value
    .getRef()
    [validateMethod](validateProps)
    .catch(() => false);

  console.log(`%c validateStatus ----`, 'color: #fff;background-color: #000;font-size: 18px', validateStatus);
  return false;
};

// 重置表单校验规则
const resetFormFields = () => infoFormRef.value.resetFields();

// 初始化下拉数据
const optionsInit = async () => {
  await Promise.all([articleInfoStore.getCategoryData(), articleInfoStore.getTagData()]);
  nextTick(() => {
    formItemList.value[1].options = articleInfoStore.categoryOption;
    formItemList.value[2].options = articleInfoStore.tagOption;
  });
};

const handleRadioChange = () => {
  const accessPwdItem = formItemList.value.find(item => item.prop === 'accessPassword');
  if (articleForm.value.status !== 2) accessPwdItem.isShow = false;
  else accessPwdItem.isShow = true;
};

onMounted(() => {
  optionsInit();
});

defineExpose({ validateForm, resetFormFields });
</script>
