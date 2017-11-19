var menuState = {
    create: function () {

        /**
         * Load the positions of the menu elements and set the menu screen.
         */
        var 
            buttons = [],
            graphics = game.add.graphics(0, 0),
            i,
            positions = game.cache.getJSON('menu'),
            texts = [];


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

        /**
         * Create a button for each level.
         */ 
        for (i = 0; i < positions.length; i += 1) {

            /**
             * Write the label of the button above the button.
             */
            texts[i] = game.add.text(0, 0, i + 1, {
                boundsAlignH: "center",
                boundsAlignV: "middle",
                fill: '#ff0',
                font: 'bold 30pt Arial'
            });
            texts[i].setTextBounds(positions[i].x, positions[i].y, 100, 50);

            /**
             * Draw the button of the level.
             */
            buttons[i] = game.add.button(
                positions[i].x, 
                positions[i].y + 50, 
                'menu', 
                function (button) {

                    /**
                     * Set the level to be started by the button.
                     */
                    game.currentLevel = button.data + 1;

                    /**
                     * Start the level.
                     */
                    game.state.start('play');
                },
                this
            );
            buttons[i].frame = i;
            buttons[i].data = i;

            /**
             * If the level is not unlocked disable the button.
             */
            if (game.progress < i + 1) {

                /**
                 * Grey out the label of the button.
                 */
                texts[i].fill = '#0005';

                /**
                 * Grey out and disable the button.
                 */
                buttons[i].tint = 0x000000;
                buttons[i].alpha = 0.3;
                buttons[i].inputEnabled = false;
            }
        }
    },

    mute: function () {
        game.music.mute = !game.music.mute;
        this.muteButton.text = game.music.mute ? '🕨' : '🕪';
    },
};