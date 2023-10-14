<template>
  <template v-for="(item) in data??[]">
    <template v-if="isFilter(env)(item.conditions)">
      <el-button v-if="item.type == 'button'"
        :type="item.style"
        :disabled="isDisabled(env)(item.disabled, { values })"
        @click="handleCommand(item.command, { values })"
        plain>
        {{ parseTemplate(item.name, env??{}) }}
      </el-button>
      <el-dropdown v-if="item.type == 'dropdown'"
        :disabled="isDisabled(env)(item.disabled, { values })"
        @command=" (v: string) => handleCommand(v, { values })"
        :hide-on-click="true">
        <el-button :disabled="isDisabled(env)(item.disabled, { values })" >
          {{ item.name }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(node) in item.children??[]" 
              :disabled="isDisabled(env)(node.disabled, { values })"
              :command="node.command">
              {{ node.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </template>
</template>

<script setup lang="ts">
import type { EmitOptions } from '@/types/base'
import { ArrowDown } from '@element-plus/icons-vue'


type Props = {
  data       ?: EmitOptions[]
  env        ?: Record<string, any>
  values     ?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  
})

const emit = defineEmits(['command'])

const handleCommand = (value: string | undefined, row: Record<string, any>) => {
  emit('command', value, row)
}
</script>