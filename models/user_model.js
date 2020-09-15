const DB = require('./db')
const bcrypt = require('bcrypt')

class User {
  constructor(obj) {
    this.name = obj.name
    this.pass = obj.pass
    this.first_name = obj.first_name
  }

  async auth(){
    const ans = await DB.get_user(this)
    return ans
  }

  async sign_up(){
    const now = new Date()
    this.create_date = now.toISOString().slice(0, 19).replace('T', ' ')
    const ans = await DB.set_user(this)
    return ans
  }
}

module.exports = User