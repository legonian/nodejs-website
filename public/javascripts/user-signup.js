let fullSignupForm = document.getElementById('signup-form')

fullSignupForm.onsubmit = async function (event) {
  event.preventDefault()
  if (fullSignupForm.checkValidity() === false) {
    event.stopPropagation()
  } else {
    const formBody = JSON.stringify({
      username: this.username.value,
      password: this.password.value,
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      email: this.email.value,
      country: this.country.value,
      'g-recaptcha-response': window.grecaptcha.getResponse(1)
    })
    const res = await window.fetch('/user/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      },
      body: formBody
    })
    if (res.status === 200) {
      if (this.go_profile.checked){
        window.location.assign(res.url)
      } else {
        window.history.back()
      }
    } else {
      window.grecaptcha.reset(1)
      console.log('Bad request')
    }
  }
  this.classList.add('was-validated')
}
