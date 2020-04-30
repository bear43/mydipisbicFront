<template>
  <q-page class="q-ma-md">
    <q-table
      :title="$t('label.tasks')"
      :data="tasks"
      :columns="columnsComputed"
      row-key="id"
      separator="cell"
      :loading="loading"
    >
      <template v-slot:top>
        <div class="text-h5 q-mt-lg q-mb-lg q-ml-sm">{{$t('label.tasks')}}</div>
        <!-- <q-btn color="primary" :label="$t('label.add')" @click="addNewTask()" /> -->
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
          :value="filter.executor"
          use-input
          :label="$t('label.executor')"
          :options="executors"
          @filter="filterFn"
          @input="onChangeFilter('executor', $event)"
          :option-label="item => item.lastName + ' ' + item.firstName + ' ' + item.secondName + '. Кабинет: ' + item.cabinet"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{$t('label.noResult')}}</q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn class="q-mb-lg" color="primary" :label="$t('label.add')" @click="addNewTask()" />
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
        <q-tr @click="onRowClicked($event, props.row)">
          <q-td
            v-for="column in props.cols"
            :key="column.name"
            :class="'text-' + column.align"
            v-bind:column="column"
          >
            <div v-if="column.name === 'remove'">
              <q-btn
                :icon="column.name"
                @click="column.handler ? column.handler(column.value) : null"
                v-if="props.row.status ? props.row.status.key === 'PENDING' : column.show"
              />
            </div>
            <div v-else-if="column.special">
              <q-btn
                :icon="column.name"
                @click="column.handler ? column.handler(column.value) : null"
                v-if="column.show || (props.row.changed && column.showOnChanged) || ($store.getters['TaskStore/hasChanges']({
        stateSrc: 'tasks',
        data: props.row
      }) && column.showOnChanged)"
              />
            </div>
            <div
              v-else-if="column.name==='executor'"
              @contextmenu.prevent="onProfileClick(props.row.executor)"
            >
              {{props.row.executor ? props.row.executor.lastName + ' ' + props.row.executor.firstName + ' ' + props.row.executor.secondName : $t('label.notChoosed') }}
              <q-popup-edit
                :value="props.row.executor"
                v-if="props.row.status ? props.row.status.key === 'PENDING' : true"
              >
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
            <q-popup-edit
              :value="column.value"
              v-if="column.editable && (props.row.status ? props.row.status.key === 'PENDING' : true)"
            >
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
    <q-dialog v-model="infoDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{$t('label.info')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div
            v-if="infoDialog.object.rejectReason"
          >{{$t('text.rejected') + ': ' + infoDialog.object.rejectReason}}</div>
          <div
            v-if="infoDialog.object.doneMsg"
          >{{$t('text.done') + ': ' + infoDialog.object.doneMsg}}</div>
          <div
            v-if="infoDialog.object.startDate"
          >{{$t('text.startDate') + ': ' + infoDialog.object.startDate}}</div>
          <div
            v-if="infoDialog.object.doneDate"
          >{{$t('text.doneDate') + ': ' + infoDialog.object.doneDate}}</div>
        </q-card-section>

        <q-card-section>
          <div>
          Оцените качество выполнения задачи:
          <q-rating v-if="infoDialog.object && infoDialog.object.status ? infoDialog.object.status.key === 'DONE' : false" @click="onRateClick" v-model="ratingModel" size="2.0em" icon="thumb_up" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('label.close')" v-close-popup />
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
import PageProfile from "./UserProfile";

export default {
  name: "PageTaskType",
  components: {
    PageProfile
  },
  data() {
    return {
      ratingModel: 0,
      infoDialog: {
        show: false,
        object: {}
      },
      profileDialog: {
        show: false,
        object: null
      },
      executor: null,
      customers: null,
      loading: false,
      filter: {
        id: null,
        status: null,
        title: null,
        priority: null,
        type: null,
        executor: null
      },
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
          name: "id",
          required: true,
          label: this.$t("label.id"),
          align: "center",
          field: item => (item.id >= 0 ? item.id : null),
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
          show: true,
          editable: true,
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
          field: item => (item.status ? item.status.value : null),
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
          show: true,
          editable: true,
          selectable: true,
          options: this.priorities,
          displayValue: "value",
          optionValue: "key",
          optionLabel: "value",
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
          editable: true,
          selectable: true,
          options: this.taskTypes,
          displayValue: "title",
          optionValue: "id",
          optionLabel: "title",
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
        },
        {
          name: "refresh",
          required: true,
          label: this.$t("label.reset"),
          align: "center",
          sortable: false,
          headerStyle: "width: 50px",
          show: false,
          special: true,
          field: taskType => taskType,
          handler: item => {
            this.$store.dispatch("TaskStore/reset", {
              stateSrc: "tasks",
              data: item
            });
          },
          showOnChanged: true
        },
        {
          name: "save",
          required: true,
          label: this.$t("label.save"),
          align: "center",
          sortable: false,
          headerStyle: "width: 50px",
          show: false,
          special: true,
          field: taskType => taskType,
          handler: item => {
            this.$store.dispatch("TaskStore/saveTask", item);
          },
          showOnChanged: true
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
    executors: function() {
      return this.$store.state["TaskStore"].executors;
    },
    statuses: function() {
      return this.$store.state["TaskStore"].statuses;
    },
    columnsComputed: function() {
      const columns = this.columns;
      const priorityColumn = columns[4];
      const typeColumn = columns[5];
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
      const executor = this.filter.executor;
      const type = this.filter.type;
      this.$store
        .dispatch("TaskStore/loadTasks", {
          id: this.filter.id,
          title: this.filter.title,
          priority: priority ? priority.key : null,
          status: status ? status.key : null,
          executor: executor ? executor.id : null,
          type: type ? type.id : null
        })
        .then(() => {
          this.loading = false;
        });
    },
    onChangeFilter: function(property, value) {
      this.filter[property] = value;
      this.loadTasks();
    },
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
    onRowClicked: function(evt, row) {
      if (row && row.status && row.status.key !== "PENDING") {
        this.infoDialog.object = row;
        this.infoDialog.show = true;
      }
    },
    onProfileClick: function(user) {
      this.profileDialog.object = user;
      this.profileDialog.show = true;
    }
  }
};
</script>
