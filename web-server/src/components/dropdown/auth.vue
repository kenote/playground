<template>
  <el-dropdown class="h-full" popper-class="header-link-dropdown" @command="handleCommand" :trigger="trigger">
    <a class="header-link">
      <span class="el-dropdown-link">
        <el-avatar :icon="Avatar" :size="36"></el-avatar>
      </span>
    </a>
    <template #dropdown>
      <el-dropdown-menu class="header-link-dropdown">
        <div class="header-link-dropdown-head">
          <h3>
            <span>{{ username }}</span>
            <p>
              UID: {{ uid }} 
              <el-tooltip content="复制" placement="top-end" effect="light">
                <a class="ml-2" @click="handleCopyUID">
                  <i class="iconfont icon-copy"></i>
                </a>
              </el-tooltip>
            </p>
          </h3>
          <el-row v-if="(top??[]).length > 0">
            <el-col :span="8" v-for="(item, key) in top??[]" :key="key">
              <el-dropdown-item :command="item.link">{{ item.name }}</el-dropdown-item>
            </el-col>
          </el-row>
        </div>
        <el-dropdown-item v-for="(item, key) in main??[]" :divided="key == 0 || item.divided" :command="item.link">
          {{ item.name }}
          <div v-if="item.buttons">
            <el-button v-for="(btn) in item.buttons" size="small" @click="handleCommand(btn.link)">{{ btn.name }}</el-button>
          </div>
        </el-dropdown-item>
        <el-dropdown-item divided class="end">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { Avatar } from '@element-plus/icons-vue'
import { NavMenu } from '@/types/base'



type Props = {
  trigger   ?: string
  username  ?: string
  uid       ?: string
  top       ?: NavMenu.DataItem[]
  main      ?: NavMenu.DataItem[]
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'hover'
})

const emit = defineEmits(['command'])

const handleCommand = (value?: string) => {
  emit('command', value)
}

const UID = ref<string>('')

const handleCopyUID = async () => {
  let clipboard = useClipboard({ source: UID })
  await clipboard.copy(props.uid)
}

</script>