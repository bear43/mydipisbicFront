<template>
  <q-page class="flex flex-center">
      <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        clearable
        filled
        v-model="username"
        :label="$t('label.username') + ' *'"
        :hint="$t('label.username')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />

      <q-input
        clearable
        filled
        :type="isPwd ? 'password' : 'text'"
        v-model="password"
        :label="$t('label.password') + ' *'"
        :hint="$t('label.password')"
        lazy-rules
        :rules="[
          val => val !== null && val.length > 0 || $t('error.emptyField')
        ]"
      >
      <template v-slot:append>
        <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
            />
      </template>
      </q-input>
      <div>
        <q-btn :label="$t('label.submit')" type="submit" color="primary"/>
        <q-btn :label="$t('label.reset')" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import Axios from 'axios'
import Vuex from 'vuex'
const querystring = require('querystring')
export default {
  data () {
    return {
      username: null,
      password: null,
      isPwd: true
    }
  },

  methods: {
    onSubmit () {
      Axios.post('http://localhost:8080/login', querystring.stringify({
        username: this.username,
        password: this.password
      })).then(response => {
        document.cookie = 'auth=' + response.headers.auth
        try {
          this.loadUser()
        } catch {}
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: this.$t('notify.successfulSignIn')
        })
        this.$router.push('/')
      })
    },

    onReset () {
      this.username = null
      this.password = null
      this.isPwd = true
    }
  },
  computed: {
    ...Vuex.mapActions('UserStore', ['loadUser'])
  },
  name: 'PageLogin'
}
</script>
