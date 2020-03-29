import axios from 'axios'

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