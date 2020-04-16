/*
export function someMutation (state) {
}
*/
export function setMessages (state, data) {
    state.dialogues = data.result;
    state.pagination.total = data.total;
}