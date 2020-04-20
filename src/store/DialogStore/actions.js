/*
export function someAction (context) {
}
*/
import axios from 'axios'

export function loadDialogues(context) {
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

export async function createDialog(context, title) {
    return axios.post('http://localhost:8080/dialogues/create', {
        title: title
    }).then(resp => {
        context.commit('setDialogues', resp.data);
    });
}