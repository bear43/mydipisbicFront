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
        const keyExistInOriginalValue = Object.keys(elementInfo.element.originalValue).includes(changeData.property);
        if (!keyExistInOriginalValue) {
            elementInfo.element.originalValue[changeData.property] = elementInfo.element[changeData.property];
        }
        elementInfo.element[changeData.property] = changeData.value;
    }
}

export function resetProperty(state, resetData) {
    const element = resetData.data;
    const propertyName = resetData.property;
    if(element && element.originalValue && element.originalValue[propertyName] !== undefined) {
        element[propertyName] = element.originalValue[propertyName];
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

export function updateElementId(state, updateData) {
    updateData.object.id = updateData.newId;
}

export function save(state, saveData) {
    updateElementId(state, saveData);
    setChangedState(state, {
        object: saveData.object,
        changed: false
    })
}

export function saveEx(state, saveData) {
    saveData.object = Object.assign(saveData.object, saveData.newData);
    setChangedState(state, {
        object: saveData.object,
        changed: false
    })
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

export function setTasks(state, responseBody) {
    state.tasks = [];
    state.page.total = responseBody.total;
    responseBody.result.forEach(task => {
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

/* EXECUTOR */
export function setExecutors(state, executors) {
    state.executors = executors;
}

/* CUSTOMER */
export function setCustomers(state, customers) {
    state.customers = customers;
}

/* STATUS */
export function setStatuses(state, statuses) {
    state.statuses = statuses;
}

/* Executors Task */
export function setExecutorsTasks(state, executorTasks) {
    state.page.total = executorTasks.total;
    state.tasks = executorTasks.result;
}