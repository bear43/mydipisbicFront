/*
export function someAction (context) {
}
*/

import axios from 'axios'
import Roles from '../../utils/roles'

export function loadUser (context) {
  if(Roles.getUser()) {
  axios.post('http://localhost:8080/users/getCurrentUser')
    .then(function (resp) {
      context.commit('setUser', resp.data)
    })
  }
}

export function updateUser(context, data) {
  context.commit('setEditableProperty', data);
}

export function resetUser(context) {
  context.commit('resetEditableUserByUser');
}
