import axios from 'axios'
import Roles from '../../utils/roles'


/* TASK TYPES */

export function loadTaskTypes(context) {
    axios
        .get('http://localhost:8080/tasks/types/get')
        .then(response => {
            context.commit('setTaskTypes', response.data);
        });
}

export function removeTaskType(context, taskType) {
    if(taskType.id < 0) {
        context.commit('remove', {
            stateSrc: 'taskTypes', 
            data: taskType
        });
    } else {
    axios
        .post('http://localhost:8080/tasks/types/remove', { id: taskType.id })
        .then(response => {
            context.commit('remove', {
                stateSrc: 'taskTypes', 
                data: taskType
            });
        });
    }
}

export function saveTaskType(context, taskType) {
    axios
        .post('http://localhost:8080/tasks/types/save', taskType)
        .then(response => {
            context.commit('save', {
                object: taskType,
                newId: response.data
            });
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

export function loadTasks(context) {
    axios.get('http://localhost:8080/tasks/get')
         .then(response => {
             context.commit('setTasks', response.data);
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
    if(task.id < 0) {
        context.commit('remove', {
            stateSrc: 'tasks', 
            data: task
        });
    } else {
    axios
        .post('http://localhost:8080/tasks/remove', { id: task.id })
        .then(response => {
            context.commit('remove', {
                stateSrc: 'tasks', 
                data: task
            });
        });
    }
}

export function saveTask(context, task) {
    axios
        .post('http://localhost:8080/tasks/save', task)
        .then(response => {
            context.commit('save', {
                object: task,
                newId: response.data
            });
        });
}

/* PRIORITIES */
export function loadPriorities(context) {
    axios.get('http://localhost:8080/tasks/priorities/get')
         .then(response => {
             context.commit('setPriorities', response.data);
         });
}

/* COMMON */

export function change(context, changeData) {
    context.commit('change', changeData);
}

export function reset(context, resetData) {
    context.commit('reset', resetData);
}