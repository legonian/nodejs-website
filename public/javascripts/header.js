let sign_up_btn = document.getElementById('sign_up')
let log_in_btn = document.getElementById('log_in')
let submit_btn = document.getElementById('submit')

let modal_close_btn = document.getElementsByClassName('modal-close')[0]
let modal_window = document.getElementsByClassName('modal-background')[0]
let login_form = document.getElementsByClassName('login-form')[0]
let on_sign_up = document.getElementsByClassName('on_sign_up')

log_in_btn.onclick = function () {
    on_sign_up[0].style.display = 'none'
    on_sign_up[0].required = false
    on_sign_up[1].style.display = 'none'
    login_form.action = '/login'
    submit_btn.value = 'Log In'
    modal_window.style.display = 'block'
}

sign_up_btn.onclick = function () {
    on_sign_up[0].style.display = 'block'
    on_sign_up[0].required = true
    on_sign_up[1].style.display = 'block'

    login_form.action = '/signup'
    submit_btn.value = 'Sign Up'
    modal_window.style.display = 'block'
}

modal_close_btn.onclick = function () {
    modal_window.style.display = 'none'
}
