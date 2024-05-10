class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create() {
        // Background
        this.add.image(400, 300, 'background');

        // Title
        this.title = this.add.text(400, 100, 'Balloon Pop', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Menu Options
        this.playText = this.add.text(400, 200, 'Play', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.startGame());

        this.highScoreText = this.add.text(400, 250, 'High Score', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.showHighScore());

        this.helpText = this.add.text(400, 300, 'Help', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.toggleHelp());

        // Align Text
        [this.playText, this.highScoreText, this.helpText].forEach(text => {
            text.setOrigin(0.5);
        });

        // High Score Display Text
        this.highScoreDisplay = this.add.text(400, 350, '', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.highScoreDisplay.visible = false;

        // Help information text
        this.helpInfoText = this.add.text(400, 400, '', { fontSize: '20px', fill: '#fff', align: 'center' })
            .setOrigin(0.5);
        this.helpInfoText.visible = false;
    }

    startGame() {
        // Start the GameScene
        this.scene.start('GameScene');
    }

    toggleHelp() {
        // Toggle the visibility of help information
        this.helpInfoText.visible = !this.helpInfoText.visible;
        if (this.helpInfoText.visible) {
            this.helpInfoText.setText("Controls:\n- Left Arrow: Move Left\n- Right Arrow: Move Right\n- Spacebar: Shoot\n\nPower-ups:\n- Rapid Fire: Allows faster shooting for a limited time.\n\nAvoid the balloons and try to pop them!");
        } else {
            this.helpInfoText.setText('');
        }
    }

    showHighScore() {
        // Retrieve high score from local storage and display it
        const highScore = localStorage.getItem('highScore') || '0';
        this.highScoreDisplay.setText(`High Score: ${highScore}`);
        this.highScoreDisplay.visible = true;
    }
}
