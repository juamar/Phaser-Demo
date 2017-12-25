/**
Nos falta:
    *Poner música-OK
    *acelerar música-OK
    *Agregar botones Touch-Ok
    *Poner game en un canvas definido y un h1 a la página (para probar... no porque aporte algo)-Ok
    *linea 111-Ok
    *Reestructurar un poco el codigo (que no esté todo en index.html)-Ok
    *cambiar bounce de estrellas-Ok
    *Poner bichos malos-Ok
    *Vidas-Ok
    *Game Over!- Ok
    *Fin de nivel-Ok

    DONE!!!!!
    MARRY Christmas!!!
**/
var score = 0;
var scoreText;
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });
var loadText;
var playerHitPlatform;
var enemies = [];
var lifeDrawings = []; 
var wonDone = false;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
    game.load.audio('jesus', ['assets/Jesus_He_Knows_Me_Genesis.ogg', 'assets/Genesis_Jesus_He_Knows_Me.mp3']);

}

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //Ground and ledges
    makeLevel();

    // The player and its settings
    makePlayer();

    drawLife();

    //stars
    makeStars();

    makeEnemies();

    //score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  A simple background for our game
    back = game.add.sprite(0, 0, 'sky');
    loadText = game.add.text(340, 300, 'Loading', { fontSize: '32px', fill: '#000' });

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

    if (player.life < 1)
    {      
        gameOver();
    }
    else
    if (score >= 120)
    {
        won();
    }
    else
    {
        collitions();
        play();
    }
    
}

function drawLife()
{
    for (var i = 0; i < player.life; i++)
    {
        lifeDrawings.push(game.add.sprite(12 + 40*i, 50, 'dude'));
        lifeDrawings[i].frame = 4;
    }
    
}

function play()
{
    cursors = game.input.keyboard.createCursorKeys();

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

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
    if ((cursors.up.isDown || (y < up  && isDown)) && player.body.touching.down && playerHitPlatform)
    {
        jump();
    }

    for (var i = 0; i < enemies.length; i++)
    {
        if ( (enemies[i].x < 1 && enemies[i].goRight == false) || (enemies[i].x > game.world.width - 35 && enemies[i].goRight == true) )
        {
            enemies[i].goRight = !enemies[i].goRight;
        }
    }
    if (!enemies[0].goRight)
    {
        enemies[0].body.velocity.x = -50;
        enemies[0].animations.play('left');
    }
    else
    {
        enemies[0].body.velocity.x = 50;
        enemies[0].animations.play('right');
    }

    if (!enemies[1].goRight)
    {
        enemies[1].body.velocity.x = -50;
        enemies[1].animations.play('left');
    }
    else
    {
        enemies[1].body.velocity.x = 50;
        enemies[1].animations.play('right');
    }

    if (enemies[2].goRight)
    {
        enemies[2].body.velocity.x = 50;
        enemies[2].animations.play('right');
    }
    else
    {
        enemies[2].body.velocity.x = -50;
        enemies[2].animations.play('left');
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

function makeLevel()
{
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
}

function makePlayer()
{
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
    player.life = 3;
}

function makeStars()
{
    stars = game.add.group();

    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
}

function makeEnemies()
{
    enemies.push(game.add.sprite(500, game.world.height - 150, 'baddie'));
    enemies.push(game.add.sprite(game.world.width - 36, game.world.height - 400, 'baddie'));
    enemies.push(game.add.sprite(32, game.world.height - 600, 'baddie'));

    //  We need to enable physics on the player
    for (var i = 0; i < enemies.length; i++)
    {
        game.physics.arcade.enable(enemies[i]);
        
        enemies[i].body.bounce.y = 0.2;
        enemies[i].body.gravity.y = 300;
        enemies[i].body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        enemies[i].animations.add('left', [0, 1], 10, true);
        enemies[i].animations.add('right', [2, 3], 10, true);
    }

    enemies[0].body.velocity.x = -50;
    enemies[0].goRight = false;
    enemies[1].body.velocity.x = -50;
    enemies[1].goRight = false;
    enemies[2].body.velocity.x = 50;
    enemies[2].goRight = true;

}

function collitions()
{
    //  Collide the player and the stars with the platforms
    playerHitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //¿que son los dos ultimos valores?
    //El cuarto parametro es para hacer una comprobacion antes de ejecutar collect (o lo que sea).
    //El quinto es el contexto en el cual corren los callbacks.
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    for (var i = 0; i < enemies.length; i++)
    {
        game.physics.arcade.overlap(player, enemies[i], throwLife, null, this);
        game.physics.arcade.collide(enemies[i],platforms);
    }
}

function throwLife()
{
    player.life--;
    lifeDrawings[player.life].kill();
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].kill();
    }
    enemies = [];
    makeEnemies();
    player.x = 32;
    player.y = game.world.height - 150;
}

function won()
{
    game.add.sprite(0, 0, 'sky');
    game.add.text(300, 250, 'You Win!!!!', { fontSize: '32px', fill: '#000' });
    game.add.text(310, 300, 'Score: ' + score, { fontSize: '32px', fill: '#000' });
    game.add.text(200, 350, 'Game will restart in less than 3 seconds', { fontSize: '20px', fill: '#000' });

    setTimeout(function(){
        window.location.reload(1);
     }, 3000);
}

function gameOver()
{
    music.stop();
    game.add.sprite(0, 0, 'sky');
    game.add.text(300, 250, 'Game Over!', { fontSize: '32px', fill: '#000' });
    game.add.text(310, 300, 'Score: ' + score, { fontSize: '32px', fill: '#000' });
    game.add.text(200, 350, 'Game will restart in less than 3 seconds', { fontSize: '20px', fill: '#000' });

    setTimeout(function(){
        window.location.reload(1);
     }, 3000);
}