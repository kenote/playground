<template>
  <el-dialog :title="title" ref="dialogRef"
    v-model="modelValue"
    :width="toPixelSize(width)"
    :append-to-body="true"
    :modal="modal"
    :fullscreen="fullscreen"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="true"
    :show-close="showClose"
    :center="center"
    :draggable="draggable"
    :lock-scroll="lockScroll"
    @close="handleClose"
    >
    <template #header>
      <span class="el-dialog__title">{{ title }}</span>
      <el-button v-if="showFullscreen"
        :icon="fullscreen ? CopyDocument : FullScreen" 
        size="small"
        :class="fullscreenBtnClass"
        @click="fullscreen = !fullscreen"
        >
      </el-button>
    </template>
    <section :style="sectionStyle(fullscreen)">
      <div v-if="content" v-html="content"></div>
      <slot></slot>
    </section>
    <template #footer>
      <div v-if="!center" class="float-left text-left w-[calc(100%-200px)]">
        <slot name="tools"></slot>
      </div>
      <el-button v-if="showFooter" size="large" @click="modelValue = false" >{{ cancelButtonText }}</el-button>
      <el-button v-if="showFooter" size="large" type="primary" @click="handleSubmit" :loading="loading">{{ confirmButtonText }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { DialogProps } from '@/types/views/dialog'
import { FullScreen, CopyDocument } from '@element-plus/icons-vue'

type Props = DialogProps & {
  modelValue        ?: boolean
  loading           ?: boolean
  cancelButtonText  ?: string
  confirmButtonText ?: string
  showFooter        ?: boolean | 'confirm'
  env               ?: Record<string, any>
  content           ?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  showClose: true,
  width: 500,
  cancelButtonText: '取 消',
  confirmButtonText: '确 定',
  modal: true,
  closeOnClickModal: true,
  content: ''
})
const dialogRef = ref()
const modelValue = ref(props.modelValue)
const closeOnClickModal = ref(props.closeOnClickModal)
const closeOnPressEscape = ref(props.closeOnPressEscape)
const fullscreen = ref(props.fullscreen)
const showClose = ref(props.showClose)
const center = ref(props.center)
const modal = ref(props.modal)
const draggable = ref(props.draggable)
const lockScroll = ref(props.lockScroll)
const confirmButtonText = ref(props.confirmButtonText)
const cancelButtonText = ref(props.cancelButtonText)
const showFooter = ref(props.showFooter)

const fullscreenBtnClass = ref('el-dialog__headerbtn !top-1 !hover:bg-transparent !focus:bg-transparent')
if (props.showClose) {
  fullscreenBtnClass.value = 'el-dialog__headerbtn !right-11 !top-1 !hover:bg-transparent !focus:bg-transparent'
}

const emit = defineEmits(['command', 'update:modelValue'])

initProps(props)

watch(
  () => modelValue.value,
  (value, oldVal) => {
    emit('update:modelValue', value)
  }
)
watch(
  () => props.modelValue,
  (value, oldVal) => {
    modelValue.value = value
  }
)

function initProps (value: Props) {
  
}

function sectionStyle (value: boolean) {
  let styles = {}
  if (!value) {
    styles = {
      height: toPixelSize(props.height),
      // maxHeight: toPixelSize(100)
    }
  }
  return styles
}

function handleClose () {
  modelValue.value = false
  fullscreen.value = props.fullscreen
}

function handleSubmit () {
  emit('command', 'submit:form', { 
    el: dialogRef.value,
    next: () => {
      handleClose()
    } 
  })
}

</script>