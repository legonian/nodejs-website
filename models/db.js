const pool = require('./pool')
const bcrypt = require('bcrypt')

class DB {
  static async makeQuery(query, vars_arr, check_fn){
    try {
      const { rows } = await pool.query(query, vars_arr)
      const res = rows[0]
      if ( typeof check_fn === 'function' ) return await check_fn(res)
      else return false
    } catch (err) {
      return false
    }
  }

  static async getUser(obj){
    const query = 'SELECT * FROM users WHERE username = $1'
    const vars_arr = [obj.username]
    return await DB.makeQuery(query, vars_arr, async res =>{
      if( res && await bcrypt.compare( obj.password, res.hash ) ){
        return res
      } else {
        return false
      }
    })
  }

  static async setUser(obj){
    if(await DB.getUser(obj)){
      return false 
    }else{
      const hash = await bcrypt.hash(obj.password, 12)
      const query = `INSERT INTO users(username,
                                       hash,
                                       first_name,
                                       create_date,
                                       posts_count)
                     VALUES ($1, $2, $3, $4, 0)`
      await DB.makeQuery(query, [obj.username,
                                 hash,
                                 obj.first_name,
                                 obj.create_date])
      return await DB.getUser(obj)
    }
  }

  static async changeUserParameter(obj, param){
    if(await DB.getUser(obj)){
      const query = 'UPDATE users SET $1 = $2 WHERE username = $3'
      await DB.makeQuery(query, [param, obj[param]])
    }
  }

  static async getPost(obj){
    const query = 'SELECT * FROM posts WHERE post_id = $1'
  }

  static async setPost(obj){
    const query = `INSERT INTO posts(user_id,
                                    title,
                                    meta_title,
                                    create_date,
                                    update_date,
                                    content)
                   VALUES ($1, $2, $3, $4, $5, $6)`
  }
}

module.exports = DB