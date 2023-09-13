<template>
  <div>
    Panel
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'panel',
  middleware: ['auth']
})

</script>