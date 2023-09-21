<!-- Page::security -->
<template>
  <wrapper-panel>
    Security
  </wrapper-panel>
</template>

<script setup lang="ts">


definePageMeta({
  layout: 'panel',
  middleware: ['auth']
})



</script>