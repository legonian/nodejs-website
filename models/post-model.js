const User = require('./user-model')
const pool = require('./pool')
const showdown = require('showdown')
const converter = new showdown.Converter()

const Post = {
  async create (obj) {
    try {
      const query = 'SELECT * FROM add_post($1, $2, $3, $4)'
      const queryParameters = [
        obj.user.user_id,
        obj.title,
        obj.meta_title,
        obj.content]
      const { rows } = await pool.query(query, queryParameters)
      const res = rows[0]
      return res
    } catch (error) {
      console.log('Error on creating post:', error)
      console.log('Input:', [obj])
      return false
    }
  },
  async get (param, val) {
    try {
      if (['post_id'].includes(param)) {
        const query = `SELECT * FROM posts JOIN users USING(user_id) WHERE ${param} = $1`
        const { rows } = await pool.query(query, [val])
        const res = rows[0]
        res.content = converter.makeHtml(res.content)
        return res
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on getting post:', error)
      console.log('Input:', [param, val])
      return false
    }
  },
  async getAll (param, val) {
    try {
      if (['user_id', 'title', 'rating'].includes(param)) {
        const query = `SELECT * FROM posts JOIN users USING(user_id) WHERE ${param} = $1`
        const { rows } = await pool.query(query, [val])
        const res = rows
        return res
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on getting posts:', error)
      console.log('Input:', [param, val])
      return false
    }
  },
  async change (obj, param, val) {
    try {
      const validUser = await User.authenticate(obj.user)
      const paramToChange = ['title', 'content']
      if (validUser && paramToChange.includes(param)) {
        const query = `
        UPDATE posts SET ${param} = $1
        WHERE post_id = $2
        RETURNING *`
        const queryParameters = [val, obj.post_id]
        const { rows } = await pool.query(query, queryParameters)
        const res = rows[0]
        return res
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on changing post:', error)
      console.log('Input:', [obj, param, val])
      return false
    }
  },
  async delete (obj) {
    try {
      const validUser = await User.authenticate(obj.user)
      if (validUser) {
        const query = 'DELETE FROM posts WHERE user_id = $1 AND post_id = $2 RETURNING *'
        const queryParameters = [validUser.user_id, obj.post_id]
        const { rows } = await pool.query(query, queryParameters)
        const res = rows[0]
        return res
      } else {
        return false
      }
    } catch (error) {
      console.log('Error on deleting post:', error)
      console.log('Input:', [obj])
      return false
    }
  }
}

module.exports = Post
