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
            v-bind:column="column"
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
            <div v-else-if="column.name==='executor'">
              {{props.row.executor ? props.row.executor.lastName + ' ' + props.row.executor.firstName + ' ' + props.row.executor.secondName : $t('label.notChoosed') }}
              <q-popup-edit :value="props.row.executor">
                <q-select
                  filled
                  :value="props.row.executor"
                  use-chips
                  use-input
                  :label="$t('label.executor')"
                  :options="executors"
                  @filter="filterFn"
                  @filter-abort="abortFilterFn"
                  @input="onExecutorSelected(props.row, $event)"
                  :option-label="item => item.lastName + ' ' + item.firstName + ' ' + item.secondName + '. Кабинет: ' + item.cabinet"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">{{$t('label.noResult')}}</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-popup-edit>
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
      executor: null,
      columns: [
        {
          name: "remove",
          required: true,
          label: this.$t("label.remove"),
          align: "center",
          sortable: false,
          headerStyle: "width: 50px",
          show: true,
          special: true,
          field: taskType => taskType,
          handler: item => {
            this.$store.dispatch("TaskStore/removeTask", item);
          }
        },
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
          name: "executor",
          required: true,
          label: this.$t("label.executor"),
          align: "center",
          field: task => {
            return task.executor
              ? Roles.getUserFullName(task.executor)
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
    executors: function() {
      return this.$store.state["TaskStore"].executors;
    },
    columnsComputed: function() {
      const columns = this.columns;
      const priorityColumn = columns[2];
      const typeColumn = columns[3];
      priorityColumn.options = this.priorities;
      typeColumn.options = this.types;
      return columns;
    }
  },
  mounted() {
    this.loading = true;
    this.$store.dispatch("TaskStore/loadTaskTypes");
    this.$store.dispatch("TaskStore/loadPriorities");
    this.$store
      .dispatch("TaskStore/loadExecutorsTasks", {
        start: 0,
        limit: 10
      })
      .then(() => {
        this.loading = false;
      });
  },
  methods: {
    addNewTask: function() {
      this.$store.dispatch("TaskStore/addNewTask");
    },
    filterFn: function(val, update, abort) {
      const goSearch = val && val !== "";
      if (goSearch) {
        this.$store.dispatch("TaskStore/loadExecutors", val).then(() => {
          update();
        });
      } else {
        update();
      }
    },
    abortFilterFn: function() {
      // console.log('delayed filter aborted')
    },
    onExecutorSelected: function(object, value) {
      this.$store.dispatch("TaskStore/change", {
        stateSrc: "tasks",
        data: object,
        property: "executor",
        value: value
      });
    },
    check: function(val) {
      console.log(val);
    },
    request: function(reuqestProp) {
      console.log(reuqestProp);
      this.loading = true;
      this.$store.dispatch("TaskStore/loadExecutorsTasks", {
          start: 0,
          limit: 10
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
};
</script>
