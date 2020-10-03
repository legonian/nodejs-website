const signupButton = document.getElementById('sign_up')
const loginButton = document.getElementById('log_in')

const loginTabButton = document.getElementById('login_tab')
const signupTabButton = document.getElementById('signup_tab')

const signupForm = document.getElementById('signup_form')
const loginForm = document.getElementById('login_form')

const loginTab = document.getElementsByClassName('login')[0]
const signupTab = document.getElementsByClassName('signup')[0]

const modalWindow = document.getElementsByClassName('modal-background')[0]
const modalCloseButton = document.getElementsByClassName('modal-close')[0]

const dropdown = document.getElementsByClassName('dropdown')[0]
const dropdownContent = document.getElementsByClassName('dropdown-content')[0]

const isUserLogged = Boolean(signupButton)

function showSignupTab () {
  signupTab.style.display = 'block'
  loginTab.style.display = 'none'

  signupTabButton.classList.add('active')
  loginTabButton.classList.remove('active')
}
function showLoginTab () {
  loginTab.style.display = 'block'
  signupTab.style.display = 'none'

  loginTabButton.classList.add('active')
  signupTabButton.classList.remove('active')
}

if (isUserLogged) {
  signupButton.onclick = function () {
    modalWindow.style.display = 'block'
    showSignupTab()
  }
  loginButton.onclick = function () {
    modalWindow.style.display = 'block'
    showLoginTab()
  }
  modalWindow.onmousedown = function (event) {
    if (event.target === modalWindow) {
      modalWindow.style.display = 'none'
    }
  }
  modalCloseButton.onclick = function () {
    modalWindow.style.display = 'none'
  }
  loginTabButton.onclick = function () { showLoginTab() }
  signupTabButton.onclick = function () { showSignupTab() }
} else {
  dropdown.onmouseover = function () {
    dropdownContent.style.display = 'block'
  }
  dropdown.onmouseout = function () {
    dropdownContent.style.display = 'none'
  }
}

loginForm.onsubmit = async function (event) {
  event.preventDefault()
  const formBody = JSON.stringify({
    username: this.username.value,
    password: this.password.value,
    'g-recaptcha-response': window.grecaptcha.getResponse(0)
  })
  const res = await window.fetch('/user/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: formBody
  })
  if (res.status === 200) {
    window.location.assign(res.url)
  } else {
    window.grecaptcha.reset(0)
    window.alert('Bad Creds')
  }
}
signupForm.onsubmit = async function (event) {
  event.preventDefault()
  const formBody = JSON.stringify(
    {
      username: this.username.value,
      password: this.password.value,
      first_name: this.first_name.value,
      'g-recaptcha-response': window.grecaptcha.getResponse(1)
    }
  )
  const res = await window.fetch('/user/signup', {
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: formBody
  })
  if (res.status === 200) {
    window.location.assign(res.url)
  } else {
    window.grecaptcha.reset(1)
    window.alert('Bad Creds')
  }
}

// Password validation
/*
let input = document.querySelectorAll('input[name='password']')[1]
input.onblur = function () {
  const checkPassword = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,60}$/g
  if (input.value.match(checkPassword)){
    input.style.border = '2px solid lightgreen'
  } else {
    input.style.border = '2px solid red'
  }
}
*/
