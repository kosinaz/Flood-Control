var menuState = {
    create: function () {
 
        // Set the background color
        game.stage.backgroundColor = "#1caeff";
        
        // Create a button for each level
        var level1 = game.add.text(100, 100, '1', {
            font: 'bold 60pt Arial',
            fill: '#f00'
        });
        level1.inputEnabled = true;
        level1.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level1');
            game.state.start('play');
        }, this);
        var level2 = game.add.text(200, 100, '2', {
            font: 'bold 60pt Arial',
            fill: '#f00'
        });
        level2.inputEnabled = true;
        level2.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level2');
            game.state.start('play');
        }, this);
        var level3 = game.add.text(300, 100, '3', {
            font: 'bold 60pt Arial',
            fill: '#f00'
        });
        level3.inputEnabled = true;
        level3.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level3');
            game.state.start('play');
        }, this);
        var level4 = game.add.text(400, 100, '4', {
            font: 'bold 60pt Arial',
            fill: '#f00'
        });
        level4.inputEnabled = true;
        level4.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level4');
            game.state.start('play');
        }, this);
        var level5 = game.add.text(500, 100, '5', {
            font: 'bold 60pt Arial',
            fill: '#f00'
        });
        level5.inputEnabled = true;
        level5.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level5');
            game.state.start('play');
        }, this);
    }
};