/*
export function someAction (context) {
}
*/
import axios from 'axios'

function checkFunction(context) {
    if (!context.rootState.UserStore.user.id) {
        setTimeout(() => {
            checkFunction(context);
        }, 100);
    } else {
        axios.get('http://localhost:8080/dialogues/get', {
            params: {
                user: context.rootState.UserStore.user.id,
                ...context.state.pagination
            }
        })
            .then(response => {
                context.commit('setDialogues', response.data);
            });
    }
}

export function loadDialogues(context) {
    checkFunction(context);
}

export async function createDialog(context, object) {
    return axios.post('http://localhost:8080/dialogues/create', {
        title: object.title,
        recipients: object.recipients.map(user => user.id)
    }).then(resp => {
        //context.commit('setDialogues', resp.data);
    });
}

export function evaluatePage(context) {
    context.commit('evaluatePage');
}

export async function getTotal(context) {
    return axios.get('http://localhost:8080/dialogues/total', {
        params: {
            id: context.rootState.UserStore.user.id
        }
    }).then(response => {
        context.commit('setTotal', response.data.result);
    });
}

export function addDialog(context, dialog) {
    context.commit('addDialog', dialog);
}