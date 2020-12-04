const bcrypt = require('bcrypt')
const pool = require('./pool')

const User = {
  async authenticate (obj) {
    try {
      if (typeof obj.username !== 'undefined') {
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
      return false
    }
  },
  async create (obj) {
    try {
      const hash = await bcrypt.hash(obj.password, 12)
      const query = 'SELECT * FROM add_user($1, $2, $3, $4, $5, $6)'
      const queryParameters = [
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
      return false
    }
  },
  async get (param, val) {
    try {
      if (['username', 'user_id', 'email'].includes(param)) {
        const query = `SELECT * FROM users WHERE ${param} = $1`
        const queryParameters = [val]
        const { rows } = await pool.query(query, queryParameters)
        if (rows.length === 0) {
          return false
        }
        const res = rows[0]
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
  async change (obj) {
    try {
      const pastUserData = await User.authenticate(obj)
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
        const query = `
        UPDATE users SET ${obj.param} = $1
        WHERE username = $2
        RETURNING *`
        const queryParameters = [obj.value, obj.username]
        const { rows } = await pool.query(query, queryParameters)
        const res = rows[0]
        delete res.hash
        return res
      } else if (pastUserData && obj.param === 'password') {
        const hash = await bcrypt.hash(obj.value, 12)
        const query = `
        UPDATE users SET hash = $1
        WHERE username = $2
        RETURNING *`
        const queryParameters = [hash, obj.username]
        const { rows } = await pool.query(query, queryParameters)
        const res = rows[0]
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
  async delete (obj) {
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
      return false
    }
  },
  async getAllUsers () {
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
