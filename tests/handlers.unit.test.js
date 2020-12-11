
jest.mock('../models/user-model.js')
jest.mock('../models/post-model.js')
jest.mock('../models/message-model.js')

// const User = require('../models/user-model')
// const Post = require('../models/post-model')
// const Message = require('../models/message-model')

const { root, newPost, signup, userList, settings, logOut } = require('../handlers/root-handler')

test('home page', () => {
  const req = {}
  const res = { render: jest.fn() }

  root(req, res)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0].length).toBe(1)
  expect(res.render.mock.calls[0][0]).toBe('index')
})

test('new post page', () => {
  const req = {}
  const res = { render: jest.fn() }

  newPost(req, res)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0].length).toBe(2)
  expect(res.render.mock.calls[0][0]).toBe('post/edit-post')
})

test('signup page', () => {
  const query = { username: 'some username' }
  const session = { user: 'some userObj' }

  const reqLoggedUser = { session, query }
  const reqNewUser = { session: {}, query }
  const res = { render: jest.fn(), redirect: jest.fn() }

  signup(reqLoggedUser, res)
  expect(res.redirect.mock.calls.length).toBe(1)
  expect(res.redirect.mock.calls[0].length).toBe(1)
  expect(res.redirect.mock.calls[0][0]).toBe('/')
  expect(res.render.mock.calls.length).toBe(0)

  signup(reqNewUser, res)
  expect(res.redirect.mock.calls.length).toBe(1)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0].length).toBe(2)
  expect(res.render.mock.calls[0][0]).toBe('user-signup')
  expect(res.render.mock.calls[0][1])
    .toEqual(expect.objectContaining({
      username: expect.stringMatching(reqLoggedUser.query.username)
    }))
})

test('all users page', async () => {
  const req = {}
  const res = { render: jest.fn() }

  await userList(req, res)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0].length).toBe(2)
  expect(res.render.mock.calls[0][0]).toBe('user-list')
  expect(res.render.mock.calls[0][1])
    .toEqual(expect.objectContaining({
      userlist: expect.any(Array)
    }))
})

test('settings page', () => {
  const user = {
    username: 'username1',
    email: 'email2',
    first_name: 'name3',
    country: 'country4'
  }

  const req = {}
  const res = { locals: { user }, render: jest.fn() }

  settings(req, res)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0].length).toBe(2)
  expect(res.render.mock.calls[0][0]).toBe('user-settings')
  expect(res.render.mock.calls[0][1].profile.length).toBe(8)

  expect(res.render.mock.calls[0][1].profile[0][0]).toBe('Username')
  expect(res.render.mock.calls[0][1].profile[0][1]).toBe(user.username)

  expect(res.render.mock.calls[0][1].profile[3][0]).toBe('Last Name')
  expect(res.render.mock.calls[0][1].profile[3][1]).toBe('- Empty -')
})

test('logout', () => {
  const session = { destroy: jest.fn() }
  const req = { session }
  const res = {}

  logOut(req, res)
  expect(req.session.destroy.mock.calls.length).toBe(1)
  expect(req.session.destroy.mock.calls[0].length).toBe(1)
  expect(req.session.destroy.mock.calls[0][0]).toBeInstanceOf(Function)
})
