// Import Phaser if using a module-based setup, otherwise assume it is included globally
// import Phaser from 'phaser'; 

"use strict"

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game', // Ensure there's a div with id="game-container" in your HTML or remove this line
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MainMenuScene, GameScene, GameOverScene]

    // scene: [
    //     Boot,
    //     MainMenu,
    //     Game,
    //     GameOver
    //     // Add other scenes as needed
    // ]
}
const game = new Phaser.Game(config);
//game.scene.start(BootScene);


// Define scene classes if not imported




