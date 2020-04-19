/*
export function someAction (context) {
}
*/

import axios from 'axios'
import Roles from '../../utils/roles'

export function loadUser(context) {
  if (Roles.getUser()) {
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

export function setPagination(context, pagination) {
  context.commit('setPagination', pagination);
}

export function setFilter(context, filter) {
  context.commit('setFilter', filter);
}

export async function loadUsers(context) {
  if (Roles.hasAnyRole(Roles.Role.ADMIN)) {
    const params = {
      start: (context.state.users.pagination.page - 1) * context.state.users.pagination.rowsPerPage,
      limit: context.state.users.pagination.rowsPerPage,
      ...context.state.users.pagination,
      ...context.state.users.filter
    };
    return axios.get('http://localhost:8080/users/search', {
      params: params
    })
      .then(function (resp) {
        context.commit('setUsers', resp.data)
      })
  }
}

export function saveUser(context, user) {
  if (Roles.hasAnyRole(Roles.Role.ADMIN)) {
    axios.post('http://localhost:8080/users/save', user)
      .then(function (resp) {
        loadUsers(context);
      })
  }
}

export function loadRoles(context) {
  if (Roles.hasAnyRole(Roles.Role.ADMIN)) {
    axios.get('http://localhost:8080/users/get-roles')
      .then(function (resp) {
        context.commit('setRoles', resp.data);
      })
  }
}

export async function remove(context, user) {
  if (Roles.hasAnyRole(Roles.Role.ADMIN)) {
    if (user && user.id) {
      return axios.post('http://localhost:8080/users/remove', {
        id: user.id
      })
        .then(function (resp) {
          loadUsers(context);
        })
    }
  }
}

export async function restore(context, user) {
  if (Roles.hasAnyRole(Roles.Role.ADMIN)) {
    if (user && user.id) {
      return axios.post('http://localhost:8080/users/restore', {
        id: user.id
      })
        .then(function (resp) {
          loadUsers(context);
        })
    }
  }
}