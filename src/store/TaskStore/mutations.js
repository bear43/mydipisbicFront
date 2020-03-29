/*
export function someMutation (state) {
}
*/
import axios from 'axios';


function findIndexInStateSrc(stateSrc, data) {
    return stateSrc.indexOf(data);
}

function findElementInState(state, data) {
    return {
        stateSrc: state[data.stateSrc],
        element: data.data,
        index: findIndexInStateSrc(state[data.stateSrc], data.data)
    }
}

export function add(state, newTask) {
    if (newTask.id == null) {
        newTask.originalValue = [];
        newTask.originalValue['id'] = null;
        newTask.id = -state.tasks.length;
    }
    state.tasks.push(newTask);
}

export function change(state, changeData) {
    const stateSrc = state[changeData.stateSrc];
    const index = findIndexInStateSrc(stateSrc, changeData);
}

/* Common functions */

export function setChangedState(state, stateData) {
    stateData.object.changed = stateData.changed;
}

export function save(state, saveData) {
    updateElementId(state, saveData);
    setChangedState(state, {
        object: saveData.object,
        changed: false
    })
}

export function updateElementId(state, updateData) {
    updateData.object.id = updateData.newId;
}

export function remove(state, removeData) {
    const element = findElementInState(state, removeData);
    if(element.index !== -1) {
        element.stateSrc.splice(element.index, 1);
    }
}

/* Task types */

export function setTaskTypes(state, types) {
    state.taskTypes = [];
    types.forEach(taskType => {
        addTaskType(state, taskType);
    });
}

export function addTaskType(state, taskType) {
    if(taskType.changed === undefined) {
        taskType.changed = false;
    }
    if (taskType.id == null) {
        taskType.id = state.getNewId('taskTypes');
        taskType.title = 'Новый тип задачи №' + -taskType.id;
    }
    state.taskTypes.push(taskType);
}