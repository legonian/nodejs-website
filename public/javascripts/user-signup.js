const fullSignupForm = document.getElementById('signup-form')

function checkForm (form) {
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
    const isUsername = /^[a-z0-9_]{1,20}$/g
    const isPassword = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,60}$/g
    const isEmail = /^([a-zA-Z0-9_.-]{1,50})@([\da-z.-]{1,40})\.([a-z.]{2,5})$/g
    const isName = /^[a-zA-Z0-9 ]{1,30}$/g
    const isCountry = /^[a-zA-Z0-9&(),. ]{1,30}$/g
    let isValid = true
    if (!checkInput(form.username, isUsername)) isValid = false
    if (!checkInput(form.password, isPassword)) isValid = false
    if (!checkInput(form.email, isEmail)) isValid = false
    if (!checkInput(form.first_name, isName)) isValid = false
    if (form.last_name.value !== '') {
      if (!checkInput(form.last_name, isName)) isValid = false
    }
    if (!checkInput(form.country, isCountry)) isValid = false
    return isValid
  } catch (e) {
    console.log('Error:', e)
    return false
  }
}

fullSignupForm.onsubmit = async function (event) {
  event.preventDefault()
  if (checkForm(this)) {
    const formBody = JSON.stringify({
      username: this.username.value,
      password: this.password.value,
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      email: this.email.value,
      country: this.country.value,
      'g-recaptcha-response': window.grecaptcha.getResponse(1)
    })
    const res = await window.fetch('/u/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json'
      },
      body: formBody
    }).catch(e => {
      console.log('Bad request')
      window.grecaptcha.reset(1)
    })
    if (res.status === 200) {
      if (this.go_profile.checked) {
        window.location.href = '/u'
      } else {
        window.history.back()
      }
    } else {
      window.grecaptcha.reset(1)
      console.log('Bad request')
    }
  } else {
    window.grecaptcha.reset(1)
  }
}
