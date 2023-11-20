<template>
  <el-dropdown class="h-full" 
    v-bind:popper-class="`header-link-dropdown header-link-dropdown-service w-[${poperwidth}px]`"
    @command="handleCommand" 
    :trigger="trigger">
    <a class="header-link">
      <span class="el-dropdown-link">
        {{ name }}<i class="iconfont icon-arrow-down ml-1"></i>
      </span>
    </a>
    <template #dropdown>
      <el-dropdown-menu class="header-link-dropdown-wrapper">
        <div class="header-link-dropdown-block" v-for="(rows, key) in group??[]">
          <template v-for="(item) in navigator?.filter( v => rows.includes(v.key))??[]">
            <h3>{{ item.name }}</h3>
            <template v-for="(node) in item.children??[]">
              <el-dropdown-item v-if="plots?.find( v => v.name == node.route?.split('/')?.[1]) || user?.group.level! >= 9998"
                :command="`router:${node.route}`">
                {{ node.name }}
              </el-dropdown-item>
            </template>
          </template>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>


<script setup lang="ts">
import type { Channel } from '@/types/base'
import type { PlotOptions } from '@/types/account'
import type { UserEntitie } from '@/types'

type Props = {
  name       : string
  trigger   ?: string
  navigator ?: Channel.ServiceNode[]
  group     ?: string[][]
  plots     ?: PlotOptions[]
  user      ?: UserEntitie
}
// props.plots?.find( v => v.name)
const props = withDefaults(defineProps<Props>(), {
  name: '快捷导航',
  trigger: 'hover',
})

const poperwidth = ref<number>(228)

const emit = defineEmits(['command'])

const handleCommand = (value?: string) => {
  emit('command', value)
}
</script>

<style lang="less">
.header-link-dropdown-service {
  left: 258px !important;
  // min-height: 400px;
  max-height: 780px;
  min-width: 228px;
  // height: calc(100vh - 54px);
  // width: 680px;
  // max-width: calc(100vw - 480px);

  .header-link-dropdown-wrapper {
    padding: 0 20px;
    
    // columns: 180px 4;
    // column-gap: 12px;
    display: flex;
    flex-direction: row;
  }

  .header-link-dropdown-block {
    margin: 0 10px;
    width: 200px;
    // max-width: 200px;
    margin-bottom: 16px;
    // break-inside: avoid;
    // display: inline-block;
    // min-height: 500px;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    h3 {
      color: #ededed;
    }
  }
}
</style>