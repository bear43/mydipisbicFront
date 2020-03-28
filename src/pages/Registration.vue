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
      <q-input
        clearable
        filled
        v-model="lastName"
        :label="$t('label.lastName') + ' *'"
        :hint="$t('label.lastName')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />
      <q-input
        clearable
        filled
        v-model="firstName"
        :label="$t('label.firstName') + ' *'"
        :hint="$t('label.firstName')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />
      <q-input
        clearable
        filled
        v-model="secondName"
        :label="$t('label.secondName') + ' *'"
        :hint="$t('label.secondName')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />
      <q-input
        clearable
        filled
        v-model="phone"
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
        v-model="cabinet"
        :label="$t('label.cabinet') + ' *'"
        :hint="$t('label.cabinet')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('error.emptyField')]"
      />
      <q-input
        clearable
        filled
        v-model="email"
        :label="$t('label.email') + ' *'"
        :hint="$t('label.email')"
        lazy-rules
        :rules="[
         val => val && val.length > 0 || $t('error.emptyField'),
         val => checkMail(val) || $t('error.wrongEmail')]"
      />
      <div>
        <q-btn :label="$t('label.submit')" type="submit" color="primary"/>
        <q-btn :label="$t('label.reset')" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import Axios from 'axios'
export default {
  data () {
    return {
      username: null,
      password: null,
      lastName: null,
      firstName: null,
      secondName: null,
      phone: null,
      email: null,
      cabinet: null,
      isPwd: true
    }
  },

  methods: {
    onSubmit () {
      Axios.post('http://localhost:8080/users/registration', {
        login: this.username,
        password: this.password,
        lastName: this.lastName,
        firstName: this.firstName,
        secondName: this.secondName,
        email: this.email,
        cabinet: this.cabinet,
        phone: this.phone
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
      this.username = null
      this.password = null
      this.lastName = null
      this.firstName = null
      this.secondName = null
      this.email = null
      this.phone = null
      this.cabinet = null
      this.isPwd = true
    },
    checkMail (value) {
    // eslint-disable-next-line no-useless-escape
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(value).toLowerCase())
    }
  },

  name: 'PageRegistration'
}
</script>
