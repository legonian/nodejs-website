const userList = document.querySelector('#messages-friendlist')
const messChat = document.querySelector('#messages-chat')

const messageInputBox = document.querySelector('#message-input-box')
const messageInput = document.querySelector('#message-input')

const sendBtn = document.querySelector('#send')
const backBtn = document.querySelector('#back-button')

const chatHeader = document.querySelector('#chat-header')

const userPanel = document.querySelector('#user-panel')
const chatPanel = document.querySelector('#chat-panel')


let selectedUser

async function downloadMessages() {
  const res = await window.fetch('/m/get_chat', { method: 'post' })
  if (res.status !== 200) {
    console.log('cant download messages')
    return false
  }
  const rawJson = await res.json()
  if (!rawJson.ok) {
    console.log('no data from server')
    return false
  }
  let resJson = { user: rawJson.user, users: {} }
  for (const mess of rawJson.chat) {
    if (typeof resJson.users[mess.user_id] === 'undefined'){
      resJson.users[mess.user_id] = {
        user_id: mess.user_id,
        username: mess.username,
        avatar: mess.avatar,
        first_name: mess.first_name,
        messages:[]
      }
    }
    resJson.users[mess.user_id].messages.push({
      from_me: mess.from_me,
      content: mess.content,
      created: mess.create_date
    })
  }
  return resJson
}

function displaySentMessage(m) {
  const newMess = document.createElement('div')
  newMess.classList.add('d-flex','align-items-end', 'flex-column', 'mr-2', 'mb-2')

  const messP = document.createElement('p')
  messP.classList.add('bg-info', 'm-0', 'p-1', 'rounded', 'text-white')
  messP.innerText = m.content

  const timeSmall = document.createElement('small')
  timeSmall.classList.add("text-muted")
  timeSmall.innerText = (new Date(m.created)).toLocaleString('it-IT')
  
  newMess.appendChild(messP)
  newMess.appendChild(timeSmall)
  
  messChat.appendChild(newMess)
  messChat.scrollTop = messChat.scrollHeight
}

function displayChat(user) {
  function displayReceivedMessage(m, avatarUrl) {
    const newMess = document.createElement('div')
    newMess.classList.add('d-flex', 'align-items-start', 'ml-2', 'mb-2')

    const avatarImg = document.createElement('img')
    avatarImg.classList.add("rounded-circle")
    avatarImg.src = avatarUrl
    avatarImg.width = '25'

    const messP = document.createElement('p')
    messP.classList.add('bg-secondary', 'm-0', 'p-1', 'rounded', 'text-white')
    messP.innerText = m.content

    const timeSmall = document.createElement('small')
    timeSmall.classList.add("text-muted")
    timeSmall.innerText = (new Date(m.created)).toLocaleString('it-IT')

    const childDiv = document.createElement('div')
    childDiv.appendChild(messP)
    childDiv.appendChild(timeSmall)

    newMess.appendChild(avatarImg)
    newMess.appendChild(childDiv)

    messChat.appendChild(newMess)
    messChat.scrollTop = messChat.scrollHeight
  }
  function displayChatWarning(errorText) {
    messChat.innerHTML = ''
    const chatTitle = document.createElement('h4')
    chatTitle.classList.add("text-muted")
    chatTitle.classList.add("text-center")
    chatTitle.innerText = errorText
    messChat.appendChild(chatTitle)
    chatHeader.hidden = true
  }
  function displayChatHead(text) {
    const chatHeader = document.querySelector('#chat-header')
    chatHeader.hidden = false

    // hide userPanel show chatPanel
    userPanel.classList.add('d-none', 'd-md-block')
    chatPanel.classList.remove('d-none', 'd-md-block')

    chatPanel.classList.remove('col-8')
    chatPanel.classList.add('col')
    userPanel.classList.remove('col')
    userPanel.classList.add('col-4')

    chatHeader.querySelector('#chat-header > h5').innerText = text
    backBtn.onclick = function (){
      selectedUser = false
      // hide chatPanel show userPanel
      chatPanel.classList.add('d-none', 'd-md-block')
      userPanel.classList.remove('d-none', 'd-md-block')

      chatPanel.classList.remove('col')
      chatPanel.classList.add('col-8')

      userPanel.classList.add('col')
      userPanel.classList.remove('col-4')

      displayChatWarning('Choose user to chat at left panel')
      messageInputBox.hidden = true

      const usernames = document.querySelectorAll('.div-to-select')
      for (username of usernames) {
        const usernameText = username.querySelector('.div-to-select > div > h5')
        username.classList.remove('bg-secondary', 'text-white')
        usernameText.classList.add('text-dark')
      }
    }
  }
  selectedUser = user

  messChat.innerHTML = ''
  messageInputBox.hidden = false
  if (typeof selectedUser === 'undefined') {
    displayChatWarning('Choose user to chat at left panel')
    messageInputBox.hidden = true
    return
  } else {
    displayChatHead(selectedUser.username)
    for (m of selectedUser.messages) {
      if (m.from_me) {
        displaySentMessage(m)
      } else {
        displayReceivedMessage(m, selectedUser.avatar)
      }
    }
  }
  const usernames = document.querySelectorAll('.div-to-select')
  for (username of usernames) {
    const usernameText = username.querySelector('.div-to-select > div > h5')
    if (selectedUser.username === usernameText.innerText) {
      username.classList.add('bg-secondary', 'text-white')
      usernameText.classList.remove('text-dark')
    } else {
      username.classList.remove('bg-secondary', 'text-white')
      usernameText.classList.add('text-dark')
    }
  }
}

