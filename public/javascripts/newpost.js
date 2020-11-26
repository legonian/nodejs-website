const submitPostForm = document.getElementById('upload-form')
const onNewDiv = document.getElementById('on-new')
const onUploadedDiv = document.getElementById('on-uploaded')
const postLink = document.getElementById('post-link')

const simplemde = new window.SimpleMDE({
  element: document.getElementById('postBody'),
  autoDownloadFontAwesome: false,
  spellChecker: false
})
simplemde.value()

function checkUploadForm (form) {
  function checkInput (input, regex) {
    if (input.value === '' && input.value.match(regex) === null) {
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
    const isTitle = /^[a-zA-Z0-9 :,.?!'"#$%;()&-]{1,80}$/g
    const isContent = /^[\s\S]+$/g
    let isValid = true
    if (!checkInput(form.title, isTitle)) isValid = false
    if (!checkInput(form.content, isContent)) isValid = false
    return isValid
  } catch (e) {
    console.log('Error:', e)
    return false
  }
}
submitPostForm.onsubmit = async function (event) {
  event.preventDefault()
  if (checkUploadForm(this)) {
    const formBody = JSON.stringify({
      title: this.title.value,
      content: this.content.value
    })
    const res = await window.fetch('/p/upload', {
      method: 'post',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: formBody
    })
    if (res.status === 200) {
      const postId = (await res.json()).post_id
      onNewDiv.hidden = true
      onUploadedDiv.hidden = false
      postLink.href = `/p/${postId}`
    } else {
      window.alert('Error while uploading! Check your data.')
    }
  }
}

window.onbeforeunload = function (event) {
  event.preventDefault()
  event.returnValue = 'Are you sure want to leave this page?'
}
