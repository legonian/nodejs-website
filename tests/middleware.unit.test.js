const captchaMiddleware = require('../middleware/check_captcha')
const rateLimiterMiddleware = require('../middleware/rate-limiter')
const authMiddleware = require('../middleware/user-authorize-middleware')
const validateSessionMiddleware = require('../middleware/validate-session-middleware')

jest.mock('../models/user-model.js')
const User = require('../models/user-model')

test('captcha middleware', async () => {
  const body = { 'g-recaptcha-response': '' } // valid for non-production
  const session = {} // to access req.session.error

  const req = { session, body }
  const res = {}
  const next = jest.fn()

  await captchaMiddleware(req, res, next)
  expect(next.mock.calls[0]).toHaveLength(0)
  expect(req.session.error).toBeUndefined()
})

test('rate limiter middleware', async () => {
  const ip = '0:0:0:0' // any IP
  const app = { locals: { ipList: {} } } // express app local vars
  const session = {} // to access req.session.error

  const req = { ip, session, app }
  const res = {}
  const next = jest.fn()

  for (let i = 0; i < 20; i++) {
    await rateLimiterMiddleware(req, res, next)
    expect(next.mock.calls[i]).toHaveLength(0)
    expect(req.session.error).toBeUndefined()
  }
  await rateLimiterMiddleware(req, res, next)
  expect(next.mock.calls[20][0]).toBe('route')
  expect(req.session.error).toEqual(expect.any(String))
})

test('auth user middleware', async () => {
  const route = { path: '' }
  const body = {
    username: 'testmiddleware',
    password: 'qweQWE123',
    first_name: 'Name1',
    lastName: 'Name2',
    email: 'testmiddleware@example.com',
    country: 'Uganda'
  }
  const session = { regenerate: jest.fn() } // to access req.session.error

  const req = { route, body, session }
  const res = {}
  const next = jest.fn()

  route.path = '/signup'
  await authMiddleware(req, res, next)
  expect(next.mock.calls).toHaveLength(0)
  expect(req.session.regenerate.mock.calls[0][0]).toBeInstanceOf(Function)
  expect(req.session.error).toBeUndefined()

  route.path = '/login'
  await authMiddleware(req, res, next)
  expect(next.mock.calls).toHaveLength(0)
  expect(req.session.regenerate.mock.calls[0][0]).toBeInstanceOf(Function)
  expect(req.session.error).toBeUndefined()

  await User.delete(req.body)
})

test('validate session middleware', async () => {
  const user = {
    username: 'testuser',
    password: 'qweQWE123',
    first_name: 'Name1',
    lastName: 'Name2',
    email: 'test@example.com',
    country: 'Uganda'
  }
  const session = { user, destroy: jest.fn() }
  const locals = {}

  const req = { session }
  const res = { locals }
  const next = jest.fn()

  await User.create(user)
  await validateSessionMiddleware(req, res, next)
  await User.delete(user)
  expect(req.session.destroy.mock.calls).toHaveLength(0)
  expect(next.mock.calls[0]).toHaveLength(0)
  expect(req.session.error).toBeUndefined()

  await validateSessionMiddleware(req, res, next)
  expect(req.session.destroy.mock.calls[0][0]).toBeInstanceOf(Function)
  expect(next.mock.calls[0]).toHaveLength(0)
})
