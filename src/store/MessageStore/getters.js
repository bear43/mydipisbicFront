/*
export function someGetter (state) {
}
*/
export function hasMessages (state) {
    return state.total > state.messages.length;
}