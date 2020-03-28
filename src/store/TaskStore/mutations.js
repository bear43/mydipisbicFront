/*
export function someMutation (state) {
}
*/
import axios from 'axios';

export function add(state, newTask) {
    if(newTask.id == null) {
        newTask.originalValue = [];
        newTask.originalValue['id'] = null;
        newTask.id = -state.tasks.length;
    }
    state.tasks.push(newTask);
}

export function change(state, changes) {
    const changingTask = state.tasks.filter(task => task.id === changes.taskId)[0];
    if(!changingTask.originalValue) {
        changingTask.originalValue = [];
    }
    if(!changingTask.originalValue[changes.propertyName]) {
        changingTask.originalValue[changes.propertyName] = changingTask[changes.propertyName];
    }
    changingTask[changes.propertyName] = changes.newValue === '' ? null : changes.newValue;
}

export function save(state, taskId) {
    axios.post(
        'http://localhost:8080/tasks/save',
        state.tasks.filter(t => t.id === taskId)[0]
    ).then(response => {

    }).catch(error => {
        reset(state, taskId);
    });
}

export function reset(state, taskId) {
    const task = state.tasks.filter(t => t.id === taskId)[0];
    if(task && task.originalValue) {
        for(let propertyName in task.originalValue) {
            task[propertyName] = task.originalValue[propertyName];
        }
    }
}