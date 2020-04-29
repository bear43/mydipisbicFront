<template>
  <div class="q-pa-md" style="max-width: 450px">
    <q-list bordered separator>
      <q-item v-ripple>
        <q-item-section>{{$t(user.role.key === 'EXECUTOR' ? ('label.executor') : ( user.role.key === 'ADMIN' ? 'label.admin' : 'label.customer'))}}</q-item-section>
        <q-item-section avatar>
          <q-avatar>
            <q-icon
              :name="user.role.key === 'EXECUTOR' ? 'build' : (user.role.key === 'ADMIN' ? 'android' : 'account_circle')"
            />
          </q-avatar>
        </q-item-section>
      </q-item>
      <q-item v-ripple>
        <q-item-section>{{$t('label.fullName')}}:</q-item-section>
        <q-item-section avatar>{{getUserFullName(user)}}</q-item-section>
      </q-item>
      <q-item v-ripple>
        <q-item-section>{{$t('label.username')}}:</q-item-section>
        <q-item-section avatar>{{user.login}}</q-item-section>
      </q-item>
      <q-item v-ripple>
        <q-item-section>{{$t('label.cabinet')}}:</q-item-section>
        <q-item-section avatar>{{user.cabinet}}</q-item-section>
      </q-item>
      <q-item v-ripple>
        <q-item-section>{{$t('label.phone')}}:</q-item-section>
        <q-item-section avatar>{{user.phone}}</q-item-section>
      </q-item>
      <q-item v-ripple>
        <q-item-section>{{$t('label.email')}}:</q-item-section>
        <q-item-section avatar>{{user.email}}</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="onStartDialogClick" class="bg-primary text-white">
        <q-item-section class="absolute-center">{{$t('label.startDialog')}}</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="closeFn" class="bg-green text-white">
        <q-item-section class="absolute-center">{{$t('label.close')}}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import Roles from "../utils/roles";
export default {
  props: ["user", "closeFn"],
  name: "PageProfile",
  methods: {
    getUserFullName: function(user) {
      return Roles.getUserFullName(user);
    },
    onStartDialogClick: function() {
      console.log("dialog");
    }
  }
};
</script>
