/*
export function someMutation (state) {
}
*/
export function setDialogues(state, dialogues) {
    const dials = dialogues.result;
    for (let index in dials) {
        const obj = state.dialogues.filter(dialog => dialog.id === dials[index].id);
        if(obj.length === 0) {
            state.dialogues.push(dials[index]);
        }
    }
    state.total = dialogues.total;
}

export function evaluatePage(state) {
    const pagesFromCurrentToLast = (state.total - state.dialogues.length) / state.pagination.limit;
    if(pagesFromCurrentToLast > 0) {
        state.pagination.page++;
    } else {
        state.dialogues = [];
        state.total = 0;
        state.pagination.page = 0;
    }
}

export function setTotal(state, total) {
    if(total) {
        state.total = total;
    }
}