function displayUserList(dataJson) {
  userList.innerHTML = ''
  if (Object.keys(dataJson.users).length < 1){
    const emptyMess = document.createElement('h5')
    emptyMess.classList.add("text-muted")
    emptyMess.classList.add("text-center")
    emptyMess.innerText = 'No users'
    userList.appendChild(emptyMess)
  }
  for (const user_id in dataJson.users){
    const user = dataJson.users[user_id]

    const userLink = document.createElement('a')
    userLink.href = '#'
    userLink.onclick = function () {
      displayChat(user)
    }
    const userDiv1 = document.createElement('div')
    userDiv1.classList.add('border-bottom', 'm-0', 'p-2')
    userDiv1.classList.add('div-to-select')

    const userDiv2 = document.createElement('div')
    userDiv2.classList.add('d-flex')

    const userAvatar = document.createElement('img')
    userAvatar.classList.add('rounded-circle')
    userAvatar.src = user.avatar
    userAvatar.width = 25
    userAvatar.height = 25

    const userName = document.createElement('h5')
    userName.classList.add('p-1', 'text-dark')
    userName.innerText = user.username

    userDiv2.appendChild(userAvatar)
    userDiv2.appendChild(userName)

    userDiv1.appendChild(userDiv2)
    userLink.appendChild(userDiv1)

    userList.appendChild(userLink)
  }
}

;(async ()=>{
  let messJson = await downloadMessages()
  messageInput.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
      sendBtn.click()
    }
  })
  sendBtn.onclick = async function () {
    if (messageInput.value !== '' && selectedUser) {
      const sent_to = selectedUser.user_id
      const content = messageInput.value
      const formBody = JSON.stringify({ sent_to, content })
      const res = await window.fetch('/m/send', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json'
        },
        body: formBody
      })
      if (res.status === 200) {
        const m = await res.json()
        m.created = m.create_date
        m.from_me = true
        messJson.users[m.sent_to].messages.push(m)
        delete m.create_date
        delete m.sent_from
        delete m.sent_to
        displaySentMessage(m)
        messageInput.value = ''
      } else {
        console.log('cant download messages')
      }
    }
  }
  const urlParams = new URLSearchParams(window.location.search)
  const newUserId = Number(urlParams.get('user_id'))
  const newUserName = urlParams.get('username')
  const newUserAvatar = decodeURIComponent(urlParams.get('avatar'))
  const newUserFirstName = urlParams.get('first_name')
  if (newUserId && newUserName && newUserAvatar) {
    if (typeof messJson.users[newUserId] === 'undefined') {
      console.log('new chat with', newUserName)
      const newUser = {
        user_id: newUserId,
        username: newUserName,
        avatar: newUserAvatar,
        first_name: newUserFirstName,
        messages: []
      }
      messJson.users[newUserId] = newUser
    }
    displayUserList(messJson)
    displayChat(messJson.users[newUserId])
  } else {
    displayUserList(messJson)
    displayChat()
    messageInputBox.hidden = true
  }
})()
