<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{$t('label.title')}}</q-toolbar-title>

        <q-space />
        <div v-for="button in buttons" :key="button.value">
          <q-btn
            stretch
            flat
            :label="button.label"
            :to="button.to"
            v-show="button.show()"
            @click="button.handler ? button.handler() : null"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-page-container>
  </q-layout>
</template>

<script>
import Roles from '../utils/roles'

export default {
  name: 'MainLayout',
  data () {
    return {
      loading: false,
      activeButton: null,
      buttons: [
        {
          to: '/user-cabinet',
          label: this.$t('label.userCabinet'),
          show: () => {
            return Roles.getUser()
          }
        },
        {
          to: '/login',
          label: this.$t('label.signIn'),
          show: () => {
            return !Roles.getUser()
          }
        },
        {
          to: '/registration',
          label: this.$t('label.signUp'),
          show: () => {
            return !Roles.getUser()
          }
        },
        {
          to: '/login',
          label: this.$t('label.logOut'),
          show: () => {
            return Roles.getUser()
          },
          handler: () => {
            Roles.logout()
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'info',
              message: this.$t('notify.successfulLogout')
            })
          }
        }
      ]
    }
  }
}
</script>