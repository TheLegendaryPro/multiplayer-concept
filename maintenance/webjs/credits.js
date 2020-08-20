var credit_list = [
    {
        title: "Map: Atrium",
        description: "The HKUST Jockey Club Atrium is a sheltered open space located in the center of the University. It is a central meeting place, a hub of activities as well as the venue for some of the most significant events of the University. On a daily basis, it is the crossroad of the University, from which students gain access to the Academic Concourse and the Lee Shau Kee Campus.",
        name: "Modeled by Chit",
        link: "contact.html"
    },
    {
        title: "Map: Academic Concourse (Lower)",
        description: "HKUST’s Chia-Wei Woo Academic Concourse was named after the first president of the University, Professor Chia-Wei Woo. Via the Academic Concourse, students gain access to different lecture theatres and classrooms. The Science Commons is also located at the Academic Concourse (Lower). The Commons provide informal space for students from designated Schools to study, gather for meetings, or just relax.",
        name: "Modeled by Chit",
        link: "contact.html"
    },
    {
        title: "Map: Cheng Yu Tung Building",
        description: "The place where you pass through when you go to South Gate",
        name: "Modeled by Chit",
        link: "contact.html"
    },
    {
        title: "Map: Academic Concourse (Upper), LG5",
        description: "HKUST’s Chia-Wei Woo Academic Concourse was named after the first president of the University, Professor Chia-Wei Woo. Via the Academic Concourse, students gain access to different lecture theatres and classrooms. The Engineering Commons is also located at the Academic Concourse (Upper). The Commons provide informal space for students from designated Schools to study, gather for meetings, or just relax.",
        name: "Modeled by William",
        link: "#"
    },
    {
        title: "Map: LG5",
        description: "The place where you eat McDonald's and have student meetings",
        name: "Modeled by William",
        link: "#"
    },
    {
        title: "Map: Fire Chicken",
        description: "The icon of HKUST, you're going to see it if you enter from North Gate",
        name: "Modeled by Kaming",
        link: "#"
    },
    {
        title: "Map: Frog Road",
        description: "Aka North Gate, where you enter HKUST if you come from Hang Hao",
        name: "Modeled by Atrium",
        link: "#"
    },
    {
        title: "Map: Bridge Link",
        description: "The place you pass through if you are going to hall",
        name: "Modeled by Atrium",
        link: "#"
    },
    {
        title: "Map: South Gate",
        description: "where you enter HKUST if you come from Choi Hung",
        name: "Modeled by Leon",
        link: "#"
    },
    {
        title: "Map: Business building",
        description: "The Lee Shau Kee Business Building (LSKBB) is located in the University’s southern campus, known as the Lee Shau Kee Campus. The majority of the business courses would have class in the LSKBB and all business Departments are accommodated in this building.",
        name: "Modeled by Leon",
        link: "#"
    },
    {
        title: "Application: Tiled Map Editor",
        description: "The application used to create these beautiful maps, it is easy to use and can be used for free, while you can pay to support it too",
        name: "Created by Thorbjørn - click to enter website",
        link: "https://www.mapeditor.org/"
    },
    {
        title: "Application: Tilesetter",
        description: "The application used to create tilesets to paint those maps, there is a premium and a free version available",
        name: "Created by Led - click to enter website",
        link: "https://led.itch.io/tilesetter"
    },
    {
        title: "Application: Tilesetter",
        description: "The application used to create tilesets to paint those maps, there is a premium and a free version available",
        name: "Created by Led - click to enter website",
        link: "https://led.itch.io/tilesetter"
    },
    {
        title: "Tutorial: Dungeon Crawler in Phaser 3",
        description: "I followed these tutorials a lot, it taught me how to add maps, create movements, add gui and more",
        name: "Created by Ourcade - click to enter Youtube channel",
        link: "https://www.youtube.com/channel/UCJyrgLkI9LcwzUhZXxrwpyA"
    },
    {
        title: "Tutorial: How to make a multiplayer online game",
        description: "I followed this tutorial to learn how to create a multiplayer online game with Phaser, Socket.io and Node.js, as well as compressing packets",
        name: "Created by Jérôme - click to enter website",
        link: "https://www.dynetisgames.com/"
    },
    {
        title: "Application: Free Texture Packer",
        description: "An open source tool that allows you to pack multiple images into one atlas for you games or sites. I used it to create some characters",
        name: "Created by Odrick - click to enter website",
        link: "http://free-tex-packer.com/"
    },
    {
        title: "Tutorial: How to make a multiplayer online game",
        description: "I followed this tutorial to learn how to create a multiplayer online game with Phaser, Socket.io and Node.js, as well as compressing packets",
        name: "Created by Jérôme - click to enter website",
        link: "https://www.dynetisgames.com/"
    },
    {
        title: "Framework: Phaser.io",
        description: "This framework is used to create the game, it has a lot of examples and tutorials so it is relatively easy to work with, it is also very powerful",
        name: "Created by Photon Storm Ltd.",
        link: "https://phaser.io/"
    },
    {
        title: "Framework: Socket.io",
        description: "It is used for the communication between the server and client, so that we can see the movements of other players, it is easy to use",
        name: "Created by Socket.IO",
        link: "https://socket.io/"
    },
    {
        title: "Art: Fauna",
        description: "The art used for the female character",
        name: "Created by ansimuz",
        link: "https://ansimuz.itch.io/legend-of-faune"
    },
    {
        title: "Art: Boy",
        description: "The art used for the male character",
        name: "Created by ArMM1998",
        link: "https://opengameart.org/users/armm1998"
    }
]

function shuffle(array) {
    array.sort(() => Math.random() - 0.5)
}

shuffle(credit_list)

let credit_html = ""

if (screen.availWidth < 1000) {
    console.log("smaller than 1000")
    credit_list.forEach(credit => {
        let html_list = []
        html_list.push("<div class=\"credit\"><h2>")
        html_list.push(credit.title)
        html_list.push("</h2><p>")
        html_list.push(credit.description)
        html_list.push("</p><a href=\"")
        html_list.push(credit.link)
        html_list.push("\" target=\"_blank\" ><h3>")
        html_list.push(credit.name)
        html_list.push("</h3></a></div>")
        credit_html += html_list.join("")
    })
} else {
    console.log("bigger than 1000")
    credit_html += "<table>"
    var line_counter = 0
    credit_list.forEach(credit => {
        // console.log(credit.title)
        if (line_counter++ == 0) {
            credit_html += "<tr>"
        }
        credit_html += "<td>"
        let html_list = []
        html_list.push("<div class=\"credit\"><h2>")
        html_list.push(credit.title)
        html_list.push("</h2><p>")
        html_list.push(credit.description)
        html_list.push("</p><a href=\"")
        html_list.push(credit.link)
        html_list.push("\" target=\"_blank\" ><h3>")
        html_list.push(credit.name)
        html_list.push("</h3></a></div>")
        credit_html += html_list.join("")
        credit_html += "</td>"
        if (line_counter == 2) {
            line_counter = 0
            credit_html += "</tr>"
        }
        console.log(credit_html)
    })
    if (credit_html.endsWith("</td>")) {
        credit_html += "</tr>"
    }
    credit_html += "</table>"

}


document.getElementById("credits").innerHTML = credit_html