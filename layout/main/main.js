function rand() {
    let rand = Math.round(Math.random() * (50 - 1) + 1);
    return rand
}

let topics = [
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  },
    { suptitle : "Lorem, ipsum dolor", subtitle : "Lorem ipsum dolor sit, amet consectetur adipisicing elit.", topics : rand(), posts : rand(), nickname : "Legonian", timestamp : "Mar 12, 2017"  }
];

function createTopic(topics) {
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
        </div>
    `
}

const templates = topics.map( topic => createTopic(topic))

const html = templates.join(' ');

document.getElementById("topic").innerHTML = html;



