<template>
  <q-page class="q-ma-md">
    <q-table
      :title="$t('label.tasks')"
      :data="tasks"
      :columns="columnsComputed"
      row-key="id"
      separator="cell"
      :pagination.sync="pagination"
      :loading="loading"
      @request="request"
    >
      <template v-slot:top>
        <!-- <q-btn color="primary" :label="$t('label.add')" @click="addNewTask()" /> -->
        <div class="text-h5 q-mt-lg q-mb-lg q-ml-sm">{{$t('label.tasks')}}</div>
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
          :value="filter.title"
          :label="$t('label.title')"
          clearable
          @input="onChangeFilter('title', $event)"
        />
        <q-select
          class="fit q-mb-lg"
          square
          filled
          clearable
          option-value="key"
          option-label="value"
          :value="filter.status"
          :options="statuses"
          :label="$t('label.status')"
          @input="onChangeFilter('status', $event)"
        />
        <q-select
          class="fit q-mb-lg"
          square
          filled
          clearable
          option-value="key"
          option-label="value"
          :value="filter.priority"
          :options="priorities"
          :label="$t('label.priority')"
          @input="onChangeFilter('priority', $event)"
        />
        <q-select
          class="fit q-mb-lg"
          square
          filled
          clearable
          option-value="id"
          option-label="title"
          :value="filter.type"
          :options="types"
          :label="$t('label.type')"
          @input="onChangeFilter('type', $event)"
        />
        <q-select
          class="fit q-mb-lg"
          square
          filled
          clearable
          :value="filter.customer"
          use-input
          :label="$t('label.customer')"
          :options="customers"
          @filter="filterFn"
          @input="onChangeFilter('customer', $event)"
          :option-label="item => item.lastName + ' ' + item.firstName + ' ' + item.secondName + '. Кабинет: ' + item.cabinet"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{$t('label.noResult')}}</q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-checkbox v-model="noExecutor" :label="$t('label.freeTasks')" @input="onFreeTask()" />
      </template>
      <template v-slot:header="props">
        <q-tr>
          <q-th auto-width />
          <q-th
            v-for="column in props.cols"
            :key="column.name"
            :class="column.headerClass"
            :style="column.headerStyle"
          >{{column.label}}</q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="accent"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td
            v-for="column in props.cols"
            :key="column.name"
            :class="'text-' + column.align"
            :column="column"
            @contextmenu.prevent="column.contextMenu ? column.contextMenu(props.row.customer) : null"
          >
            <div v-if="column.special">
              <q-btn
                :icon="column.name"
                @click="column.handler ? column.handler(column.value) : null"
                v-if="column.show || props.row.changed || ($store.getters['TaskStore/hasChanges']({
        stateSrc: 'tasks',
        data: props.row
      }) && column.showOnChanged)"
              />
            </div>
            <div v-else>{{ column.value }}</div>
            <q-popup-edit :value="column.value" v-if="column.editable">
              <q-select
                v-if="column.selectable"
                square
                filled
                :display-value="column.value ? column.value[column.displayValue] : $t('label.notChoosed')"
                :option-value="column.optionValue"
                :option-label="column.optionLabel"
                :value="column.value ? column.value : $t('label.notChoosed')"
                :options="column.options"
                :label="column.label"
                @input="column.onSelect(props.row, $event)"
              />
              <q-input
                v-else
                :value="column.value"
                @change="column.onChange(props.row, $event)"
                dense
                autofocus
                counter
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div
              v-if="props.row.status && props.row.status.key === 'REJECTED'"
            >{{$t('text.rejected') + ': ' + props.row.rejectReason}}</div>
            <div
              v-else-if="props.row.status && props.row.status.key === 'DONE'"
            >{{props.row.doneMsg}}</div>
            <div v-if="props.row.startDate">{{$t('text.startDate') + ': ' + props.row.startDate}}</div>
            <div v-if="props.row.doneDate">{{$t('text.doneDate') + ': ' + props.row.doneDate}}</div>
            <q-btn
              class="q-ml-xs"
              color="red"
              :label="$t('label.reject')"
              v-if="props.row.status && props.row.status.key !== 'DONE' && props.row.status.key !== 'REJECTED'"
              @click="rejectTask(props.row)"
            />
            <q-btn
              class="q-ml-md"
              color="primary"
              :label="$t('label.take')"
              v-if="props.row.status && props.row.status.key === 'PENDING' || props.row.status.key === 'REJECTED'"
              @click="takeTask(props.row)"
            />
            <q-btn
              class="q-ml-md"
              color="green"
              :label="$t('label.done')"
              v-if="props.row.status && props.row.status.key === 'PROCESSING'"
              @click="doneTask(props.row)"
            />
            <div v-if="props.row.rate">
              {{$t('text.taskRate')}}:
              <q-rating :value="props.row.rate" readonly size="2.0em" icon="thumb_up" />
            </div>
            <!-- <q-btn
              class="q-ml-md"
              color="white"
              text-color="black"
              :label="$t('label.profile')"
              @click="onProfileClick(props.row.customer)"
            ></q-btn>-->
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="rejectDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{$t('label.reject')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            :value="rejectDialog.object ? rejectDialog.object.rejectReason : null"
            autofocus
            @keyup.enter="rejectDialog.show = false"
            type="textarea"
            @input="onChangeRejectReason(rejectDialog.object, $event)"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('label.cancel')" v-close-popup />
          <q-btn flat :label="$t('label.apply')" v-close-popup @click="applyRejectTask()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="doneDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{$t('label.done')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            :value="doneDialog.object ? doneDialog.object.doneMsg : null"
            autofocus
            @keyup.enter="doneDialog.show = false"
            type="textarea"
            @input="onChangeDoneMsg(doneDialog.object, $event)"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('label.cancel')" v-close-popup />
          <q-btn flat :label="$t('label.apply')" v-close-popup @click="applyDoneTask()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="profileDialog.show" persistent>
      <q-card style="min-width: 350px">
        <PageProfile :user="profileDialog.object" :closeFn="() => { profileDialog.show = false; }" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Roles from "../utils/roles";
import axios from "../boot/axios";
import PageProfile from "./UserProfile.vue";

export default {
  name: "PageTaskType",
  components: { PageProfile },
  data() {
    return {
      noExecutor: false,
      doneDialog: {
        show: false,
        object: null
      },
      rejectDialog: {
        show: false,
        object: null
      },
      profileDialog: {
        show: false,
        object: null
      },
      loading: false,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      filter: {
        id: null,
        status: null,
        title: null,
        priority: null,
        type: null,
        customer: null,
        executor: null
      },
      executor: null,
      columns: [
        // {
        //   name: "not_interested",
        //   required: true,
        //   label: this.$t("label.reject"),
        //   align: "center",
        //   sortable: false,
        //   headerStyle: "width: 50px",
        //   show: true,
        //   special: true,
        //   field: task => task,
        //   handler: item => {
        //     this.rejectTask(item);
        //   }
        // },
        {
          name: "id",
          required: true,
          label: this.$t("label.id"),
          align: "center",
          field: "id",
          sortable: true,
          show: true
        },
        {
          name: "title",
          required: true,
          label: this.$t("label.title"),
          align: "center",
          field: "title",
          sortable: true,
          show: true
        },
        {
          name: "status",
          required: true,
          label: this.$t("label.status"),
          align: "center",
          field: item =>
            item.status ? item.status.value : this.$t("label.undefined"),
          sortable: true,
          show: true
        },
        {
          name: "priority",
          required: true,
          label: this.$t("label.priority"),
          align: "center",
          sortable: true,
          field: task => {
            return task.priority
              ? task.priority.value
              : this.$t("label.notChoosed");
          },
          show: true
        },
        {
          name: "type",
          required: true,
          label: this.$t("label.type"),
          align: "center",
          sortable: true,
          field: task => {
            return task.type ? task.type.title : this.$t("label.notChoosed");
          }
        },
        {
          name: "customer",
          required: true,
          label: this.$t("label.customer"),
          align: "center",
          field: task => {
            return task.customer
              ? Roles.getUserFullName(task.customer)
              : this.$t("label.notChoosed");
          },
          contextMenu: this.onProfileClick,
          sortable: true,
          show: true
        }
      ]
    };
  },
  computed: {
    tasks: function() {
      return this.$store.state["TaskStore"].tasks;
    },
    hasChanges: function(object) {
      return this.$store.getters["TaskStore/hasChanges"]({
        stateSrc: "tasks",
        data: object
      });
    },
    priorities: function() {
      return this.$store.state["TaskStore"].taskPriorities;
    },
    types: function() {
      return this.$store.state["TaskStore"].taskTypes;
    },
    customers: function() {
      return this.$store.state["TaskStore"].customers;
    },
    statuses: function() {
      return this.$store.state["TaskStore"].statuses;
    },
    columnsComputed: function() {
      const columns = this.columns;
      const priorityColumn = columns[2];
      const typeColumn = columns[3];
      priorityColumn.options = this.priorities;
      typeColumn.options = this.types;
      return columns;
    },
    totalRows: function() {
      return this.$store.state["TaskStore"].page.total;
    }
  },
  mounted() {
    this.$store.dispatch("TaskStore/loadTaskTypes");
    this.$store.dispatch("TaskStore/loadPriorities");
    this.$store.dispatch("TaskStore/loadStatuses");
    this.loadTasks();
  },
  methods: {
    loadTasks: function() {
      this.loading = true;
      const priority = this.filter.priority;
      const status = this.filter.status;
      const customer = this.filter.customer;
      const type = this.filter.type;
      this.$store
        .dispatch("TaskStore/loadExecutorsTasks", {
          start: this.pagination.rowsPerPage * (this.pagination.page - 1),
          limit: this.pagination.rowsPerPage,
          id: this.filter.id,
          title: this.filter.title,
          priority: priority ? priority.key : null,
          status: status ? status.key : null,
          customer: customer ? customer.id : null,
          executor: this.filter.executor,
          type: type ? type.id : null
        })
        .then(() => {
          this.loading = false;
          this.pagination.rowsNumber = this.totalRows;
        });
    },
    addNewTask: function() {
      this.$store.dispatch("TaskStore/addNewTask");
    },
    filterFn: function(val, update, abort) {
      const goSearch = val && val !== "";
      if (goSearch) {
        this.$store.dispatch("TaskStore/loadCustomers", val).then(() => {
          update();
        });
      } else {
        update();
      }
    },
    onChangeFilter: function(property, value) {
      this.filter[property] = value;
      this.loadTasks();
    },
    request: function(reuqestProp) {
      this.pagination = reuqestProp.pagination;
      this.loadTasks();
    },
    rejectTask: function(task) {
      this.rejectDialog.object = task;
      this.rejectDialog.show = true;
    },
    takeTask: function(task) {
      this.$store.dispatch("TaskStore/takeTask", task).then(() => {
        this.loadTasks();
      });
    },
    doneTask: function(task) {
      this.doneDialog.object = task;
      this.doneDialog.show = true;
    },
    onChangeRejectReason: function(task, reason) {
      this.$store.dispatch("TaskStore/change", {
        stateSrc: "tasks",
        data: task,
        property: "rejectReason",
        value: reason
      });
    },
    onChangeDoneMsg: function(task, msg) {
      this.$store.dispatch("TaskStore/change", {
        stateSrc: "tasks",
        data: task,
        property: "doneMsg",
        value: msg
      });
    },
    applyRejectTask: function() {
      this.$store
        .dispatch("TaskStore/rejectTask", this.rejectDialog.object)
        .then(() => {
          this.loadTasks();
        });
    },
    applyDoneTask: function() {
      this.$store
        .dispatch("TaskStore/doneTask", this.doneDialog.object)
        .then(() => {
          this.loadTasks();
        });
    },
    onFreeTask: function() {
      this.filter.executor = this.noExecutor ? -1 : null;
      this.loadTasks();
    },
    onProfileClick: function(user) {
      this.profileDialog.object = user;
      this.profileDialog.show = true;
    }
  }
};
</script>
