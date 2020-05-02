import axios from 'axios'
import Roles from '../../utils/roles'


/* TASK TYPES */

export function loadTaskTypes(context) {
    axios
        .get('http://localhost:8080/tasks/types/get')
        .then(response => {
            if (response) {
                context.commit('setTaskTypes', response.data);
            }
        });
}

export function removeTaskType(context, taskType) {
    if (taskType.id < 0) {
        context.commit('remove', {
            stateSrc: 'taskTypes',
            data: taskType
        });
    } else {
        axios
            .post('http://localhost:8080/tasks/types/remove', { id: taskType.id })
            .then(response => {
                if (response) {
                    context.commit('remove', {
                        stateSrc: 'taskTypes',
                        data: taskType
                    });
                }
            });
    }
}

export async function saveTaskType(context, taskType) {
    return axios
        .post('http://localhost:8080/tasks/types/save', taskType)
        .then(response => {
            if (response) {
                context.commit('save', {
                    object: taskType,
                    newId: response.data
                });
            }
        });
}

export function addNewTaskType(context) {
    context.commit('addTaskType', {
        id: null,
        title: '',
        changed: true
    });
}


/* TASK */

export function loadTasks(context, filter) {
    axios.get('http://localhost:8080/tasks/users/search', {
        params: filter
    })
        .then(response => {
            if (response) {
                context.commit('setTasks', response.data);
            }
        });
}

export function addNewTask(context) {
    context.commit('addTask', {
        id: null,
        title: '',
        priority: null,
        status: null,
        type: null,
        customer: context.rootState.UserStore.user,
        executor: null,
        startDate: null,
        doneDate: null,
        changed: true
    });
}

export function removeTask(context, task) {
    if (task.id < 0) {
        context.commit('remove', {
            stateSrc: 'tasks',
            data: task
        });
    } else {
        axios
            .post('http://localhost:8080/tasks/remove', { id: task.id })
            .then(response => {
                if (response) {
                    context.commit('remove', {
                        stateSrc: 'tasks',
                        data: task
                    });
                }
            });
    }
}

export function saveTask(context, task) {
    axios
        .post('http://localhost:8080/tasks/save', task)
        .then(response => {
            if (response) {
                context.commit('saveEx', {
                    object: task,
                    newData: response.data
                });
            }
        });
}

/* EXECUTOR TASK */
export async function loadExecutorsTasks(context, filter) {
    return axios
        .get('http://localhost:8080/tasks/executors/search', {
            params: filter
        })
        .then(
            response => {
                if (response) {
                    context.commit('setExecutorsTasks', response.data);
                }
            });
}

export async function rejectTask(context, task) {
    if(task) {
        return axios
        .post('http://localhost:8080/tasks/executors/reject', {
            id: task.id,
            rejectReason: task.rejectReason
        })
        .then(response => {
            context.commit('saveEx', {
                object: task,
                newData: response.data
            });
        })
        .catch(error => {
            context.commit('resetProperty', {
                data: task,
                property: 'rejectReason'
            });
        });
    }
}

export async function doneTask(context, task) {
    if(task) {
        return axios
        .post('http://localhost:8080/tasks/executors/done', {
            id: task.id,
            doneMsg: task.doneMsg
        })
        .then(response => {
            context.commit('saveEx', {
                object: task,
                newData: response.data
            });
        })
        .catch(error => {
            context.commit('resetProperty', {
                data: task,
                property: 'doneMsg'
            });
        });
    }
}

export async function takeTask(context, task) {
    if(task) {
        return axios
        .post('http://localhost:8080/tasks/executors/take', {
            id: task.id
        })
        .then(response => {
            context.commit('saveEx', {
                object: task,
                newData: response.data
            });
        });
    }
}

/* PRIORITIES */
export function loadPriorities(context) {
    axios.get('http://localhost:8080/tasks/priorities/get')
        .then(response => {
            if (response) {
                context.commit('setPriorities', response.data);
            }
        });
}

/* EXECUTORS */
export async function loadExecutors(context, executorString) {
    return axios.get('http://localhost:8080/users/executors/search', {
        params: {
            fullName: executorString
        }
    })
        .then(response => {
            if (response) {
                context.commit('setExecutors', response.data);
            }
        });
}

export function resetExecutors(context) {
    context.commit('setExecutors', []);
}

/* CUSTOMERS */
export async function loadCustomers(context, customerString) {
    return axios.get('http://localhost:8080/users/customers/search', {
        params: {
            fullName: customerString
        }
    })
        .then(response => {
            if (response) {
                context.commit('setCustomers', response.data);
            }
        });
}

export function resetCustomers(context) {
    context.commit('setExecutors', []);
}


/* STATUS */
export function loadStatuses(context) {
    axios.get('http://localhost:8080/tasks/statuses/get')
        .then(response => {
            if (response) {
                context.commit('setStatuses', response.data);
            }
        });
}

/* COMMON */

export function change(context, changeData) {
    context.commit('change', changeData);
}

export function reset(context, resetData) {
    context.commit('reset', resetData);
}

/* RATING */
export function setRate(context, data) {
    context.commit('setRate', data);
}