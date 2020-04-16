/*
export function someAction (context) {
}
*/

export function loadDialogues(context, pagination) {
    axios.get('http://localhost:8080/dialogues/get', {
        params: {
            user: context.rootState.UserStore.user.id,
            ...pagination
        }
    })
    .then(response => {
        context.commit('setDialogues', response.data);
    });
}