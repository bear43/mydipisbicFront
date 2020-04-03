/*
export function someMutation (state) {
}
*/
import axios from 'axios';


function findIndexInStateSrc(stateSrc, data) {
    return stateSrc.indexOf(data);
}

export function findElementInState(state, data) {
    return {
        stateSrc: state[data.stateSrc],
        element: data.data,
        index: findIndexInStateSrc(state[data.stateSrc], data.data)
    }
}

/* Common functions */

export function change(state, changeData) {
    const elementInfo = findElementInState(state, changeData);
    if (elementInfo.index !== -1) {
        if (!elementInfo.element.originalValue) {
            elementInfo.element.originalValue = {};
        }
        if (!elementInfo.element.originalValue[changeData.property]) {
            elementInfo.element.originalValue[changeData.property] = elementInfo.element[changeData.property];
        }
        elementInfo.element[changeData.property] = changeData.value;
    }
}

export function reset(state, resetData) {
    const elementInfo = findElementInState(state, resetData);
    if(elementInfo.index !== -1) {
        if(elementInfo.element.originalValue) {
            const originalValueArray = elementInfo.element.originalValue;
            const keys = Object.keys(originalValueArray);
            for(let index in keys) {
                const property = keys[index];
                elementInfo.element[property] = originalValueArray[property];
            }
        }
    }
}

export function setChangedState(state, stateData) {
    stateData.object.changed = stateData.changed;
    if (!stateData.changed) {
        stateData.object.originalValue = null;
    }
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
    if (element.index !== -1) {
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
    taskType.originalValue = null;
    if (taskType.id == null) {
        taskType.id = state.getNewId('taskTypes');
        taskType.title = 'Новый тип задачи №' + -taskType.id;
    }
    state.taskTypes.push(taskType);
}

/* Task */

export function setTasks(state, tasks) {
    state.tasks = [];
    tasks.forEach(task => {
        addTask(state, task);
    });
}

export function addTask(state, task) {
    task.originalValue = null;
    if (task.id == null) {
        task.id = state.getNewId('tasks');
        task.title = 'Новая задача №' + -task.id;
    }
    state.tasks.push(task);
}

/* TASK PRIORITIES */

export function setPriorities(state, priorities) {
    state.taskPriorities = priorities;
}