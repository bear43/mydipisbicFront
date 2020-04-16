import Cookies from './cookie'

export default {
  name: 'Roles',
  Role: {
    ADMIN: 'ROLE_ADMIN',
    CONSUMER: 'ROLE_CONSUMER',
    SUPPLIER: 'ROLE_SUPPLIER'
  },
  AUTH_TOKEN_NAME: 'auth',
  getUser: function () {
    const AUTH_TOKEN = Cookies.getCookie(this.AUTH_TOKEN_NAME)
    if (AUTH_TOKEN) {
      const jwt = AUTH_TOKEN.split('.')
      if (jwt.length === 3) {
        const buffer = Buffer.from(jwt[1], 'base64')
        const str = buffer.toString('ascii')
        return JSON.parse(str)
      }
    }
  },
  getUserId: function () {
    return this.getUser().id
  },
  getUserRoles: function () {
    const user = this.getUser()
    if (user) {
      return user.roles
    }
  },
  hasAnyRole: function (...roles) {
    const userRoles = this.getUserRoles()
    for (const index in roles) {
      let ok = false
      for (const jindex in userRoles) {
        if (userRoles[jindex] === roles[index]) {
          ok = true
        }
      }
      if (!ok) {
        return false
      }
    }
    return true
  },
  logout: function () {
    Cookies.deleteCookie(this.AUTH_TOKEN_NAME)
  },
  getUserFullName: function(user) {
    return user.lastName + ' ' + user.firstName + ' ' + user.secondName;
  }
}
