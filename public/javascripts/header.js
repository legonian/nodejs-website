const signupForm = document.getElementById('signup_form')
const loginForm = document.getElementById('login_form')

document.getElementById("signup-btn").onclick = () => {
  document.getElementById("login").classList.remove("active")
  document.getElementById("login").classList.remove("show")
  document.getElementById("login-tab").classList.remove("active")

  document.getElementById("signup").classList.add("active")
  document.getElementById("signup").classList.add("show")
  document.getElementById("signup-tab").classList.add("active")
}

document.getElementById("login-btn").onclick = () => {
  document.getElementById("login").classList.add("active")
  document.getElementById("login").classList.add("show")
  document.getElementById("login-tab").classList.add("active")

  document.getElementById("signup").classList.remove("active")
  document.getElementById("signup").classList.remove("show")
  document.getElementById("signup-tab").classList.remove("active")
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
  const originPath = window.location.origin
  const username = this.username.value
  const singupPage = `${originPath}/user/signup_page?username=${username}`
  window.location.assign(singupPage)
}
