var menuState = {
    create: function () {

        // Create waves
        game.waves = game.add.group();
        for (var i = 0; i < 18; i += 1) {
            game.wave = game.waves.create(i * 60 + 340, i * 30 - 230, 'wave');
            game.wave.animations.add('move');
            game.wave.animations.play('move', 120, true);
        }
 
        // Set the background color
        game.stage.backgroundColor = "#1caeff";
        
        // Create a button for each level
        game.levels.forEach(function (level, i) {

            // Create a button in the next position with the next texture
            var button = game.add.button(
                (i % 5) * 80 + 40,
                Math.floor(i / 5) * 120 + 40,
                'ui',
                function () {
                    game.currentLevel = arguments[0].data;
                    game.state.start('play');
                },
                this,
                80 + i,
                20 + i
            );

            // Add the level index to the button
            button.data = i;

            // Disable the button of the levels that haven't been unlocked yet
            if (game.progress < i) {

                // Disable the input events
                button.inputEnabled = false;

                // Set the texture as disabled
                button.setFrames(50 + i, 50 + i);
            }

            // Create a level high score text under the level button
            game.add.text(
                (i % 5) * 80 + 40,
                Math.floor(i / 5) * 120 + 90,
                game.highScores[i], {
                    font: 'bold 30pt Arial',
                    fill: '#fff',
                    boundsAlignH: 'center',
                    boundsAlignV: 'middle'
                }
            ).setTextBounds(0, 0, 40, 40);
        }, this);

        // Create a total high score text
        game.add.text(40, 340, '___________\n' + (function () {
            var
                i,
                totalHighScore = 0;

            // Add the high score of each level to the total high score
            for (i = 0; i < game.highScores.length; i += 1) {

                // Add the high score of the level to the total high score if possible
                totalHighScore += game.highScores[i] || 0;
            }
            return totalHighScore;
        })(), {
                font: 'bold 45pt Arial',
                fill: '#fff',
                align: 'center',
                boundsAlignH: 'right',
                boundsAlignV: 'middle'
            });
    },
    update: function () {
        game.waves.setAll('x', 1, '', '', 2);
        game.waves.setAll('y', 0.5, '', '', 1);
    }
};