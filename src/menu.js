var menuState = {
    create: function () {
 
        /**
         * Set the background color
         */ 
        game.stage.backgroundColor = "#1caeff";
        
        /**
         * Create a button for level 1
         */ 
        game.add.text(0, 0, '1', {
            boundsAlignH: "center",
            boundsAlignV: "middle",
            fill: '#ff0',
            font: 'bold 30pt Arial'
        }).setTextBounds(50, 50, 100, 50);;
        var level1 = game.add.image(50, 100, 'menu', 1);
        level1.inputEnabled = true;
        level1.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level1');
            game.state.start('play');
        }, this);

        /**
         * Create a button for level 2
         */
        game.add.text(0, 0, '2', {
            boundsAlignH: "center",
            boundsAlignV: "middle",
            fill: '#ff0',
            font: 'bold 30pt Arial'
        }).setTextBounds(100, 150, 100, 50);;
        var level2 = game.add.image(100, 200, 'menu', 2);
        level2.inputEnabled = true;
        level2.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level2');
            game.state.start('play');
        }, this);

        /**
         * Create a button for level 3
         */
        game.add.text(0, 0, '3', {
            boundsAlignH: "center",
            boundsAlignV: "middle",
            fill: '#ff0',
            font: 'bold 30pt Arial'
        }).setTextBounds(200, 100, 100, 50);;
        var level3 = game.add.image(200, 150, 'menu', 3);
        level3.inputEnabled = true;
        level3.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level3');
            game.state.start('play');
        }, this);

        /**
         * Create a button for level 4
         */
        game.add.text(0, 0, '4', {
            boundsAlignH: "center",
            boundsAlignV: "middle",
            fill: '#ff0',
            font: 'bold 30pt Arial'
        }).setTextBounds(300, 200, 100, 50);;
        var level4 = game.add.image(300, 250, 'menu', 4);
        level4.inputEnabled = true;
        level4.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level4');
            game.state.start('play');
        }, this);

        /**
         * Create a button for level 5
         */
        game.add.text(0, 0, '5', {
            boundsAlignH: "center",
            boundsAlignV: "middle",
            fill: '#ff0',
            font: 'bold 30pt Arial'
        }).setTextBounds(350, 100, 100, 50);;
        var level5 = game.add.image(350, 150, 'menu', 5);
        level5.inputEnabled = true;
        level5.events.onInputUp.add(function () {
            game.tiledMap = game.cache.getJSON('level5');
            game.state.start('play');
        }, this);
    }
};