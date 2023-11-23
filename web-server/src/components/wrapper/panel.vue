<template>
  <div class="wrapper-main" ref="mainRef">
    <slot></slot>
    <div class="page-fixed-tools">
      <slot name="tools"></slot>
      <!-- <el-button type="info" :icon="Message" size="large" circle></el-button>
      <el-button type="warning" size="large" circle @click="handleBookmark">
        <i class="iconfont icon-star" />
      </el-button> -->
    </div>
    <el-backtop target=".wrapper-main" :visibility-height="60" :right="20" :bottom="100" />
  </div>

  
</template>

<script setup lang="ts">
import { Message } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '~/store/account'

const mainRef = ref<HTMLDivElement>()
const { timestamp } = storeToRefs(useAccountStore())

onMounted(() => {
  mainRef.value?.scrollTo({ top: 0 })
})

/**
 * 监听页面刷新
 */
watch(
  () => timestamp?.value,
  (value, oldVal) => {
    if (Date.now() - Number(value) < 100) {
      mainRef.value?.scrollTo({ top: 0 })
    }
  }
)

function handleBookmark () {
  
}
</script>

<style lang="less">
.wrapper-main {
  padding: 70px 30px 100px;
  overflow-y: auto;
}

.page-fixed-tools {
  position: fixed;
  bottom: 150px;
  right: 20px;
  display: flex;
  flex-direction: column;
  z-index: 5;

  .el-button {
    margin: 0;
    margin-top: 8px;
    font-size: 16px;

    &+.el-button {
      margin-left: 0;
    }

    i {
      font-size: 18px;
    }
  }
}
</style>