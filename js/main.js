/**
Nos falta:
    *Poner música-OK
    *acelerar música-OK
    *Agregar botones Touch-Ok
    *Poner game en un canvas definido y un h1 a la página (para probar... no porque aporte algo)-Ok
    *linea 111-Ok
    *Reestructurar un poco el codigo (que no esté todo en index.html)-Ok
    *cambiar bounce de estrellas-
    *Poner bichos malos-
    *Vidas-
    *Fin de nivel-
**/
var score = 0;
var scoreText;
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });
var loadText;
var mouseDown;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.audio('jesus', ['assets/Jesus_He_Knows_Me_Genesis.ogg', 'assets/Genesis_Jesus_He_Knows_Me.mp3']);

}

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    //comment to make ledge fall when collisioning it
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //stars
    stars = game.add.group();

    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 6;

        // ¿Y si hacemos el bote diferente en relacion al peso?
        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  A simple background for our game
    back = game.add.sprite(0, 0, 'sky');
    loadText = game.add.text(340, 300, 'Loading', { fontSize: '32px', fill: '#000' });

    mouseDown = game.add.text(340, 10, 'false', { fontSize: '20px', fill: '#000' });

    music = game.add.audio('jesus');

    game.sound.setDecodedCallback([music],start, this);
}

function start()
{
    back.kill();
    loadText.text = '';
    music.play();
    music._sound.playbackRate.value = 1.1;
}

function update() {

    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //¿que son los dos ultimos valores?
    //El cuarto parametro es para hacer una comprobacion antes de ejecutar collect (o lo que sea).
    //El quinto es el contexto en el cual corren los callbacks.
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    cursors = game.input.keyboard.createCursorKeys();

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    mouseDown.text = game.input.mousePointer.isDown;

    var isDown = game.input.activePointer.isDown;
    var x = game.input.activePointer.x;
    var y = game.input.activePointer.y;
    var up = 200;
    var left = 300;
    var right = 600;

    if (cursors.left.isDown || ( isDown && x < left ) )
    {
        //  Move to the left
        moveLeft();
    }
    else if (cursors.right.isDown || ( isDown && x > right ) )
    {
        //  Move to the right
        moveRight();
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if ((cursors.up.isDown || (y < up  && isDown)) && player.body.touching.down && hitPlatform)
    {
        jump();
    }
}

function moveLeft()
{
    player.body.velocity.x = -150;

    player.animations.play('left');
}

function moveRight()
{
    player.body.velocity.x = 150;

    player.animations.play('right');
}

function jump()
{
    player.body.velocity.y = -350;
}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}