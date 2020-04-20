/*
export function someMutation (state) {
}
*/
export function setMessages (state, data) {
    state.dialogues = data.result;
    state.pagination.total = data.total;
}

export function setDialogues(state, dialogues) {
    state.dialogues = dialogues.result;
    state.total = dialogues.total;
}