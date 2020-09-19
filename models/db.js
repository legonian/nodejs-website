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

  static user = {
    async check(dbUser){
      const query = 'SELECT * FROM users WHERE username = $1'
      const vars_arr = [dbUser.username]
      return await DB.makeQuery(query, vars_arr, async dbRes =>{
        if( dbRes && dbRes.user_id === dbUser.user_id ){
          return dbRes
        } else {
          return false
        }
      })
    },

    async get(obj){
      const query = 'SELECT * FROM users WHERE username = $1'
      const vars_arr = [obj.username]
      return await DB.makeQuery(query, vars_arr, async dbRes =>{
        if( dbRes && await bcrypt.compare( obj.password, dbRes.hash ) ){
          return dbRes
        } else {
          return false
        }
      })
    },

    async set(obj){
      if ( await DB.user.get(obj) ) {
        return false 
      } else {
        const hash = await bcrypt.hash(obj.password, 12)
        const query = `INSERT INTO users(username,
                                         hash,
                                         first_name)
                       VALUES ($1, $2, $3)`
        const vars_arr = [obj.username, hash, obj.first_name]

        await DB.makeQuery(query, vars_arr)
        return await DB.user.get(obj)
      }
    },

    async changeParameter(obj, param, cb){
      const pastUserData = await DB.user.check(obj)
      //console.log('pastUserData', pastUserData)
      if(pastUserData){
        const query = `UPDATE users SET ${param} = $1 WHERE user_id = $2`
        const vars_arr = [cb(pastUserData[param]), obj.user_id]
        //console.log(vars_arr)
        await DB.makeQuery(query, vars_arr)
        return await DB.user.check(obj)
      } else { return false }
    }
  }

  static post = {
    async get(obj){
      const query = 'SELECT * FROM posts WHERE title = $1'
      return await DB.makeQuery(query, [obj.title], async dbRes =>{
        return dbRes
      })
    },
    async set(obj){
      if ( await DB.post.get(obj) ) {
        return false 
      } else {
        const query = `INSERT INTO posts(user_id,
                                         title,
                                         meta_title,
                                         content)
                       VALUES ($1, $2, $3, $4)`
        const vars_arr = [obj.user.user_id,
                          obj.title,
                          obj.meta_title,
                          obj.content]
        await DB.makeQuery(query, vars_arr)
        DB.user.changeParameter(obj.user, 'posts_count', (parameter)=> {
          return parameter + 1
        })
        return await DB.post.get(obj)
      }
    }
  }
}

module.exports = DB