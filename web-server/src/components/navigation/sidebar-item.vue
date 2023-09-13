<template>
  <el-sub-menu v-if="children?.length > 0" :index="index">
    <template #title>
      {{ name }}
    </template>
    <template v-for="(item, key) in children??[]">
      <navigation-sidebar-item 
        :name="item.name"
        :index="item.route ?? item.key"
        />
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="index">
    <span>{{ name }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import type { ChannelDataNode } from '@kenote/common'

type Props = {
  name      ?: string
  index     ?: string
  children  ?: ChannelDataNode<any>[]
}

const props = withDefaults(defineProps<Props>(), {
  
})

</script>
