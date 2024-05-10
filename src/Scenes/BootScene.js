class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Set the path for all assets
        this.load.setPath('./assets/');

        // Load images
        this.load.image('player', 'player.png'); // Load the player sprite
        this.load.image('balloonSmall', 'balloon_small.png');
        this.load.image('balloonMedium', 'balloon_medium.png');
        this.load.image('balloonLarge', 'balloon_large.png');
        this.load.image('bullet', 'bullet.png');
        this.load.image('background', 'background.png'); // Background image

        this.load.image('balloonSpecial', 'balloon_special.png');
        this.load.image('powerUp1', 'powerup1.png'); // Rapid fire
     

        // Load sounds
        this.load.audio('pop', 'pop.ogg');
        this.load.audio('deflate', 'deflate.ogg');
        this.load.audio('shoot', 'shooting.ogg');
        this.load.audio('powerUpCollect', 'collect.ogg'); // Sound for collecting a power-up
        this.load.audio('powerUpUse', 'use.ogg'); // Sound for using a power-up

        // Load any other UI elements or enemy types if available
        // e.g., this.load.image('enemyTypeTwo', 'enemyTypeTwo.png');

        // Display loading progress
    //     const loadingText = this.add.text(20, 20, 'Loading...', { fontSize: '20px', fill: '#FFFFFF' });
    //     this.load.on('progress', (progress) => {
    //         loadingText.setText(`Loading: ${Math.round(progress * 100)}%`);
    //     });
    
    //     document.getElementById('startButton').addEventListener('click', function() {
    //         game.sound.context.resume().then(() => {
    //             console.log('AudioContext resumed successfully');
    //     });
    // });
        
    }

    create() {
        // All assets are loaded, transition to the main menu
        this.scene.start('MainMenuScene');
    }
}
