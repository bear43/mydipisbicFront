import Vue from 'vue'
import axios from 'axios'
import Roles from '../utils/roles'
import Cookies from '../utils/cookie'

function errorResponseHandler (_error, router) {
  const isReponseData = _error && _error.response && _error.response.data
  Vue.prototype.$q.notify({
    color: 'red-4',
    textColor: 'white',
    icon: 'error',
    message: isReponseData && _error.response.data.message ? _error.response.data.message : _error.message
  })
  if (isReponseData && _error.response.data.logout) {
    Roles.logout()
    router.push('/login')
  }
  return Promise.reject(error);
}

export default ({ router }) => {
  axios.interceptors.response.use(
    response => response,
    _error => {
      errorResponseHandler(_error, router)
    }
  )

  axios.interceptors.request.use(
    config => {
      const authHeader = Cookies.getCookie(Roles.AUTH_TOKEN_NAME);
      if(authHeader) {
        config.headers.Auth = authHeader
      }
      return config;
    }
  );

  Vue.prototype.$axios = axios
}
