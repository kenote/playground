<template>
  <template v-if="column.emits">
    <template v-for="(item) in column.emits">
      <el-button v-if="item.type == 'button'"
        :type="item.style"
        :disabled="permitDisabled(item)"
        @click="handleCommand(item.command, scope.row)"
        plain>
        {{ parseTemplate(item.name, env??{}) }}
      </el-button>
      <el-popconfirm v-if="item.type == 'confirm-button'"
        cancel-button-text="取消"
        confirm-button-text="确认"
        :icon="InfoFilled"
        :width="item.options?.width"
        :title="item.options?.message"
        @confirm="handleCommand(item.command, scope.row)"
        >
        <template #reference>
          <el-button
            :type="item.style"
            :disabled="permitDisabled(item)"
            plain>
            {{ parseTemplate(item.name, env??{}) }}
          </el-button>
        </template>
      </el-popconfirm>
    </template>
  </template>
  <!-- 带点击 -->
  <template v-else-if="column.click">
    <span v-if="getValue(scope.row, column.key) == column.defaultValue" :style="getAlpha(column.alpha, scope)">
      {{ getValue(scope.row, column.key) }}
    </span>
    <el-link v-else :style="getAlpha(column.alpha, scope)" @click="handleCommand(column.click, scope.row)">
      {{ getValue(scope.row, column.key) }}
    </el-link>
  </template>
  <!-- 使用模版 -->
  <template v-else-if="column.template">
    <span :style="getAlpha(column.alpha, scope)">{{ parseTemplate(column.template, scope.row) }}</span>
  </template>
  <!-- 默认文字 -->
  <template v-else>
    <el-tooltip v-if="column.clipboard && getValue(scope.row, column.key) != column.defaultValue" content="复制" placement="top-start" effect="light">
      <a class="mr-2 el-link" @click="handleCopyValue(scope.row, column.key)">
        <i class="iconfont icon-copy"></i>
      </a>
    </el-tooltip>
    <span :style="getAlpha(column.alpha, scope)">{{ getValue(scope.row, column.key) }}</span>
  </template>
</template>


<script setup lang="ts">
import type { RenderRowData } from 'element-plus'
import type { TableColumn, EmitOptions } from '@/types/base'
import { get } from 'lodash'
import { customize } from '~/utils/parse'
import { InfoFilled } from '@element-plus/icons-vue'
import { ParseData } from 'parse-string'
import type { FilterQuery } from 'rule-judgment'

type Props = {
  scope      : RenderRowData<any>
  column     : TableColumn
  customize ?: Record<string, Function>
  env       ?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  
})

const emit = defineEmits(['command'])

const handleCommand = (value: string | undefined, row: Record<string, any>) => {
  emit('command', value, row)
}

function getValue (row: Record<string, any>, key: string) {
  let value = get(row, key)
  let { format, defaultValue } = props.column
  return formatString(props.customize??customize, props.env)(value, format, defaultValue)
}

function getAlpha (conditions: FilterQuery<any> | string | undefined, scope: Record<string, any>) {
  return isFilter(props.env)(conditions, scope) ? '' : 'opacoty:.7'
}

function permitDisabled (item: Omit<EmitOptions, "type" | "children">) {
  let { user, permissions } = props.env ?? {}
  let is_permission = isPermission(user?.group?.level, permissions)(item.command!)
  if (!is_permission) return true
  return isDisabled(props.env)(item.disabled, { row: props.scope.row })
}

async function handleCopyValue (row: Record<string, any>, key: string) {
  let clipboard = useClipboard({ source: '' })
  let value = get(row, key)
  await clipboard.copy(value)
}
</script>