var menuState = {

    create: function () {

        /**
         * Set controls.
         */
        this.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);

        game.add.image(162, 25, 'title');

        /**
         * Set the mute button.
         */
        this.muteButton = game.add.text(904, 20, '🕪', {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });
        this.muteButton.text = game.music.mute ? '🕨' : '🕪';
        this.muteButton.inputEnabled = true;
        this.muteButton.events.onInputUp.add(this.mute, this);

        this.labelStyle = {
            boundsAlignH: "center",
            boundsAlignV: "middle",
            fill: '#ff0',
            font: 'bold 14pt Arial',
            align: "center"
        }

        game.add.text(40, 525, '← ↵ →', {
            font: 'bold 14pt Arial',
            fill: '#fff'
        });

        this.texts = [];

        this.buttons = [];

        /**
         * Create a button for each level.
         */ 

        game.cache.getJSON('levels').forEach(this.addLevelButton, this);

        this.dozer = game.add.image(0, 0, 'tileset', 52);
        this.dozer.scale = new PIXI.Point(0.75, 0.75);;

        this.totalTimeLabel = game.add.text(0, 0, '', {
            boundsAlignH: "center",
            boundsAlignV: "middle",
            fill: '#ff8',
            font: 'bold 30pt Arial',
            align: "center"
        });
        this.totalTimeLabel.setTextBounds(400, 250, 200, 100);

    },
    
    addLevelButton: function(level, i) {
        
        /**
         * Write the label of the button above the button.
         */
        this.texts[i] = game.add.text(0, 0, (i + 1) + '\n', this.labelStyle);  
        this.texts[i].setTextBounds(level.x, level.y, 100, 50);

        if (game.progress < i + 1) {
            
            /**
             * Grey out the label of the button.
             */
            this.texts[i].fill = '#0005';
        } 

        /**
         * Draw the button of the level.
         */
        this.buttons[i] = 
            game.add.button(level.x, level.y + 50, 'menu', this.start);
        this.buttons[i].frame = i;
        this.buttons[i].data = i;

        /**
         * If the level is not unlocked disable the button.
         */
        if (game.progress < i + 1) {

            /**
             * Grey out and disable the button.
             */
            this.buttons[i].tint = 0x000000;
            this.buttons[i].alpha = 0.3;
            this.buttons[i].inputEnabled = false;
        } 
    },

    start: function (button) {

        /**
         * Set the level to be started by the button.
         */
        game.currentLevel = button.data + 1;

        /**
         * Start the level.
         */
        game.state.start('play');
    },

    mute: function () {
        game.music.mute = !game.music.mute;
        this.muteButton.text = game.music.mute ? '🕨' : '🕪';
    },

    update: function () {
        this.texts.forEach(this.updateTime, this);

        if (game.totalTime) {
            this.totalTimeLabel.text = 'Total\n' + game.totalTime.string;
        }

        if (this.keyLeft.justDown) {

            /**
             * Set the move left key.
             */
            game.currentLevel = Math.max(game.currentLevel - 1, 0);

        } else if (this.keyRight.justDown) {

            /**
             * Set the move right key.
             */
            game.currentLevel = 
                Math.min(game.currentLevel + 1, game.progress - 1, 19);

        } else if (this.keyEnter.justDown) {

            /**
             * Set the start key.
             */
            this.start(this.buttons[game.currentLevel]);
        }
        if (game.currentLevel < 20) {
            this.dozer.x = this.buttons[game.currentLevel].x + 12;
            this.dozer.y = this.buttons[game.currentLevel].y - 22;
        }        
        
        /**
         * Set the mute key.
         */
        if (this.keyM.justDown) {
            this.mute();
        }
    },

    updateTime: function (time, i) {
        if (game.times[i]) {
            time.text = (i + 1) + '\n' + game.times[i].string;
        }
    }
};