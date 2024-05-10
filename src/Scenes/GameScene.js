class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.balloons = [];
        this.bulletSpeed = -300;
        this.balloonSpeed = 100;
        this.shootDelay = 500; // Initial delay between shots
        this.lastShot = 0; // Time since last shot
    }

    preload() {
        // Assets should be loaded in BootScene
    }

    create() {
        this.createBackground();
        this.createPlayer();
        this.createControls();
        this.createBalloons();
        this.createPowerUps();
        this.score = 0;
        this.createScoreText();
        this.lives = 3;
        this.createLivesText();
    }

    createBackground() {
        this.add.image(400, 300, 'background');
    }

    createPlayer() {
        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);
    }

    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createBalloons() {
        this.time.addEvent({
            delay: 2500,
            callback: this.spawnBalloon,
            callbackScope: this,
            loop: true
        });
    }

    spawnBalloon() {
        let x = Phaser.Math.Between(50, 750);
        let isSpecial = Phaser.Math.Between(0, 100) > 98; // 2% chance for a special balloon
        let type = isSpecial ? 'special' : Phaser.Math.RND.pick(['large', 'medium', 'small']);
        this.createBalloon(x, 0, type);
    }

    createBalloon(x, y, type) {
        let balloon = this.physics.add.image(x, y, `balloon${this.capitalizeFirstLetter(type)}`);
        balloon.setData('type', type);
        balloon.setData('hits', { 'small': 1, 'medium': 2, 'large': 3, 'special': 1 }[type]);
        balloon.setVelocityY(this.balloonSpeed);
        this.balloons.push(balloon);
        this.updateBalloonSize(balloon, type); // Set the size based on type
    }

    createPowerUps() {
        this.time.addEvent({
            delay: 15000, // Power-ups appear every 15 seconds
            callback: () => {
                let x = Phaser.Math.Between(50, 750);
                let powerUp = this.physics.add.image(x, 0, 'powerUp1');
                powerUp.setScale(2.0);
                powerUp.setVelocityY(50);
                this.physics.add.overlap(this.player, powerUp, this.activateRapidFire, null, this);
            },
            callbackScope: this,
            loop: true
        });
    }

    activateRapidFire(player, powerUp) {
        powerUp.destroy();
        this.shootDelay = 250; // Decrease shooting delay for rapid fire
        this.time.delayedCall(5000, () => { // After 5 seconds, reset shoot delay
            this.shootDelay = 500;
        }, [], this);
    }

    updateBalloonSize(balloon, type) {
        const scaleSizes = { 'small': 0.5, 'medium': 0.75, 'large': 1.0, 'special': 1.2 };
        balloon.setScale(scaleSizes[type]);
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    createScoreText() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    }

    createLivesText() {
        this.livesText = this.add.text(16, 50, 'Lives: 3', { fontSize: '32px', fill: '#fff' });
    }

    update(time) {
        this.handlePlayerMovement();
        if (time > this.lastShot + this.shootDelay) {
            this.handleShooting(time);
        }
        this.handleCollisions();
        this.cleanupBalloons();
    }

    handlePlayerMovement() {
        this.player.setVelocityX(0);
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        }
    }

    handleShooting(time) {
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            let bullet = this.physics.add.image(this.player.x, this.player.y, 'bullet');
            bullet.setVelocityY(this.bulletSpeed);
            this.lastShot = time; // Update last shot time
            this.sound.play('shoot');
            this.physics.add.overlap(bullet, this.balloons, this.hitBalloon, null, this);
        }
    }

    handleCollisions() {
        this.balloons.forEach(balloon => {
            if (balloon.y > 600) {
                balloon.destroy();
                this.lives--;
                this.livesText.setText(`Lives: ${this.lives}`);
                if (this.lives <= 0) {
                    this.scene.start('GameOverScene', { score: this.score });
                }
            }
        });
    }

   
    hitBalloon(bullet, balloon) {
        bullet.destroy();
        let hitsLeft = balloon.getData('hits') - 1;
        balloon.setData('hits', hitsLeft);
    
        if (hitsLeft > 0) {
            this.sound.play('deflate'); // Play deflating sound
            let nextType = this.getNextBalloonType(balloon.getData('type'));
            if (nextType) {
                balloon.setTexture(`balloon${this.capitalizeFirstLetter(nextType)}`);
                balloon.setData('type', nextType);
                this.updateBalloonSize(balloon, nextType);
            }
        } else {
            if (balloon.getData('type') === 'small') {
                if (Math.random() < 0.05) {  // 5% chance
                    this.createSpecialBalloon(balloon.x, balloon.y);
                } else {
                    this.popBalloon(balloon);
                }
            } else {
                this.popBalloon(balloon);
            }
        }
    }
    
    createSpecialBalloon(x, y) {
        let specialBalloon = this.physics.add.image(x, y, 'balloonSpecial');
        specialBalloon.setData('type', 'special');
        specialBalloon.setData('hits', 1);  // Requires one hit to pop
        specialBalloon.setVelocityY(this.balloonSpeed);
        this.updateBalloonSize(specialBalloon, 'special');
        this.balloons.push(specialBalloon);
    }
    
    updateBalloonSize(balloon, type) {
        const scaleSizes = { 'small': 0.5, 'medium': 0.75, 'large': 1.0, 'special': 1.0 };
        balloon.setScale(scaleSizes[type]);
    }
    
    popBalloon(balloon) {
        this.sound.play('pop'); // Play popping sound
        balloon.destroy();
        let scoreIncrement = 10; // Default score increment for regular balloons
    
        if (balloon.getData('type') === 'special') {
            scoreIncrement = 100; // Special balloons give 100 points
        }
    
        this.score += scoreIncrement;
        this.scoreText.setText(`Score: ${this.score}`);
    }
    
    
    
    spawnSpecialBalloon(x, y) {
        let specialBalloon = this.physics.add.image(x, y, 'balloonSpecial');
        specialBalloon.setVelocityY(this.balloonSpeed);
        specialBalloon.setScale(1.0);  // Adjust the size as needed
        specialBalloon.setInteractive();
        specialBalloon.on('pointerdown', () => {
            this.sound.play('pop');  // Optional: Play a special sound
            specialBalloon.destroy();
            this.score += 100;  // Grant additional 100 points
            this.scoreText.setText(`Score: ${this.score}`);
        });
    }
    

    getNextBalloonType(currentType) {
        const types = { 'large': 'medium', 'medium': 'small', 'small': null, 'special': null };
        return types[currentType];
    }

    cleanupBalloons() {
        this.balloons = this.balloons.filter(balloon => balloon.active);
    }
}
