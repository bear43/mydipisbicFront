import { findElementInState } from "./mutations";

/*
export function someGetter (state) {
}
*/
export function hasNewTasks(state) {
    return state.tasks.filter(task => task.id == null).length > 0;
}

function privateHasChanges(object) {
    let originalValueArray = object.originalValue;
        if (originalValueArray) {
            for (let propertyName in originalValueArray) {
                if (object[propertyName] !== originalValueArray[propertyName]) {
                    return true;
                }
            }
        }
        return false;
}

export function hasChanges(state) {
    return changeData => {
        const object = findElementInState(state, changeData);
        return privateHasChanges(object.element);
    }
}

export function getTypeById(state) {
    return typeId => state.taskTypes.filter(type => type.id === typeId)[0];
}

export function getPriorityByKey(state) {
    return priorityKey => state.taskPriorities.filter(priority => priority.key === priorityKey)[0];
}