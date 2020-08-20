import sceneEvents from "./eventcenter.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export default class GameUI extends Phaser.Scene {
    constructor() {
        super("game-ui");
    }

    create() {

        // Create a text container
        this.textContainer = this.add.container(screen.gameWidth * 0.5, screen.gameHeight * 0.8)
        // Add a text box, and set its attributes
        this.textBox = this.add.image(0, 0, "textbox").setInteractive()
        this.textBox.setDepth(1)
        this.textBox.setDisplaySize(screen.gameWidth * 0.8, screen.gameHeight * 0.15)
        this.textBox.setAlpha(0.7)
        // Set variables related to text box
        var temp1 = this.textBox.getTopLeft()
        this.charPerLine = screen.gameWidth * 0.7 * 0.118
        this.textMessage = this.add.text(temp1.x + 5, temp1.y + 5, "", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
        // Includes the things in the text container, the set it to invisible
        this.textContainer.visible = false
        this.textContainer.add(this.textBox)
        this.textContainer.add(this.textMessage)

        this.textBox.on('pointerdown', pointer => {
            this.updateChat()
        })

        // Set up the map indicator
        this.mapIndicator = this.add.text(20, 20, "adfasdfadsf")
        this.mapIndicator.setAlpha(0)

        sceneEvents.on("startDialog", this.startMonolog, this)
        sceneEvents.on("changeMap", this.indicateMap, this)
    }

    async indicateMap (mapName) {
        this.mapIndicator.text = "Now loading " + mapName
        for(var i = 0; i < 99; i ++) {
            await sleep(20)
            this.mapIndicator.setAlpha(i/100)
        }
        for(var i = 99; i > 1; i--) {
            await sleep(20)
            await this.mapIndicator.setAlpha(i/100)
        }
        await this.mapIndicator.setAlpha(0)

    }

    test () {
        console.log("test")
    }

    startMonolog (arrayOfString) {
        this.textQueue = []
        arrayOfString.reverse().forEach( item => {
            this.textQueue.push(item)
        })
        this.updateChat()
    }

    updateChat () {
        if (this.textQueue.length) {
            this.textContainer.setVisible(true)
            var displayText = this.textQueue.pop()
            var arrayOfLines = fold(displayText, this.charPerLine);
            var foldedString = arrayOfLines.join('\n')
            this.textMessage.setText(foldedString)
        } else {
            this.textContainer.setVisible(false)
        }
    }

    // startMonolog (arrayOfString) {
    //     this.textContainer.setVisible(true)
    //     arrayOfString.forEach(line => {
    //         var arrayOfLines = fold(line, this.charPerLine);
    //         var foldedString = arrayOfLines.join('\n');
    //         this.textMessage.setText(foldedString)
    //         this.textContainer.on('pointerdown', pointer => {
    //             console.log("hi")
    //             return
    //         })
    //     })
    //     this.textContainer.setVisible(true)
    // }

    update() {

    }
}

function fold(input, lineSize, lineArray) {
    lineArray = lineArray || [];
    if (input.length <= lineSize) {
        lineArray.push(input);
        return lineArray;
    }
    lineArray.push(input.substring(0, lineSize));
    var tail = input.substring(lineSize);
    return fold(tail, lineSize, lineArray);
}