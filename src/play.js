var playState = {

    create: function () {

        /**
         * Set controls.
         */
        this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.keyHome = game.input.keyboard.addKey(Phaser.Keyboard.HOME);
        this.keyEnd = game.input.keyboard.addKey(Phaser.Keyboard.END);
        this.keyEsc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        /**
         * Load the map data.
         */
        this.tiledMap = game.cache.getJSON('level' + game.currentLevel);

        /**
         * Group the background layer to display everything else above it.
         */ 
        this.background = game.add.group();

        /**
         * Group the scene to make it depth sortable after each movement.
         */
        this.scene = game.add.group();

        /**
         * Store all tiles, houses and actors of the current map.
         */ 
        this.map = new Map();

        /**
         * Set the initial speed of the waves.
         */
        this.wavespeed = 1000;

        /**
         * Set the losing flag.
         */
        this.losing = false;

        /**
         * Draw each tile of the background.
         */ 
        this.tiledMap.layers[0].data.forEach(this.drawBackground, this);

        /**
         * Draw each tile of the scene.
         */ 
        this.tiledMap.layers[1].data.forEach(this.drawScene, this);

        /**
         * Delay the flood.
         */
        this.timer = game.time.create(false),
        this.timer.add(Phaser.Timer.SECOND * game.currentLevel * 6, 
            this.startFlood, this);
        this.lastMovement = 0;
        this.timer.start();

        /**
         * Set the timer text.
         */
        this.timerLabel = game.add.text(20, 20, '0:00', {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });

        /**
         * Set the fast forward button.
         */
        this.skipButton = game.add.text(110, 20, '⏭', {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });
        this.skipButton.inputEnabled = true;
        this.skipButton.events.onInputUp.add(this.skip, this);

        /**
         * Set the back button.
         */
        this.backButton = game.add.text(964, 20, '⏎', {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });
        this.backButton.inputEnabled = true;
        this.backButton.events.onInputUp.add(this.lose, this);

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

        /**
         * Set the restart button.
         */
        this.restartButton = game.add.text(844, 20, '⟳', {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });
        this.restartButton.inputEnabled = true;
        this.restartButton.events.onInputUp.add(this.restart, this);

        game.add.text(25, 525, '↑ ← ↓ → W A S D', {
            font: 'bold 14pt Arial',
            fill: '#fff'
        });
    },

    /**
     * Draws all the elements of the map that won't be acted upon.
     * The streets and the already flooded, inpassable areas of the city.
     */
    drawBackground: function (tile, i) {

        /**
         * Draw the tile at the isometric counterpart of its specified position.
         */ 
        new Tile(this.iToX(i), this.iToY(i), 0, tile - 1);
    },

    /** 
     * Translates a 1-dimensional index into an x coordinate of a 2-dimensional
     * map.
     * This function comes handy when a Tiled map, that stores the map data in
     * a 1-dimensional array, needs to be displayed in 2-dimensions.
     * It is used in drawBackground and drawScene.
     */
    iToX: function (i) {
        return i % this.tiledMap.width;
    },

    /** 
     * Translates a 1-dimensional index into an y coordinate of a 2-dimensional
     * map.
     * This function comes handy when a Tiled map, that stores the map data in
     * a 1-dimensional array, needs to be displayed in 2-dimensions.
     */
    iToY: function (i) {
        return Math.floor(i / this.tiledMap.width);
    },

    /**
     * Draws all the elements of the map that will be acted upon somehow.
     * The houses that will block the player and the flood's movement.
     * The player itself that will push the walls to the correct places.
     * And the walls the will stop the flood.
     */
    drawScene: function (tile, i) {

        /**
         * Set the tile at the isometric counterpart of its specified position.
         */
        var x = this.iToX(i), y = this.iToY(i);

        if (tile > 68) {

            /**
             * If the tile is a house draw and color it part by part.
             */ 
            new House(x, y, 1, tile, tile + 1, tile + 2);

        } else if (tile === 53) {

            /**
             * If the tile is a dozer draw it and set it as the player.
             */ 
            game.player = new Actor(x, y, 1, tile - 1);

        } else if (tile === 33 || tile === 34) {

            /**
             * If the tile is a wall draw it as is.
             */ 
            new Actor(x, y, 1, tile - 1);
        }
    },

    /**
     * Starts the flood by generating a wave actor on the top of the map and a
     * water actor behind each of it to make the raise of the water level 
     * seamless.
     */
    startFlood: function () {

        /**
         * Create a wave on each tile of the top of the map.
         */ 
        for (var i = 0; i < this.tiledMap.width; i += 1) {

            /**
             * Create the wave.
             */ 
             new Wave(i, 0, 0, 1, 44);
        }
    },

    update: function () {

        /**
         * Update the time left until the flood.
         */
        var time = Math.ceil(this.timer.duration / 1000);
        this.timerLabel.text = Math.floor (time / 60) + ':' 
            + (time % 60 < 10 ? '0' : '') + time % 60;

        /**
         * Draw the overlapping actors in the correct order.
         */ 
        this.scene.sort('y', Phaser.Group.SORT_ASCENDING);

        /**
         * If the player is already moving ignore the input.
         */ 
        if (game.tweens.isTweening(game.player.image)) {
            return false;
        }

        /**
         * Set the movement keys.
         */ 

        if (this.keyW.isDown || this.keyUp.isDown) {

            /**
             * Set the move up key.
             */ 
            game.player.move(0, -1, 54);

        } else if (this.keyS.isDown || this.keyDown.isDown) {

            /**
             * Set the move down key.
             */ 
            game.player.move(0, 1, 52);

        } else if (this.keyA.isDown || this.keyLeft.isDown) {

            /**
             * Set the move left key.
             */ 
            game.player.move(-1, 0, 55);

        } else if (this.keyD.isDown || this.keyRight.isDown) {

            /**
             * Set the move right key.
             */ 
            game.player.move(1, 0, 53);
        }        

        /**
         * Set the restart key.
         */
        if (this.keyHome.justDown) {
            this.restart();
        }

        /**
         * Set the forward key.
         */
        if (this.keyEnd.justDown) {
            this.skip();
        }

        /**
         * Set the back key.
         */
        if (this.keyEsc.justDown) {
            this.lose();
        }

        /**
         * Set the mute key.
         */
        if (this.keyM.justDown) {
            this.mute();
        }
    },

    skip: function () {
        this.timer.stop(true);
        this.wavespeed = 100;
        this.startFlood();
    },

    mute: function () {
        game.music.mute = !game.music.mute;
        this.muteButton.text = game.music.mute ? '🕨' : '🕪';
    },

    lose: function () {

        /**
         * Return to the menu.
         */
        game.currentLevel -= 1;
        game.state.start('menu');
    },

    restart: function () {

        /**
         * Return to the menu.
         */
        game.state.start('play');
    },

    win: function () {

        /**
         * Save the best time.
         */
        if (GJAPI.bActive) {
            GJAPI.ScoreAdd(
                (game.currentLevel - 1 ? 1 : 0) + game.currentLevel + 303221, 
                this.lastMovement, 
                Math.floor(this.lastMovement / 60) + ':' + 
                    (this.lastMovement % 60 < 10 ? '0' : '') + 
                    this.lastMovement % 60,
                game.currentLevel
            );
        } else {
            GJAPI.ScoreAddGuest(
                (game.currentLevel - 1 ? 1 : 0) + game.currentLevel + 303221,
                this.lastMovement,
                Math.floor(this.lastMovement / 60) + ':' +
                (this.lastMovement % 60 < 10 ? '0' : '') +
                this.lastMovement % 60,
                'Unnamed Hero',
                game.currentLevel
            );
        }
        if (!game.times[game.currentLevel - 1] ||
            game.times[game.currentLevel - 1].int > this.lastMovement) { 
            game.times[game.currentLevel - 1] = {
                int: this.lastMovement,
                string: Math.floor(this.lastMovement / 60) + ':' +
                    (this.lastMovement % 60 < 10 ? '0' : '') +
                    this.lastMovement % 60
            }
        }         

        this.sumTimes();

        /**
         * Unlock the next level if needed.
         */
        game.progress = Math.max(game.progress, game.currentLevel + 1);

        /**
         * Save the progress.
         */
        if (GJAPI.bActive) {
            GJAPI.DataStoreSet(
                GJAPI.DATA_STORE_USER,
                "progress",
                game.progress
            );
        }

        /**
         * Return to the menu.
         */
        game.state.start('menu');
    },

    sumTimes: function () {

        /**
         * Reset the total time.
         */
        game.totalTime = {
            int: 0,
            string: '0:00'
        };

        /**
         * Check the best time of all levels.
         */
        for (var i = 0; i < 20; i += 1) {

            /**
             * If the player already saved a time for the level.
             */
            if (game.times[i]) {

                /**
                 * Add the best level time to the total time.
                 */
                game.totalTime.int += game.times[i].int;

                /**
                 * Update the total time string with the current level and 
                 * total time.
                 */
                game.totalTime.string = (i + 1) + ' level' + (i ? 's' : '') +
                    ': ' + Math.floor(game.totalTime.int / 60) + ':' + 
                    (game.totalTime.int % 60 < 10 ? '0' : '') +
                    game.totalTime.int % 60

            /**
             * If the player did not yet saved a time for the level. 
             */
            } else {

                /**
                 * Add the hypothetically maximum time to the sum, but don't
                 * update the string and display the real total for the player.
                 */
                game.totalTime.int += (i + 1) * 12;
            }
        }
        if (GJAPI.bActive) {
            GJAPI.ScoreFetch(0, GJAPI.SCORE_ONLY_USER, 1, this.updateTotal);
        } else {
            GJAPI.ScoreAddGuest(
                0, 
                game.totalTime.int, 
                game.totalTime.string,
                'Unnamed Hero'
            );
        }
    },

    updateTotal: function (response) {
        if (response.success && response.scores[0]) {
            if (game.totalTime.int > parseInt(response.scores[0].sort, 10)) {
               return;
            }
        }
        GJAPI.ScoreAdd(0, game.totalTime.int, game.totalTime.string);
    }
}