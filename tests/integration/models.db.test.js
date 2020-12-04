const User = require('../../models/user-model')
// const Post = require('../../models/post-model')
// const Message = require('../../models/message-model')

test('single user', async () => {
  const user = {
    username: 'testusermodel',
    password: 'qweQWE123',
    first_name: 'Name1',
    lastName: 'Name2',
    email: 'testusermodel@example.com',
    country: 'Uganda',
    param: 'email',
    value: 'newtestusermodel@example.com'
  }
  await User.create(user)
  await User.authenticate(user)
  await User.get('email', user.username)
  await User.change(user)
  await User.get('email', user.username)
  await User.delete(user)
})

test('all user list', async () => {
  const userList = await User.getAllUsers()
  expect(userList).toBeInstanceOf(Array)
})
