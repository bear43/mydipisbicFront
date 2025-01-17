/*
export function someMutation (state) {
}
*/
export function setDialogues(state, dialogues) {
    const dials = dialogues.result;
    for (let index in dials) {
        const obj = state.dialogues.filter(dialog => dialog.id === dials[index].id);
        if (obj.length === 0) {
            state.dialogues.push(dials[index]);
        }
    }
    state.total = dialogues.total;
}

export function evaluatePage(state) {
    const pagesFromCurrentToLast = (state.total - state.dialogues.length) / state.pagination.limit;
    if (pagesFromCurrentToLast > 0) {
        if(state.pagination.page < Math.trunc((Number)(state.total) / (Number)(state.pagination.limit))) {
            state.pagination.page++;
        };
    } else {
        state.dialogues = [];
        state.total = 0;
        state.pagination.page = 0;
    }
}

export function setTotal(state, total) {
    if (total) {
        state.total = total;
    }
}

export function addDialog(state, dialog) {
    const obj = state.dialogues.filter(dial => dial.id === dialog.id);
    if (obj.length === 0) {
        state.dialogues.push(dialog);
    }
}

export function removeDialog(state, id) {
    const obj = state.dialogues.filter(dial => dial.id === id);
    if(obj.length > 0) {
        state.dialogues.splice(state.dialogues.indexOf(obj), 1);
    } 
}