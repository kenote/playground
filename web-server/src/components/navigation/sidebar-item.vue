<template>
  <el-sub-menu v-if="children?.length??0 > 0" :index="<any>index">
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
        :plots="plots"
        :user="user"
        />
    </template>
  </el-sub-menu>
  <template v-else>
    <el-menu-item v-if="isPermission(user?.group.level!, getRoutePlot(index!, plots))('access')"
      :index="index" 
      >
      <i v-if="icon" class="mr-[6px]" v-bind:class="icon"></i>
      <span>{{ name }}</span>
      <!-- success | info | danger | warning -->
      <el-tag v-if="tag" class="ml-2" :type="<any>tagElem?.type" size="small" effect="dark">{{ tagElem?.val }}</el-tag>
    </el-menu-item>
  </template>
  
</template>

<script setup lang="ts">
import type { ChannelDataNode } from '@kenote/common'
import type { PlotOptions } from '@/types/account'
import type { UserEntitie } from '@/types'

type Props = {
  name      ?: string
  index     ?: string
  icon      ?: string
  tag       ?: string
  children  ?: ChannelDataNode<any>[]
  plots     ?: PlotOptions[]
  user      ?: UserEntitie
}

const props = withDefaults(defineProps<Props>(), {
  
})

const tagElem = ref<{ type?: string, val: string }>(parseTag(props.tag))


</script>
