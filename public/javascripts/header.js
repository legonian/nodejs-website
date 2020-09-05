let btn = document.getElementById('signIn');
let modalWindow = document.getElementsByClassName('modal-background')[0];
let modalClose = document.getElementsByClassName('modal-close')[0];


btn.onclick = function () {
    modalWindow.style.display = 'block';
}

modalClose.onclick = function () {
    modalWindow.style.display = 'none';

}