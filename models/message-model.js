const pool = require('./pool')

const Message = {
  async create(obj) {
    try {
      const query = `
      INSERT INTO messages(sent_from, sent_to, content)
      VALUES($1, $2, $3)
      RETURNING *`
      const queryParameters = [
        obj.sent_from,
        obj.sent_to,
        obj.content
      ]
      const { rows } = await pool.query(query, queryParameters)
      const res = rows[0]
      return res
    } catch (error) {
      console.log('Error on creation messase:', error)
      console.log('Input:', [obj])
      return false
    }
  },
  async getChat(user_id) {
    try {
      const query = `SELECT * FROM get_chat($1)`
      const queryParameters = [user_id]
      const { rows } = await pool.query(query, queryParameters)
      return rows
    } catch (error) {
      console.log('Error on getting chat:', error)
      console.log('Input:', [user_id])
      return false
    }
  }
}

module.exports = Message
