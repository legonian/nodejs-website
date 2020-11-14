const sendBtn = document.querySelector('#send')
const messageInput = document.querySelector('#message-input')
const messChat = document.querySelector('.messages-chat')
const messageInputBox = document.querySelector('#message-input-box')
const userList = document.querySelector('.messages-friendlist')

let selected = null

const someUser = {
  username: 'username1',
  avatarUrl: '/images/avatar_example.png'
}
const someUser2 = {
  username: 'username2',
  avatarUrl: '/images/avatar_example.png'
}
const myselfUser = {
  username: 'me',
  avatarUrl: '/images/avatar_example.png'
}
const messJson = {
  user: myselfUser,
  chatlist: [
    {
      users: [someUser, myselfUser],
      messages: [
        {
          from: 1,
          message: 'Hello',
          created: '04 Jan 2020 00:12:00 GMT'
        },
        {
          from: 0,
          message: 'Hi',
          created: '04 Jan 2020 00:12:01 GMT'
        },
        {
          from: 1,
          message: 'You can type here any message you want!',
          created: '04 Jan 2020 00:12:02 GMT'
        }
      ]
    },
    {
      users: [someUser2, myselfUser],
      messages: [
        {
          from: 0,
          message: 'Here you another chat',
          created: '04 Jan 2020 00:12:00 GMT'
        },
        {
          from: 1,
          message: 'cool',
          created: '04 Jan 2020 00:12:01 GMT'
        },
        {
          from: 0,
          message: 'yeah just click on user on left panel',
          created: '04 Jan 2020 00:12:02 GMT'
        }
      ]
    }
  ]
}

function sendMessageToDB(dataJson, mText){
  const x = { from: dataJson.user, message: mText, created: '04 Jan 2020 00:12:00 GMT'}
  console.log('sent:', x)
  return x
}

function displaySentMessage(m) {
  const newMess = document.createElement('div')
  newMess.classList.add("d-flex")
  newMess.classList.add("align-items-end")
  newMess.classList.add("flex-column")
  newMess.classList.add("mr-2")
  newMess.classList.add("mb-2")

  const messP = document.createElement('p')
  messP.classList.add("bg-info")
  messP.classList.add("m-0")
  messP.classList.add("p-1")
  messP.classList.add("rounded")
  messP.classList.add("text-white")
  messP.innerText = m.message

  const timeSmall = document.createElement('small')
  timeSmall.classList.add("text-muted")
  timeSmall.innerText = (new Date(m.created)).toLocaleString('it-IT')

  const childDiv = document.createElement('div')
  childDiv.appendChild(messP)
  childDiv.appendChild(timeSmall)
  
  newMess.appendChild(childDiv)
  
  messChat.appendChild(newMess)
  messChat.scrollTop = messChat.scrollHeight
}

function displayReceivedMessage(m) {
  const newMess = document.createElement('div')
  newMess.classList.add('d-flex', 'align-items-start', 'ml-2', 'mb-2')

  const avatarImg = document.createElement('img')
  avatarImg.classList.add("rounded-circle")
  avatarImg.src = '/images/avatar_example.png'
  avatarImg.width = '25'

  const messP = document.createElement('p')
  messP.classList.add("bg-secondary")
  messP.classList.add("m-0")
  messP.classList.add("p-1")
  messP.classList.add("rounded")
  messP.classList.add("text-white")
  messP.innerText = m.message

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

messageInput.addEventListener("keyup", function (event) {
  if (event.key === 'Enter') {
    sendBtn.click()
  }
})

sendBtn.onclick = function () {
  if (messageInput.value !== '') {
    const m = sendMessageToDB(messJson, messageInput.value)
    displaySentMessage(m)
    messageInput.value = ''
  }
}

function selectUser(un) {
  const usernames = document.querySelectorAll('.div-to-select')
  for (username of usernames) {
    const usernameText = username.querySelector('.div-to-select > div > h5')
    if (un === usernameText.innerText) {
      username.classList.add('bg-secondary')
      usernameText.classList.add('text-white')
      usernameText.classList.remove('text-dark')
      selected = usernameText.innerText
    } else {
      username.classList.remove('bg-secondary')
      usernameText.classList.remove('text-white')
      usernameText.classList.add('text-dark')
    }
  }
}

function displayUserList(dataJson) {
  function getUsers(dataJson) {
    let users = []
    const currUser = dataJson.user
    const chats = dataJson.chatlist

    for (chat of chats) {
      if (chat.users.length !== 2) {
        return false
      }

      if (currUser.username === chat.users[0].username) {
        users.push(chat.users[1])
      } else {
        users.push(chat.users[0])
      }
    }
    return users
  }
  function displayChat(dataJson, u) {
    messChat.innerHTML = ''
    messageInputBox.hidden = false
    const currUser = dataJson.user

    let currChat = false
    for (chat of dataJson.chatlist) {
      for (user of chat.users) {
        if (u.username === user.username) {
          currChat = chat
        }
      }
    }
    if (!currChat) {
      displayChatError('Choose user to chat at left panel')
      return
    }
    if (currChat.messages.length === 0) {
      displayChatError('This chat is empty. Type new message!')
      messageInputBox.hidden = false
      return
    }
    for (m of currChat.messages) {
      if (currChat.users[m.from].username === currUser.username) {
        displaySentMessage(m)
      } else {
        displayReceivedMessage(m)
      }
    }
  }

  const users = getUsers(dataJson)

  userList.innerHTML = ''
  if (users.length < 1){
    const emptyMess = document.createElement('h5')
    emptyMess.classList.add("text-muted")
    emptyMess.classList.add("text-center")
    emptyMess.innerText = 'No users'
    userList.appendChild(emptyMess)
  }

  function displayUser(user) {
    const userLink = document.createElement('a')
    userLink.href = '#'
    userLink.onclick = function () {
      displayChat(dataJson, user)
      selectUser(user.username)
    }

    const userDiv1 = document.createElement('div')
    userDiv1.classList.add('border-bottom', 'm-0', 'p-2')
    userDiv1.classList.add('div-to-select')

    const userDiv2 = document.createElement('div')
    userDiv2.classList.add('d-flex')

    const userAvatar = document.createElement('img')
    userAvatar.classList.add('rounded-circle')
    userAvatar.src = user.avatarUrl
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

  for (user of users){
    displayUser(user)
  }
}

function displayChatError(errorText) {
  messChat.innerHTML = ''
  messageInputBox.hidden = true
  const chatTitle = document.createElement('h4')
  chatTitle.classList.add("text-muted")
  chatTitle.classList.add("text-center")
  chatTitle.innerText = errorText
  messChat.appendChild(chatTitle)
}

const urlParams = new URLSearchParams(window.location.search)
const newUserName = urlParams.get('new_user')
const newUserAvatar = decodeURIComponent(urlParams.get('avatar'))
if (newUserName && newUserAvatar) {
  console.log('new chat with', newUserName)
  const newUser = { username: newUserName, avatarUrl: newUserAvatar}
  messJson.chatlist.push({ users: [messJson.user, newUser], messages:[]})
  displayUserList(messJson)
  displayChatError('This chat is empty. Type new message!')
  messageInputBox.hidden = false
  selectUser(newUserName)
} else {
  displayUserList(messJson)
  displayChatError('Choose user to chat at left panel')
}
