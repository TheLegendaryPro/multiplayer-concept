import sceneEvents from "./eventcenter.js";

export default class GameUI extends Phaser.Scene {
    constructor() {
        super("game-ui");
    }

    create() {

        this.textContainer = this.add.container(screen.gameWidth * 0.5, screen.gameHeight * 0.8)

        this.textBox = this.add.image(0, 0, "textbox").setInteractive()
        this.textBox.setDepth(1)
        this.textBox.setDisplaySize(screen.gameWidth * 0.8, screen.gameHeight * 0.15)
        this.textBox.setAlpha(0.7)

        var temp1 = this.textBox.getTopLeft()

        this.charPerLine = screen.gameWidth * 0.7 * 0.118

        this.textMessage = this.add.text(temp1.x + 5, temp1.y + 5, "", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })


        // var rawTextMessage = "BitmapText objects are less flexible than Text objects, in that they have less features such as shadows, fills and the ability to use Web Fonts, however you trade this flexibility for rendering speed. You can also create visually compelling BitmapTexts by processing the font texture in an image editor, applying fills and any other effects required."
        //
        // var arrayOfLines = fold(rawTextMessage, charPerLine);
        // var foldedString = arrayOfLines.join('\n');


        this.textContainer.visible = false

        this.textContainer.add(this.textBox)
        this.textContainer.add(this.textMessage)

        this.textBox.on('pointerdown', pointer => {
            this.updateChat()
        })

        sceneEvents.on("startDialog", this.startMonolog, this)
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