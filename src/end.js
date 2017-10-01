var endState = {
    create: function () {
        
        // Display dry street score
        game.add.image(40, 40, 'tileset', 1);
        game.add.text(80, 40, ' * ' + game.dryStreets + ' = ' + game.dryStreets * 10, {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });

        // Display unplaced barricade score
        game.add.image(40, 120, 'tileset', 18);
        game.add.text(80, 120, ' * ' + game.barricades + ' = ' + game.barricades * 2, {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });

        // Display unused time score
        game.add.text(60, 200, '0:0' + game.lastAction + ' = ' + game.lastAction, {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });

        // Calculate total high score
        game.highScores[game.currentLevel] = 
            game.dryStreets * 10 + 
            game.barricades * 2 + 
            game.lastAction;

        // Unlock the next level if needed
        if (game.highScores[game.currentLevel] > 30) {
            game.progress = Math.max(game.progress, game.currentLevel + 1);
        }

        // Display total high score
        game.add.text(40, 220, '______\n' + game.highScores[game.currentLevel], {
            font: 'bold 45pt Arial',
            fill: '#fff',
            align: 'center'
        });

        // Create the back button
        game.add.button(720, 40, 'tileset', function () {
            game.state.start('menu');
        }, this, 111, 110);
    }
};