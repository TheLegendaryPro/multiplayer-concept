var blog_list = [
    {
        title: "Initial Release",
        date: "2020-8-14",
        content: ["The reason I decided to develop this game late July is knowing that we will not have lessons on campus, students, especially freshmen, would not be able to experience campus life. Campus life includes exploring different parts of the university, meeting and greeting others when you switch between classrooms and getting lost within the campus. I wanted to recreate this experience for all members of UST, including freshmen, therefore I started working on this plan.",
            "Looking back, this project took about two weeks of work. From looking into platforms and frameworks I can develop my game on, which I chose web-based phaser.io because it is accessible and popular. To search for different tutorials on various topics, including multiplayer feature, dungeon-based games, various RPGs, equipping me with the knowledge of creating such a game. And at last, completing the puzzle with the help of others by having different UST maps, a website and running multiplayer game mechanics.",
            "I hope you enjoy my work. If there are any comments, suggestions or other related stuff, please don't hesitate to <a href=\"contact.html\">tell me</a> about it."
        ]
    },
]

let blog_html = ""

blog_list.reverse().forEach( post=> {
    let html_list = []
    html_list.push("<div id=\"post\"><h1>")
    html_list.push(post.title)
    html_list.push("</h1><h2>")
    html_list.push(post.date)
    html_list.push("</h2>")
    post.content.forEach( paragraph => {
        html_list.push("<p>")
        html_list.push(paragraph)
        html_list.push("</p>")
    })
    html_list.push("</div>")
    blog_html += html_list.join("")
})

document.getElementById("blog").innerHTML = blog_html