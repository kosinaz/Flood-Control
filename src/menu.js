var menuState = {
    create: function () {

        var positions = game.cache.getJSON('menu');

        var buttons = [], texts = [];

        
        /**
         * Create a button for each level.
         */ 
        for (var i = 0; i < 5; i += 1) {
            texts[i] = game.add.text(0, 0, i + 1, {
                boundsAlignH: "center",
                boundsAlignV: "middle",
                fill: '#ff0',
                font: 'bold 30pt Arial'
            });
            texts[i].setTextBounds(positions[i].x, positions[i].y, 100, 50);
            buttons[i] = game.add.button(
                positions[i].x, 
                positions[i].y + 50, 
                'menu', 
                function (button) {
                    game.currentLevel = button.frame + 1;
                    game.state.start('play');
                },
                this
            );
            buttons[i].frame = i;
            if (game.progress < i + 1) {
                texts[i].fill = '#0005';
                buttons[i].tint = 0x000000;
                buttons[i].alpha = 0.3;
                buttons[i].inputEnabled = false;
            }
        }
    }
};