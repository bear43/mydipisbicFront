/*
export function someMutation (state) {
}
*/
export function setMessages(state, messages) {
    let msgs = messages.result;
    for (let index in msgs) {
        const obj = state.messages.filter(msg => msg.id === msgs[index].id);
        if(obj.length === 0) {
            state.messages.push(msgs[index]);
        }
    }

    state.total = messages.total;
}

export function evaluatePage(state) {
    const pagesFromCurrentToLast = (state.total - state.messages.length) / state.pagination.limit;
    if(pagesFromCurrentToLast > 0) {
        if(state.pagination.page < Math.trunc((Number)(state.total) / (Number)(state.pagination.limit))) {
            state.pagination.page++;
        };
    } else {
        resetMessages(state);
    }
}

export function setTotal(state, total) {
    if(total) {
        state.total = total;
    }
}

export function resetMessages(state) {
    state.messages = [];
    state.total = 0;
    state.pagination.page = 0;
}

export function addMessage(state, message) {
    const obj = state.messages.filter(msg => msg.id === message.id);
    if (obj.length === 0) {
        state.messages.splice(0, 0, message);
    }
}