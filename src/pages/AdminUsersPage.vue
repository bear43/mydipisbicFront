<template>
  <q-page class="q-ma-md">
    <q-table
      :title="$t('label.users')"
      :data="users"
      :columns="columns"
      row-key="id"
      separator="cell"
      :pagination.sync="pagination"
      :loading="loading"
      @request="request"
    >
      <template v-slot:top>
        <div class="text-h5 q-mt-lg q-mb-lg q-ml-sm">{{$t('label.users')}}</div>
        <q-input
          class="fit q-mb-lg"
          square
          filled
          :value="filter.id"
          :label="$t('label.id')"
          clearable
          reverse-fill-mask
          mask="#"
          @input="onChangeFilter('id', $event)"
        />
        <q-input
          class="fit q-mb-lg"
          square
          filled
          :value="filter.username"
          :label="$t('label.username')"
          clearable
          @input="onChangeFilter('username', $event)"
        />
        <q-select
          class="fit q-mb-lg"
          square
          filled
          clearable
          option-value="key"
          option-label="value"
          :value="filter.role"
          :options="roles"
          :label="$t('label.role')"
          @input="onChangeFilter('role', $event)"
        />
        <q-input
          class="fit q-mb-lg"
          square
          filled
          :value="filter.fullName"
          :label="$t('label.fullName')"
          clearable
          @input="onChangeFilter('fullName', $event)"
        />
        <q-input
          class="fit q-mb-lg"
          square
          filled
          :value="filter.phone"
          :label="$t('label.phone')"
          clearable
          @input="onChangeFilter('phone', $event)"
        />
        <q-input
          class="fit q-mb-lg"
          square
          filled
          :value="filter.cabinet"
          :label="$t('label.cabinet')"
          clearable
          @input="onChangeFilter('cabinet', $event)"
        />
        <q-input
          class="fit q-mb-lg"
          square
          filled
          :value="filter.email"
          :label="$t('label.email')"
          clearable
          @input="onChangeFilter('email', $event)"
        />
        <q-btn color="primary" :label="$t('label.add')" @click="addNewUser()" />
      </template>
      <!-- <template v-slot:header="props">
        <q-tr>
          <q-th
            v-for="column in props.cols"
            :key="column.name"
            :class="column.headerClass"
            :style="column.headerStyle"
          >{{column.label}}</q-th>
        </q-tr>
      </template>-->
      <template v-slot:body="props">
        <q-tr @click="onRowClicked($event, props.row)">
          <q-td
            v-for="column in props.cols"
            :key="column.name"
            :class="'text-' + column.align"
            v-bind:column="column"
          >
            <div v-if="column.name==='removeOrRestore'">
              <q-btn
                :icon="props.row.removed ? 'restore' : 'remove'"
                @click.stop="column.handler ? column.handler(column.value) : null"
                v-if="column.show && props.row.id !== thisUser.id"
              />
            </div>
            <div v-else>{{ column.value }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="editDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{editDialog.title}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense clearable :label="$t('label.username')" v-model="editDialog.user.login" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            clearable
            :label="$t('label.password')"
            v-model="editDialog.user.password"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select
            dense
            clearable
            :label="$t('label.role')"
            option-value="key"
            option-label="value"
            :options="roles"
            v-model="editDialog.user.role"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            clearable
            :label="$t('label.lastName')"
            v-model="editDialog.user.lastName"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            clearable
            :label="$t('label.firstName')"
            v-model="editDialog.user.firstName"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            clearable
            :label="$t('label.secondName')"
            v-model="editDialog.user.secondName"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            clearable
            :label="$t('label.phone')"
            v-model="editDialog.user.phone"
            mask="#-(###)-###-##-##"
            prefix="+"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            clearable
            :label="$t('label.email')"
            v-model="editDialog.user.email"
            lazy-rules
            :rules="[
            val => !val || val.length === 0 || checkMail(val) || $t('error.wrongEmail')
         ]"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense clearable :label="$t('label.cabinet')" v-model="editDialog.user.cabinet" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('label.close')" v-close-popup />
          <q-btn flat :label="$t('label.submit')" @click="saveUser()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import roles from "../utils/roles";
