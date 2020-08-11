var credit_list = [
    {
        title: "This item",
        description: "A very long long long string that describes how it is useful",
        name: "this guy",
        link: "#"
    },
    {
        title: "The second item",
        description: "Another line of text",
        name: "that guy",
        link: "#"
    }
]

function shuffle(array) {
    array.sort(() => Math.random() - 0.5)
}

shuffle(credit_list)

let credit_html = ""
credit_list.forEach( credit => {
    let html_list = []
    html_list.push("<div class=\"credit\"><h2>")
    html_list.push(credit.title)
    html_list.push("</h2><p>")
    html_list.push(credit.description)
    html_list.push("</p><a href=\"")
    html_list.push(credit.link)
    html_list.push("\"><h3>")
    html_list.push(credit.name)
    html_list.push("</h3></a></div>")
    credit_html += html_list.join("")
})


document.getElementById("credits").innerHTML= credit_html