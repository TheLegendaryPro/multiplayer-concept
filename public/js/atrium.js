// let config = {
//     active: false
// }

// let atrium = new Phaser.Scene(config)
//
// atrium.preload = function () {
//     this.load.setBaseURL('http://labs.phaser.io');
//
//     this.load.image('sky', 'assets/skies/space3.png');
//     this.load.image('logo', 'assets/sprites/phaser3-logo.png');
//     this.load.image('red', 'assets/particles/red.png');
// };
//
// atrium.create = function () {
//     this.add.image(400, 300, 'sky');
//
//     // var particles = this.add.particles('red');
//     //
//     // var emitter = particles.createEmitter({
//     //     speed: 100,
//     //     scale: { start: 1, end: 0 },
//     //     blendMode: 'ADD'
//     // });
//
//     var logo = this.physics.add.image(400, 100, 'logo');
//
//     logo.setVelocity(100, 200);
//     logo.setBounce(1, 1);
//     logo.setCollideWorldBounds(true);
//
//     emitter.startFollow(logo);
// }
//
// export default atrium

export default class Atrium extends Phaser.Scene {
    constructor() {
        super('Atrium');
    }

    preload ()
    {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }

    create ()
    {
        this.add.image(400, 300, 'sky');

        var particles = this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }
}