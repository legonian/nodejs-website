const loginTab = document.getElementById('login-tab')
const loginPanel = document.getElementById('login')
const loginForm = document.getElementById('login_form')
const loginBtn = document.getElementById('login-btn')

const signupTab = document.getElementById('signup-tab')
const signupPanel = document.getElementById('signup')
const signupForm = document.getElementById('signup_form')
const signupBtn = document.getElementById('signup-btn')

signupBtn.onclick = () => {
  loginPanel.classList.remove('active', 'show')
  loginTab.classList.remove('active')

  signupPanel.classList.add('active', 'show')
  signupTab.classList.add('active')
}

loginBtn.onclick = () => {
  loginPanel.classList.add('active', 'show')
  loginTab.classList.add('active')

  signupPanel.classList.remove('active', 'show')
  signupTab.classList.remove('active')
}

function checkLoginForm (form) {
  function checkInput (input, regex) {
    if (input.value.match(regex) === null) {
      input.classList.remove('is-valid')
      input.classList.add('is-invalid')
      return false
    } else {
      input.classList.remove('is-invalid')
      input.classList.add('is-valid')
      return true
    }
  }
  try {
    const isUsername = /^[a-z0-9_]{1,80}$/g
    const isPassword = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,60}$/g
    let isValid = true
    if (!checkInput(form.username, isUsername)) isValid = false
    if (!checkInput(form.password, isPassword)) isValid = false
    return isValid
  } catch (e) {
    console.log('Error:', e)
    return false
  }
}

function checkUsernameForm (form) {
  try {
    const isUsername = /^[a-z0-9_]{1,20}$/g
    if (form.username.value.match(isUsername) === null) {
      form.username.classList.remove('is-valid')
      form.username.classList.add('is-invalid')
      return false
    } else {
      form.username.classList.remove('is-invalid')
      form.username.classList.add('is-valid')
      return true
    }
  } catch (e) {
    console.log('Error:', e)
    return false
  }
}

loginForm.onsubmit = async function (event) {
  event.preventDefault()
  if (checkLoginForm(this)) {
    const formBody = JSON.stringify({
      username: this.username.value,
      password: this.password.value,
      'g-recaptcha-response': window.grecaptcha.getResponse(0)
    })
    const res = await window.fetch('/u/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: formBody
    })
    if (res.status === 200) {
      window.location.assign(res.url)
    } else {
      window.grecaptcha.reset(0)
      window.alert('User not exist')
    }
  } else {
    window.grecaptcha.reset(0)
  }
}

signupForm.onsubmit = async function (event) {
  event.preventDefault()
  if (checkUsernameForm(this)) {
    const originPath = window.location.origin
    const username = this.username.value
    const singupPage = `${originPath}/signup_page?username=${username}`
    window.location.assign(singupPage)
  }
}
