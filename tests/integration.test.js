const puppeteer = require('puppeteer')
const portfinder = require('portfinder')

const app = require('../app')

const puppeteerOption = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}
const userToTest = {
  username: 'testuser',
  password: 'qweQWE123',
  firstName: 'Name1',
  lastName: 'Name2',
  email: 'test@example.com',
  country: 'Uganda'
}

let browser, page, server, port, rootUrl
beforeEach(async () => {
  browser = await puppeteer.launch(puppeteerOption)
  page = await browser.newPage()
  port = await portfinder.getPortPromise()
  server = app.listen(port)
  rootUrl = `http://localhost:${port}`
})
afterEach(async () => {
  server.close()
  await browser.close()
})

test('home page links to userlist page', async () => {
  const res1 = await page.goto(rootUrl)
  expect(res1.status()).toBe(200)

  const [res2] = await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.click('#UserList')
  ])
  expect(res2.status()).toBe(200)
  expect(res2.url()).toBe(rootUrl + '/userlist')
})

test('signup and delete user', async () => {
  const res1 = await page.goto(rootUrl)
  expect(res1.status()).toBe(200)

  await page.click('#signup-btn')
  await page.waitForSelector('#signup_form', { visible: true })
  await await page.evaluate((x) => {
    document.querySelector('#signup_form > div > div > input').value = x
  }, userToTest.username)
  const [res2] = await Promise.all([
    page.waitForNavigation(),
    page.click('#signup_form > button')
  ])
  expect(res2.status()).toBe(200)
  expect(page.url()).toBe(rootUrl + '/signup_page?username=' + userToTest.username)
  await await page.evaluate((u) => {
    document.querySelector('#signup-form > div:nth-child(3) > div > input').value = u.password
    document.querySelector('#signup-form > div:nth-child(4) > div:nth-child(1) > input').value = u.firstName
    document.querySelector('#signup-form > div:nth-child(4) > div:nth-child(2) > input').value = u.lastName
    document.querySelector('#signup-form > div:nth-child(5) > div.col-md-8.mb-3 > input').value = u.email
  }, userToTest)
  await page.select('#signup-form > div:nth-child(5) > div.col-md-4.mb-3 > select', userToTest.country)
  // await page.screenshot({ path: './screenshot.png' })
  const [res3] = await Promise.all([
    page.waitForNavigation(),
    page.click('#signup-form > button')
  ])
  const userProfileUrl = res3.url()
  const userId = Number(userProfileUrl.split('http://localhost:8000/u/')[1])
  expect(userId).not.toBeNaN()
  userToTest.userId = userId
  console.log('userId =', [userId])
  expect(res3.status()).toBe(200)

  const [res4] = await Promise.all([
    page.waitForNavigation(),
    page.click('body > div > div:nth-child(2) > nav > a.btn.btn-outline-secondary.col-md-auto.mx-3.mb-4')
  ])
  expect(res4.url()).toBe(rootUrl + '/settings')

  await page.click('#delete-user')
  await page.waitForSelector('#delete-modal', { visible: true })

  await page.evaluate((u) => {
    document.querySelector('#delete_form > div > input').value = u.password
  }, userToTest)
  // await page.mouse.wheel({ deltaY: 1000 })

  const [res5] = await Promise.all([
    page.waitForNavigation(),
    page.click('#delete_form > button')
  ])
  expect(res5.url()).toBe(rootUrl + '/')
})
