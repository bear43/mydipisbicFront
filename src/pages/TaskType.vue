<template>
  <q-page class="q-ma-md">
    <q-table
      :title="$t('label.taskTypes')"
      :data="types"
      :columns="columns"
      row-key="id"
      separator="cell"
    >
      <template v-slot:top>
        <q-btn color="primary" :label="$t('label.add')" @click='addNewType()' />
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
            v-bind:column='column'
          >
            <div v-if='column.special'>
                <q-btn 
                :icon='column.name' 
                @click='column.handler ? column.handler(column.value) : null'
                v-if="column.show || (props.row.changed && column.showOnChanged)"
                />
            </div>
            <div v-else>{{ column.value }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
export default {
  name: "PageTaskType",
  data() {
    return {
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
          handler: (item) => {
              this.$store.dispatch('TaskStore/removeTaskType', item);
          }
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
          name: "save",
          required: true,
          label: this.$t("label.save"),
          align: "center",
          sortable: false,
          headerStyle: "width: 50px",
          show: false,
          special: true,
          field: taskType => taskType,
          handler: (item) => {
              this.$store.dispatch('TaskStore/saveTaskType', item);
          },
          showOnChanged: true
        }
      ]
    };
  },
  computed: {
    types: function() {
      return this.$store.state["TaskStore"].taskTypes;
    }
  },
  mounted() {
    this.$store.dispatch("TaskStore/loadTaskTypes");
  },
  methods: {
      addNewType: function() {
          this.$store.dispatch('TaskStore/addNewTaskType');
      }
  }
};
</script>