import axios from "axios";
export default {
  name: "PageAdminUsers",
  data() {
    return {
      loading: false,
      editDialog: {
        title: this.$t("label.addUser"),
        show: false,
        user: {}
      },
      pagination: {
        sortBy: "id",
        descending: false,
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      filter: {
        id: null,
        username: null,
        role: null,
        fullName: null,
        phone: null,
        cabinet: null,
        email: null
      },
      columns: [
        {
          name: "removeOrRestore",
          required: true,
          label: this.$t("label.removeOrRestore"),
          align: "center",
          sortable: false,
          headerStyle: "width: 50px",
          show: true,
          special: true,
          field: item => item,
          handler: item => {
            this.$store
              .dispatch(
                item.removed ? "UserStore/restore" : "UserStore/remove",
                item
              )
              .then(resp => {
                this.$q.notify({
                  color: "green-4",
                  textColor: "white",
                  icon: "cloud_done",
                  message: this.$t("notify.successful")
                });
              });
          }
        },
        {
          name: "id",
          required: true,
          label: this.$t("label.id"),
          align: "center",
          field: "id",
          sortable: true
        },
        {
          name: "login",
          required: true,
          label: this.$t("label.username"),
          align: "center",
          field: "login",
          sortable: true
        },
        {
          name: "role",
          required: true,
          label: this.$t("label.role"),
          align: "center",
          field: item =>
            item.role ? item.role.value : this.$t("label.undefined"),
          sortable: true
        },
        {
          name: "fullName",
          required: true,
          label: this.$t("label.fullName"),
          align: "center",
          field: item => roles.getUserFullName(item),
          sortable: true
        },
        {
          name: "phone",
          required: true,
          label: this.$t("label.phone"),
          align: "center",
          field: "phone",
          sortable: true
        },
        {
          name: "cabinet",
          required: true,
          label: this.$t("label.cabinet"),
          align: "center",
          field: "cabinet",
          sortable: true
        },
        {
          name: "email",
          required: true,
          label: this.$t("label.email"),
          align: "center",
          field: "email",
          sortable: true
        }
      ]
    };
  },
  computed: {
    users: function() {
      return this.$store.state["UserStore"].users.result;
    },
    totalRows: function() {
      return this.$store.state["UserStore"].users.total;
    },
    roles: function() {
      return this.$store.state["UserStore"].users.roles;
    },
    thisUser: function() {
      return this.$store.state["UserStore"].user;
    }
  },
  mounted() {
    this.loadUsers();
    this.$store.dispatch("UserStore/loadRoles");
  },
  methods: {
    loadUsers: function() {
      this.loading = true;
      this.$store.dispatch("UserStore/setPagination", { ...this.pagination });
      this.$store.dispatch("UserStore/setFilter", { ...this.filter });
      this.$store.dispatch("UserStore/loadUsers").then(() => {
        this.pagination.rowsNumber = this.totalRows;
      });
      this.loading = false;
    },
    request: function(reuqestProp) {
      this.pagination = reuqestProp.pagination;
      this.loadUsers();
    },
    addNewUser: function() {
      this.editDialog.user = {
        id: null,
        login: null,
        password: null,
        lastName: null,
        firstName: null,
        secondName: null,
        phone: null,
        email: null,
        cabinet: null
      };
      this.editDialog.title = this.$t("label.addUser");
      this.editDialog.show = true;
    },
    saveUser: function() {
      let user = { ...this.editDialog.user };
      axios
        .post("http://localhost:8080/users/registration", user)
        .then(response => {
          this.editDialog.show = false;
          this.loadUsers();
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: this.$t("notify.successful")
          });
        });
    },
    checkMail(value) {
      // eslint-disable-next-line no-useless-escape
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(value).toLowerCase());
    },
    onRowClicked: function(evt, row) {
      this.editDialog.user = { ...row };
      this.editDialog.title = this.$t("label.editUser");
      this.editDialog.show = true;
    },
    onChangeFilter: function(property, value) {
      this.filter[property] = value;
      this.loadUsers();
    }
  }
};
</script>