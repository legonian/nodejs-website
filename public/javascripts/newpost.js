const simplemde = new window.SimpleMDE({
  element: document.getElementById('postBody'),
  autoDownloadFontAwesome: false,
  spellChecker: false
})
simplemde.value()
