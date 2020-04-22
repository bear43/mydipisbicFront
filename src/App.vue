<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vuex from "vuex";
import Roles from "./utils/roles";

export default {
  name: "App",

  computed: {
    ...Vuex.mapActions("UserStore", ["loadUser"])
  },

  mounted() {
    try {
      if (Roles.getUser()) {
        this.loadUser().then(() => {
        });
      }
    } catch {}
  }
};
</script>
