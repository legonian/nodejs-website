const bcrypt = require('bcrypt')
const userDB = []

const User = {
  authenticate (obj) {
    try {
      if (typeof obj.username !== 'undefined') {
        const rows = userDB.filter(u => u.username === obj.username)
        const res = Object.assign({}, rows[0])
        if (res && bcrypt.compareSync(obj.password, res.hash)) {
          delete res.hash
          return res
        } else {
          return false
        }
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on authentication:', error)
      return false
    }
  },
  create (obj) {
    try {
      const hash = bcrypt.hashSync(obj.password, 12)
      const newUser = {
        username: obj.username,
        hash,
        email: obj.email,
        first_name: obj.first_name,
        country: obj.country,
        last_name: obj.last_name
      }
      userDB.push(newUser)
      const newUserCopy = Object.assign({}, newUser)
      delete newUserCopy.hash
      return newUserCopy
    } catch (error) {
      console.log('Error on creation:', error)
      return false
    }
  },
  get (param, val) {
    try {
      if (['username', 'user_id', 'email'].includes(param)) {
        const rows = userDB.filter(u => u[param] === val)
        if (rows.length === 0) {
          return false
        }
        const res = Object.assign({}, rows[0])
        delete res.hash
        return res
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on getting:', error)
      return false
    }
  },
  change (obj) {
    try {
      const pastUserData = User.authenticate(obj)
      const paramToChange = [
        'username',
        'password',
        'email',
        'first_name',
        'last_name',
        'avatar',
        'user_info',
        'country'
      ]
      if (pastUserData && paramToChange.includes(obj.param)) {
        userDB.find(u => u.username === obj.username)[obj.param] = obj.value
        const rows = userDB.filter(u => u.username === obj.username)
        const res = Object.assign({}, rows[0])
        delete res.hash
        return res
      } else if (pastUserData && obj.param === 'password') {
        const hash = bcrypt.hashSync(obj.value, 12)
        userDB.find(u => u.username === obj.username).hash = hash
        const rows = userDB.filter(u => u.username === obj.username)
        const res = Object.assign({}, rows[0])
        delete res.hash
        return res
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on changing:', error)
      return false
    }
  },
  delete (obj) {
    try {
      const pastUserData = User.authenticate(obj)
      if (pastUserData) {
        const rows = userDB.splice(userDB.findIndex(e => e.username === obj.username), 1)
        const deletedUsername = rows[0].username
        return deletedUsername
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on deleting:', error)
      return false
    }
  },
  getAllUsers () {
    return userDB
  }
}

module.exports = User
