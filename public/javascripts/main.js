const topics = JSON.parse(document.getElementById('data_js').textContent)

function createTopic (topics) {
  return `
    <div class="forum-topic">
      <div class="forum-name">
        <a class="suptitle" href="">${topics.suptitle}</a>
          <br>
        <span class="subtitle subtext">
          ${topics.subtitle}
        </span>
      </div>
      <div class="forum-topic-number">${topics.topics}</div>
      <div class="forum-posts ">${topics.posts}</div>
      <div class="forum-last-post">
        <div class="last-post-icon"></div>
        <span class="forum-last-post-name">
          ${topics.nickname}
        </span> 
          <br>
        <span class="forum-last-post-timestamp subtext">
          ${topics.timestamp}
        </span>
      </div>
    </div>`
}

const templates = topics.map(topic => createTopic(topic))

const html = templates.join(' ')

document.getElementById('topic').innerHTML = html
