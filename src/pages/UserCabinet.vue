<template>
<q-page class="flex">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="fit q-ma-md"
    >
      <q-input
        clearable
        filled
        :value="user.login"
        @change="updateUser"
        innerid='login'
        :label="$t('label.username') + ' *'"
        :hint="$t('label.username')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />

      <q-input
        clearable
        filled
        :type="isPwd ? 'password' : 'text'"
        :value="user.password"
        @change="updateUser"
        innerid='password'
        :label="$t('label.password') + ' *'"
        :hint="$t('label.password')"
        lazy-rules
      >
      <template v-slot:append>
        <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
            />
      </template>
      </q-input>
      <q-input
        clearable
        filled
        :value="user.lastName"
        @change="updateUser"
        innerid='lastName'
        :label="$t('label.lastName') + ' *'"
        :hint="$t('label.lastName')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />
      <q-input
        clearable
        filled
        :value="user.firstName"
        @change="updateUser"
        innerid='firstName'
        :label="$t('label.firstName') + ' *'"
        :hint="$t('label.firstName')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />
      <q-input
        clearable
        filled
        :value="user.secondName"
        @change="updateUser"
        innerid='secondName'
        :label="$t('label.secondName') + ' *'"
        :hint="$t('label.secondName')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />
      <q-input
        clearable
        filled
        :value="user.phone"
        @change="updateUser"
        innerid='phone'
        :label="$t('label.phone') + ' *'"
        :hint="$t('label.phone')"
        mask="#-(###)-###-##-##"
        prefix="+"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />
      <q-input
        clearable
        filled
        :value="user.cabinet"
        @change="updateUser"
        innerid='cabinet'
        :label="$t('label.cabinet') + ' *'"
        :hint="$t('label.cabinet')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />
      <q-input
        clearable
        filled
        :value="user.email"
        @change="updateUser"
        innerid='email'
        :label="$t('label.email') + ' *'"
        :hint="$t('label.email')"
        lazy-rules
        :rules="[
         val => val && val.length > 0 || $t('error.emptyField'),
         val => checkMail(val) || $t('error.wrongEmail')]"
      />
      <div class="text-center">
        <q-btn :label="$t('label.submit')" type="submit" color="primary"/>
        <q-btn :label="$t('label.reset')" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
</q-page>
</template>

<script>
import Axios from 'axios'
import Roles from '../utils/roles'
import Vuex from 'vuex'
import lodash from 'lodash'
export default {
  name: 'PageUserCabinet',
  data () {
    return {
      isPwd: true
    }
  },
  methods: {
    onSubmit () {
      Axios.post('http://localhost:8080/users/user-cabinet', {
        id: Roles.getUserId,
        login: this.user.login,
        password: this.user.password,
        lastName: this.user.lastName,
        firstName: this.user.firstName,
        secondName: this.user.secondName,
        email: this.user.email,
        cabinet: this.user.cabinet,
        phone: this.user.phone
      }).then(response => {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: this.$t('notify.successful')
        })
      })
    },

    onReset () {
      this.$store.dispatch('UserStore/resetUser');
      this.isPwd = true
    },
    checkMail (value) {
    // eslint-disable-next-line no-useless-escape
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(value).toLowerCase())
    },
    updateUser (event) {
      this.$store.dispatch('UserStore/updateUser', {
        value: event.target.value,
        property: event.target.attributes.innerid.value
      });
    }
  },
  computed: {
    user: function () {
      return this.$store.state['UserStore'].editableUser;
    }
    //...Vuex.mapState('UserStore', ['user'])
  }
}
</script>
