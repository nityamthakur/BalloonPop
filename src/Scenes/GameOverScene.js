class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        // Ensure that data.score is defined and is a number
        this.finalScore = typeof data.score === 'number' ? data.score : 0;
    }

    create() {
        // Display "Game Over" text
        this.add.text(400, 200, 'Game Over', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);

        // Display the player's score
        this.add.text(400, 250, 'Score: ' + this.finalScore, { fontSize: '24px', fill: '#FFF' }).setOrigin(0.5);

        // Calculate and display high score
        const storedHighScore = localStorage.getItem('highScore');
        const highScore = Math.max(this.finalScore, parseInt(storedHighScore, 10) || 0); // Safely parse the high score
        localStorage.setItem('highScore', highScore.toString()); // Store the new high score

        this.add.text(400, 300, 'High Score: ' + highScore, { fontSize: '24px', fill: '#FFF' }).setOrigin(0.5);

        // Add a "Play Again" button
        const playAgainButton = this.add.text(400, 350, 'Play Again', { fontSize: '24px', fill: '#FFF' })
            .setInteractive()
            .setOrigin(0.5);
        playAgainButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Add a "Return to Menu" button
        const returnMenuButton = this.add.text(400, 400, 'Return to Menu', { fontSize: '24px', fill: '#FFF' })
            .setInteractive()
            .setOrigin(0.5);
        returnMenuButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });

        // Center all elements
        this.cameras.main.centerOn(400, 300);
    }
}
