<template>
  <slot name="header"></slot>
  <el-scrollbar>
    <el-menu ref="menuRef"
      background-color="#444c54"
      text-color="#ffffff"
      active-text-color="#ffd04b"
      :router="true"
      :unique-opened="false"
      :collapse="false"
      :default-active="defaultActive"
      >
      <template v-for="(item, key) in data??[]">
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
    </el-menu>
  </el-scrollbar>
</template>


<script setup lang="ts">
import type { ChannelDataNode } from '@kenote/common'
import type { PlotOptions } from '@/types/account'
import type { UserEntitie } from '@/types'

type Props = {
  data          : ChannelDataNode<any>[]
  defaultActive : string
  plots        ?: PlotOptions[]
  user         ?: UserEntitie
}

const props = withDefaults(defineProps<Props>(), {
  // data: [],
  defaultActive: '',
})

const menuRef = ref()

</script>

<style lang="less">
.el-menu {
  border: 0!important;

  .el-menu-item.is-active {
    background-color: #373d41!important;
    font-weight: 400;
  }

  .el-submenu .el-menu-item {
    padding: 0 20px;
  }
}
</style>