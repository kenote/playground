<template>
  <el-sub-menu v-if="children?.length??0 > 0" :index="index">
    <template #title>
      <i v-if="icon" class="mr-[6px]" v-bind:class="icon"></i>
      <span>{{ name }}</span>
    </template>
    <template v-for="(item, key) in children??[]">
      <navigation-sidebar-item 
        :name="item.name"
        :index="item.route ?? item.key"
        :icon="item.icon"
        :tag="item.tag"
        :children="item.children"
        />
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="index">
    <i v-if="icon" class="mr-[6px]" v-bind:class="icon"></i>
    <span>{{ name }}</span>
    <!-- success | info | danger | warning -->
    <el-tag v-if="tag" class="ml-2" :type="tagElem?.type" size="small" effect="dark">{{ tagElem?.val }}</el-tag>
  </el-menu-item>
</template>

<script setup lang="ts">
import type { ChannelDataNode } from '@kenote/common'

type Props = {
  name      ?: string
  index     ?: string
  icon      ?: string
  tag       ?: string
  children  ?: ChannelDataNode<any>[]
}

const props = withDefaults(defineProps<Props>(), {
  
})

const tagElem = ref<{ type?: string, val: string }>(parseTag(props.tag))


</script>
