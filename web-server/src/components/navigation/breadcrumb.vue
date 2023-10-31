<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in data">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="page-tools">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ChannelDataNode, dataNodeProxy, initMaps } from '@kenote/common'

type Props = {
  routePath: string
  navigator: ChannelDataNode<any>
}

const props = withDefaults(defineProps<Props>(), {
  
})

const data = ref<Pick<ChannelDataNode<any>, 'key' | 'name'>[]>()
// updateData(props.navigator, props.routePath)

watch(
  () => [ props.navigator, props.routePath ],
  async (value, oldVal) => {
    if (value == oldVal) return
    updateData(<ChannelDataNode<any>>value?.[0], <string>value?.[1])
  },
  { immediate: true }
)

function updateData (navigator: ChannelDataNode<any>, routePath: string) {
  let __nav = dataNodeProxy(initMaps([navigator]))
  data.value = __nav?.find({ route: routePath })?.maps
}

</script>