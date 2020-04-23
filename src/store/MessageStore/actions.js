/*
export function someAction (context) {
}
*/
import axios from 'axios'

export function loadMessages(context, dialogId) {
    axios.get('http://localhost:8080/messages/get', {
        params: {
            dialogId: dialogId,
            ...context.state.pagination
        }
    })
        .then(response => {
            context.commit('setMessages', response.data);
        });
}

export async function createMessage(context, object) {
    return axios.post('http://localhost:8080/messages/create', object)
        .then(resp => {
            //context.commit('setDialogues', resp.data);
        });
}

export function evaluatePage(context) {
    context.commit('evaluatePage');
}

export async function getTotal(context, dialogId) {
    return axios.get('http://localhost:8080/messages/total', {
        params: {
            id: dialogId
        }
    }).then(response => {
        context.commit('setTotal', response.data.result);
    });
}

export function resetMessages(context) {
    context.commit('resetMessages');
}

export function addMessage(context, message) {
    context.commit('addMessage', message);
}