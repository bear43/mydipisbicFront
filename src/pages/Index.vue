<template>
  <q-page>
    <PageUserIndex v-if="userRole === 'ROLE_USER'"/>
    <PageCustomerIndex v-else-if="userRole === 'ROLE_EXECUTOR'"/>
  </q-page>
</template>

<script>
import PageUserIndex from './UserIndexPage.vue'
import PageCustomerIndex from './CustomerIndexPage.vue'
import Roles from '../utils/roles'
export default {
  components: {
    PageUserIndex,
    PageCustomerIndex
  },
  name: 'PageIndex',
  computed: {
    userRole: function() {
      return Roles.getUserRoles()[0];
    }
  }
}
</script>
