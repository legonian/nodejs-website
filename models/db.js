const pool = require('./pool')
const db = {}

db.makeQuery = async function (query, queryParameters, cb) {
  try {
    const { rows } = await pool.query(query, queryParameters)
    const res = (Array.isArray(rows) && rows.length === 1) ? rows[0] : rows

    if (typeof cb === 'function') {
      return await cb(res)
    } else {
      return false
    }
  } catch (err) {
    return false
  }
}

module.exports = db
