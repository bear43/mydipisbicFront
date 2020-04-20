<template>
  <q-page>
    <div class="q-pa-md" style="max-width: 350px">
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>Single line item</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Item with caption</q-item-label>
            <q-item-label caption>Caption</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label overline>OVERLINE</q-item-label>
            <q-item-label>Item with caption</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import Roles from "../utils/roles";
import WS from "../utils/ws";
import roles from "../utils/roles";
export default {
  name: "PageDialogues",
  data: function() {
    return {};
  },
  methods: {},
  computed: {
    userRole: function() {
      return Roles.getUserRoles()[0];
    },
    currentUser: function() {
      return this.$store.state["UserStore"].user;
    }
  },
  mounted() {}
};
</script>