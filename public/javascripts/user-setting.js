function setupBtns () {
  function clearValidators () {
    const pw = document.querySelector('#edit_form > div:nth-child(1) > input')
    const newVal = document.querySelector('#new-value > div > input')

    pw.classList.remove('is-valid')
    pw.classList.remove('is-invalid')

    newVal.classList.remove('is-valid')
    newVal.classList.remove('is-invalid')
  }
  const modalTitle = document.getElementById('edit-modal-title')
  const modalParanName = document.querySelector('#new-value > label')
  const modalParanInput = document.querySelector('#new-value > div > input')

  document.getElementById('change-username').onclick = function () {
    clearValidators()
    modalTitle.innerText = 'Change Your Username'
    modalParanName.innerText = 'New Username'
    modalParanInput.name = 'username'
    modalParanInput.type = 'text'
    modalParanInput.placeholder = ''
    modalParanInput.value = ''
  }
  document.getElementById('change-email').onclick = function () {
    clearValidators()
    modalTitle.innerText = 'Change Your Email'
    modalParanName.innerText = 'New Email'
    modalParanInput.name = 'email'
    modalParanInput.type = 'email'
    modalParanInput.placeholder = 'email@example.com'
    modalParanInput.value = ''
  }
  document.getElementById('change-first_name').onclick = function () {
    clearValidators()
    modalTitle.innerText = 'Change Your First Name'
    modalParanName.innerText = 'New First Name'
    modalParanInput.name = 'first_name'
    modalParanInput.type = 'text'
    modalParanInput.placeholder = ''
    modalParanInput.value = ''
  }
  document.getElementById('change-last_name').onclick = function () {
    clearValidators()
    modalTitle.innerText = 'Change Your Last Name'
    modalParanName.innerText = 'New Last Name'
    modalParanInput.name = 'last_name'
    modalParanInput.type = 'text'
    modalParanInput.placeholder = ''
    modalParanInput.value = ''
  }
  document.getElementById('change-avatar').onclick = function () {
    clearValidators()
    modalTitle.innerText = 'Change Your Avatar'
    modalParanName.innerText = 'Type URL of Your Avatar Image'
    modalParanInput.name = 'avatar'
    modalParanInput.type = 'text'
    modalParanInput.placeholder = 'https://...'
    modalParanInput.value = ''
  }
  document.getElementById('change-user_info').onclick = function () {
    clearValidators()
    modalTitle.innerText = 'Change Your Info'
    modalParanName.innerText = 'Short info about yourself'
    modalParanInput.name = 'user_info'
    modalParanInput.type = 'text'
    modalParanInput.placeholder = ''
    modalParanInput.value = ''
  }
  document.getElementById('change-password').onclick = function () {
    clearValidators()
    modalTitle.innerText = 'Change Your Password'
    modalParanName.innerText = 'New Password'
    modalParanInput.name = 'password'
    modalParanInput.type = 'password'
    modalParanInput.placeholder = '********'
    modalParanInput.value = ''
  }
  document.getElementById('change-country').onclick = function () {
    clearValidators()
    modalTitle.innerText = 'Change Username'
    modalParanName.innerText = 'New Username'
    modalParanInput.name = 'username'
    modalParanInput.type = 'text'
    modalParanInput.placeholder = ''
    modalParanInput.value = ''
  }
}
setupBtns()

function checkEditForm (form, param) {
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
    const isPassword = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,60}$/g
    let regexOfParam
    if (param === 'username') {
      regexOfParam = /^[a-z0-9_]{1,20}$/g
    } else if (param === 'password') {
      regexOfParam = isPassword
    } else if (param === 'email') {
      regexOfParam = /^([a-zA-Z0-9_.-]{1,50})@([\da-z.-]{1,40})\.([a-z.]{2,5})$/g
    } else if (param === 'first_name') {
      regexOfParam = /^[a-zA-Z0-9 ]{1,30}$/g
    } else if (param === 'last_name') {
      regexOfParam = /^[a-zA-Z0-9 ]{1,30}$/g
    } else if (param === 'avatar') {
      regexOfParam = /^https:\/\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9_-]+\/[\S]+$/g
    } else if (param === 'user_info') {
      regexOfParam = /^[a-zA-Z0-9 :,.?!'"#$%;()&-]{1,420}$/g
    } else if (param === 'country') {
      regexOfParam = /^[a-zA-Z0-9&(),. ]{1,30}$/g
    } else {
      console.log('param =', param)
      return false
    }

    let isValid = true
    if (!checkInput(form.password, isPassword)) isValid = false
    if (!checkInput(form[param], regexOfParam)) isValid = false
    return isValid
  } catch (e) {
    console.log('Error:', e)
    return false
  }
}

document.getElementById('edit_form').onsubmit = async function (event) {
  event.preventDefault()
  let paramToCheck
  for (const param of this.querySelectorAll('[name]')) {
    if (param.name !== 'password') paramToCheck = param.name
  }
  if (checkEditForm(this, paramToCheck)) {
    const formBody = JSON.stringify({
      password: this.password.value,
      param: paramToCheck,
      value: this[paramToCheck].value
    })
    const res = await window.fetch('/u/update', {
      method: 'post',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: formBody
    })
    if (res.status === 200) {
      window.location.reload()
    } else {
      this[paramToCheck].classList.remove('is-valid')
      this[paramToCheck].classList.add('is-invalid')
      this.password.classList.remove('is-valid')
      this.password.classList.add('is-invalid')
    }
  }
}

document.getElementById('delete_form').onsubmit = async function (event) {
  event.preventDefault()
  if (checkEditForm(this, 'password')) {
    const formBody = JSON.stringify({ password: this.password.value })
    const res = await window.fetch('/u/delete', {
      method: 'post',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: formBody
    })
    if (res.status === 200) {
      window.location = '/'
    } else {
      this.password.classList.remove('is-valid')
      this.password.classList.add('is-invalid')
      // window.alert('Wrong Password')
    }
  }
}
