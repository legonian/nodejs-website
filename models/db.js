const pool = require('./pool')
const bcrypt = require('bcrypt')

class DB {
  static async getUser(obj){
    try {
      const query = 'SELECT * FROM users WHERE nickname = $1'
      const { rows } = await pool.query(query, [obj.name])
      const temp_user = rows[0]
      if ( !temp_user ) { return false }
      const hash = temp_user.hash
      const match = await bcrypt.compare(obj.pass, hash)
      if(match){
        return temp_user
      }else{
        //console.log('invalid pass')
        return false
      }
    } catch (err) {
      console.log('invalid query: ', err)
      return false
    }
  }

  static async setUser(obj){
    try {
      if(await DB.getUser(obj)){
        console.log('User exist')
        return false
      }else{
        const hash = await bcrypt.hash(obj.pass, 12)
        const query = `INSERT INTO users(nickname, hash, first_name, create_date, posts_count)
                       VALUES ($1, $2, $3, $4, 0)`
        await pool.query(query, [obj.name, hash, obj.first_name, obj.create_date])
        return await DB.getUser(obj)
      }
    } catch (err) {
      console.log('invalid query: ', err)
      return false
    }
  }
}

module.exports = DB