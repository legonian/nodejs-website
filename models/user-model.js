const bcrypt = require('bcrypt')
const pool = require('./pool')

const User = {
  async authenticate(obj) {
    try {
      if (typeof obj['username'] !== 'undefined') {
        const query = 'SELECT * FROM users WHERE username = $1'
        const queryParameters = [obj.username]
        const { rows } = await pool.query(query, queryParameters)
        const res = rows[0]
        if (res && await bcrypt.compare(obj.password, res.hash)) {
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
      console.log('Input:', [obj])
      return false
    }
    
  },
  async create(obj) {
    try {
      const hash = await bcrypt.hash(obj.password, 12)
      let query, queryParameters
      query = `SELECT * FROM add_user($1, $2, $3, $4, $5, $6)`
      queryParameters = [
        obj.username,
        hash,
        obj.email,
        obj.first_name,
        obj.country,
        obj.last_name]
      const { rows } = await pool.query(query, queryParameters)
      const res = rows[0]
      delete res.hash
      return res
    } catch (error) {
      console.log('Error on creation:', error)
      console.log('Input:', [obj])
      return false
    }
  },
  async get(param, val) {
    try {
      if (['username', 'user_id', 'email'].includes(param) ){
        const query = `SELECT * FROM users WHERE ${param} = $1`
        const queryParameters = [val]
        const { rows } = await pool.query(query, queryParameters)
        const res = rows[0]
        delete res.hash
        return res
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on getting:', error)
      console.log('Input:', [param, val])
      return false
    }
  },
  async change(obj, param, val) {
    try {
      const pastUserData = await User.authenticate(obj)
      const paramToChange = [
        'username',
        'email',
        'first_name',
        'last_name',
        'avatar',
        'user_info',
        'country'
      ]
      if (pastUserData && paramToChange.includes(param)) {
        const query = `
        UPDATE users SET ${param} = $1
        WHERE username = $2
        RETURNING *`
        const queryParameters = [val, obj.username]
        const { rows } = await pool.query(query, queryParameters)
        const res = rows[0]
        delete res.hash
        return res
      } else if (pastUserData && param === 'password'){
        const hash = await bcrypt.hash(val, 12)
        const query = `
        UPDATE users SET hash = $1
        WHERE username = $2
        RETURNING *`
        const queryParameters = [hash, obj.username]
        const { rows } = await pool.query(query, queryParameters)
        const res = rows[0]
        delete res.hash
        return res
      }else {
        return false
      }
    } catch (error) {
      console.log('Error on changing:', error)
      console.log('Input:', [obj, param, val])
      return false
    }
  },
  async delete(obj) {
    try {
      const pastUserData = await User.authenticate(obj)
      if (pastUserData) {
        const query = 'DELETE FROM users WHERE username = $1 RETURNING username'
        const queryParameters = [obj.username]
        const { rows } = await pool.query(query, queryParameters)
        const deletedUsername = rows[0].username
        return deletedUsername
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on deleting:', error)
      console.log('Input:', [obj])
      return false
    }
  },
  async getAllUsers() {
    try {
      const query = 'SELECT * FROM users'
      const { rows } = await pool.query(query, [])
      return rows
    } catch (error) {
      console.log('Error on getting all users:', error)
      return false
    }
  }
}

module.exports = User
