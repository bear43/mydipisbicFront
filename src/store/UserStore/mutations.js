/*
export function someMutation (state) {
}
*/

export function setUser (state, user) {
  state.user = Object.assign({}, user);
  resetEditableUserByUser(state);
  // state.user.set(user);
}

export function clear (state) {
  state.user = {}
}

export function setEditableUser(state, newUser) {
  state.editableUser = newUser;
}

export function setEditableProperty(state, data) {
  state.editableUser[data.property] = data.value;
}

export function resetEditableUserByUser(state) {
  state.editableUser = Object.assign({}, state.user);
}
