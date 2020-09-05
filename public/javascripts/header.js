let btn = document.getElementById('signIn');
let modalWindow = document.getElementsByClassName('modal-background')[0];
let modalClose = document.getElementsByClassName('modal-close')[0];
let signIn = document.getElementById('sign-in');

signIn.onclick = function () {
    modalWindow.style.display = 'block';
}

modalClose.onclick = function () {
    modalWindow.style.display = 'none';
}

let username;

if (username) {
    signIn.innerHTML = username;
} 
