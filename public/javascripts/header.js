const signup_btn = document.getElementById('sign_up')
const login_btn = document.getElementById('log_in')

const login_tab_btn = document.getElementById('login_tab')
const signup_tab_btn = document.getElementById('signup_tab')

const login_tab = document.getElementsByClassName('login')[0]
const signup_tab = document.getElementsByClassName('signup')[0]

const modal_window = document.getElementsByClassName('modal-background')[0]
const modal_close_btn = document.getElementsByClassName('modal-close')[0]

function show_signup_tab() {
  signup_tab.style.display = "block"
  login_tab.style.display = "none"

  signup_tab_btn.classList.add('active')
  login_tab_btn.classList.remove('active')
}
function show_login_tab() {
  login_tab.style.display = "block"
  signup_tab.style.display = "none"

  login_tab_btn.classList.add('active')
  signup_tab_btn.classList.remove('active')
}

signup_btn.onclick = function () {
  modal_window.style.display = 'block'
  show_signup_tab()
}
login_btn.onclick = function () {
  modal_window.style.display = 'block'
  show_login_tab()
}

modal_window.onclick = function(event) {
  if (event.target == modal_window) {
    modal_window.style.display = "none"
  }
}

modal_close_btn.onclick = function () {
  modal_window.style.display = 'none'
}

login_tab_btn.onclick = function () {show_login_tab()}
signup_tab_btn.onclick = function () {show_signup_tab()}

