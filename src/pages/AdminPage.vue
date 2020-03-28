<template>
  <q-page class="flex flex-center">
    <TaskType/>
  </q-page>
</template>

<script>
import TaskType from './TaskType.vue'
export default {
  components: {
    TaskType
  },
  name: 'PageAdmin'
}
</script>
