export default {
    tasks: [],
    taskPriorities: [],
    taskTypes: [],
    executors: [],
    statuses: [],
    executorsTasks: [],
    customers: [],
    page: {
        total: 0
    },
    newId: -1,
    getNewId: function(stateSrc) {
        while(this[stateSrc].filter(obj => obj.id === this.newId).length !== 0) {
            this.newId--;
        }
        return this.newId;
    }
}