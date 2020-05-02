<template>
  <q-page class="q-ma-md">
    <div class="q-pa-md">
      <q-table
        :title="$t('label.executorRating')"
        :data="data"
        :columns="columns"
        row-key="id"
        :pagination.sync="pagination"
        :loading="loading"
        @request="request"
        :visible-columns="visibleColumns"
      />
    </div>
  </q-page>
</template>

<script>
import PageProfile from "./UserProfile.vue";
import axios from "axios";
export default {
  components: {
    PageProfile
  },
  name: "PageRating",
  data() {
    return {
      loading: false,
      visibleColumns: [],
      pagination: {
        descending: false,
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      data: [],
      columns: [
        {
          name: "id",
          required: false,
          label: this.$t("label.id"),
          align: "center",
          field: row => row.id,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: "fullName",
          required: true,
          label: this.$t("label.fullName"),
          align: "left",
          field: row => row.user ? (row.user.lastName + ' ' + row.user.firstName + ' ' + row.user.secondName) : null,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: "averageRate",
          required: true,
          label: this.$t("text.averageRate"),
          align: "center",
          field: row => row.averageRate,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: "totalTaskCount",
          required: true,
          label: this.$t("text.taskCount"),
          align: "center",
          field: row => row.totalTaskCount,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: "doneTaskCount",
          required: true,
          label: this.$t("text.doneTaskCount"),
          align: "center",
          field: row => row.doneTaskCount,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: "rejectedTaskCount",
          required: true,
          label: this.$t("text.rejectedTaskCount"),
          align: "center",
          field: row => row.rejectedTaskCount,
          format: val => `${val}`,
          sortable: false
        }
      ]
    };
  },
  methods: {
    loadExecutors: function() {
      this.loading = true;
      axios
        .get("http://localhost:8080/ratings/executors/get", {
          params: this.pagination
        })
        .then(response => {
          this.data = response.data.result;
          this.pagination.rowsNumber = response.data.total;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    request: function(reuqestProp) {
      this.pagination = reuqestProp.pagination;
      this.loadExecutors();
    }
  },
  mounted() {
    this.loadExecutors();
  }
};
</script>
