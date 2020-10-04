const dropdown = document.getElementsByClassName('dropdown')[0]
const dropdownContent = document.getElementsByClassName('dropdown-content')[0]

dropdown.onmouseover = function () {
  dropdownContent.style.display = 'block'
}
dropdown.onmouseout = function () {
  dropdownContent.style.display = 'none'
}
