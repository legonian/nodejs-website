const pool = require('./pool')
const bcrypt = require('bcrypt')

class DB {
  static check_user_onsignup(obj){
    if ( obj.name && obj.pass && obj.first_name ){
      if ( typeof obj.name === 'string' && 
           typeof obj.pass === 'string' && 
           typeof obj.first_name === 'string' ){
        if ( obj.name.length < 21 && 
             obj.pass.length < 61  && 
             obj.first_name.length < 31 ){
          return true
        }
      }
    }
    return false
  }

  static check_user_onlogin(obj){
    if ( obj.name && obj.pass){
      if ( typeof obj.name === 'string' && typeof obj.pass === 'string' ){
        if ( obj.name.length < 21 && obj.pass.length < 61 ){
          return true
        }
      }
    }
    return false
  }

  static async get_user(obj){
    if(DB.check_user_onlogin(obj)){
      const client = await pool.connect()
      try {
        const hash_res = await client.query(`SELECT hash FROM users WHERE nickname = '${obj.name}'`)
        const hash = hash_res.rows[0].hash
        //console.log('hash = ', hash)
        const match = await bcrypt.compare(obj.pass, hash)
        if(match){
          const query = `SELECT * FROM users WHERE nickname = '${obj.name}'`
          const res = await client.query(query)
          return res.rows[0]
        }else{
          console.log('invalid pass')
          return false
        }
      } finally {
        client.release()
      }
    }
  }

  static async set_user(obj){
    if(DB.check_user_onsignup(obj)){
      const client = await pool.connect()
      try {
        const res = await client.query(`SELECT * FROM users WHERE nickname = '${obj.name}'`)
        if(res.rows[0]){
          console.log('User exist')
          return false
        }else{
          const hash = await bcrypt.hash(obj.pass, 12)
          const query = `INSERT INTO users(nickname, hash, first_name, create_date, posts_count)
                         VALUES ('${obj.name}','${hash}', '${obj.first_name}', '${obj.create_date}', 0)`
          
          //console.log('query on set_user =', query)
          
          await client.query(query)
          const res = await client.query(`SELECT * FROM users WHERE nickname = '${obj.name}'`)
          
          //console.log('res =', res)
          return res.rows[0]
        }
      } finally {
        client.release()
      }
    }
  }
}

module.exports = DB