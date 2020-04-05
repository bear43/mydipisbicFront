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
          @filter-abort="abortFilterFn"
          @input="onChangeFilter('customer', $event)"
          :option-label="item => item.lastName + ' ' + item.firstName + ' ' + item.secondName + '. Кабинет: ' + item.cabinet"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{$t('label.noResult')}}</q-item-section>
            </q-item>
          </template>
        </q-select>
      </template>
      <template v-slot:header="props">
        <q-tr>
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
          <q-td
            v-for="column in props.cols"
            :key="column.name"
            :class="'text-' + column.align"
            :column="column"
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
      </template>
    </q-table>
  </q-page>
</template>

<script>
import Roles from "../utils/roles";
import axios from "../boot/axios";

export default {
  name: "PageTaskType",
  data() {
    return {
      loading: false,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      filter: {
        status: null,
        title: null,
        priority: null,
        type: null,
        customer: null
      },
      executor: null,
      columns: [
        // {
        //   name: "remove",
        //   required: true,
        //   label: this.$t("label.remove"),
        //   align: "center",
        //   sortable: false,
        //   headerStyle: "width: 50px",
        //   show: true,
        //   special: true,
        //   field: taskType => taskType,
        //   handler: item => {
        //     this.$store.dispatch("TaskStore/removeTask", item);
        //   }
        // },
        {
          name: "title",
          required: true,
          label: this.$t("label.title"),
          align: "center",
          field: "title",
          sortable: true,
          show: true,
          //editable: true,
          onChange: (value, event) => {
            this.$store.dispatch("TaskStore/change", {
              stateSrc: "tasks",
              data: value,
              property: "title",
              value: event.target.value
            });
          }
        },
        {
          name: "status",
          required: true,
          label: this.$t("label.status"),
          align: "center",
          field: item =>
            item.status ? item.status.value : this.$t("label.undefined"),
          sortable: true,
          shiw: true
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
          show: true,
          //editable: true,
          //selectable: true,
          //options: this.priorities,
          //displayValue: "value",
          //optionValue: "key",
          //optionLabel: "value",
          onSelect: (object, value) => {
            this.$store.dispatch("TaskStore/change", {
              stateSrc: "tasks",
              data: object,
              property: "priority",
              value: value
            });
          }
        },
        {
          name: "type",
          required: true,
          label: this.$t("label.type"),
          align: "center",
          sortable: true,
          field: task => {
            return task.type ? task.type.title : this.$t("label.notChoosed");
          },
          show: true,
          //editable: true,
          //selectable: true,
          //options: this.taskTypes,
          //displayValue: "title",
          //optionValue: "id",
          //optionLabel: "title",
          onSelect: (object, value) => {
            this.$store.dispatch("TaskStore/change", {
              stateSrc: "tasks",
              data: object,
              property: "type",
              value: value
            });
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
          sortable: true,
          show: true
        }
        // {
        //   name: "refresh",
        //   required: true,
        //   label: this.$t("label.reset"),
        //   align: "center",
        //   sortable: false,
        //   headerStyle: "width: 50px",
        //   show: false,
        //   special: true,
        //   field: taskType => taskType,
        //   handler: item => {
        //     this.$store.dispatch("TaskStore/reset", {
        //       stateSrc: "tasks",
        //       data: item
        //     });
        //   },
        //   showOnChanged: true
        // },
        // {
        //   name: "save",
        //   required: true,
        //   label: this.$t("label.save"),
        //   align: "center",
        //   sortable: false,
        //   headerStyle: "width: 50px",
        //   show: false,
        //   special: true,
        //   field: taskType => taskType,
        //   handler: item => {
        //     this.$store.dispatch("TaskStore/saveTask", item);
        //   },
        //   showOnChanged: true
        // }
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
    this.loading = true;
    this.$store.dispatch("TaskStore/loadTaskTypes");
    this.$store.dispatch("TaskStore/loadPriorities");
    this.$store.dispatch("TaskStore/loadStatuses");
    this.$store
      .dispatch("TaskStore/loadExecutorsTasks", {
        start: 0,
        limit: this.pagination.rowsPerPage
      })
      .then(() => {
        this.loading = false;
        this.pagination.rowsNumber = this.totalRows;
      });
  },
  methods: {
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
    abortFilterFn: function() {
      // console.log('delayed filter aborted')
    },
    onChangeFilter: function(property, value) {
      this.filter[property] = value;
      this.loading = true;
      const priority = this.filter.priority;
      const status = this.filter.status;
      const customer = this.filter.customer;
      const type = this.filter.type;
      this.$store
      .dispatch("TaskStore/loadExecutorsTasks", {
        start: 0,
        limit: this.pagination.rowsPerPage,
        title: this.filter.title,
        priority: priority ? priority.key : null,
        status: status ? status.key : null,
        customer: customer ? customer.id : null,
        type: type ? type.id : null
      })
      .then(() => {
        this.loading = false;
        this.pagination.rowsNumber = this.totalRows;
      });
    },
    request: function(reuqestProp) {
      console.log(reuqestProp);
      this.loading = true;
      this.$store
        .dispatch("TaskStore/loadExecutorsTasks", {
          start:
            reuqestProp.pagination.rowsPerPage *
            (reuqestProp.pagination.page - 1),
          limit: reuqestProp.pagination.rowsPerPage
        })
        .then(() => {
          this.loading = false;
          this.pagination = reuqestProp.pagination;
          this.pagination.rowsNumber = this.totalRows;
        });
    }
  }
};
</script>
