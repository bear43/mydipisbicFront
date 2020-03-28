import { change } from "./mutations";

/*
export function someGetter (state) {
}
*/
export function hasNewTasks(state) {
    return state.tasks.filter(task => task.id == null).length > 0;
}

function privateHasChanges(object) {
    let changed = object.originalValue;
        if (changed) {
            for (let propertyName in object.originalValue) {
                if (object[propertyName] !== object.originalValue[propertyName]) {
                    return true;
                }
            }
        }
        return false;
}

export function hasChanges(state) {
    return taskId => {
        const task = state.tasks.filter(task => task.id === taskId)[0];
        return privateHasChanges(task);
    }
}

export function hasTypeChanges(state) {
    return typeId => {
        const type = state.taskTypes.filter(t => t.id === typeId)[0];
        return privateHasChanges(type);
    }
}

export function getTypeById(state) {
    return typeId => state.taskTypes.filter(type => type.id === typeId)[0];
}

export function getPriorityByKey(state) {
    return priorityKey => state.taskPriorities.filter(priority => priority.key === priorityKey)[0];
}