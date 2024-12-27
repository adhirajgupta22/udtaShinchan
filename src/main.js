import kaboom from "kaboom"

//initialize kaboom contxt over which our game will run
kaboom();

//load assets 
loadSprite("bird", "sprites/shin.png");
loadSprite("pipe", "sprites/pipe.png");
loadSprite("newbg", "sprites/bkl.png");

//load sounds
loadSound("jump",'sounds/jump.mp3');
loadSound("bruh",'sounds/bruh.mp3');
loadSound("pass",'sounds/pass.mp3');

//we will be having two scenes in the game - the game scene and the game over scene

let highscore = 0;

//game scene
scene("game", () => {
	const PIPE_GAP = rand(160,200);
	let score = 0;
	setGravity(1600);

	add([
		sprite("newbg",{width: width(), height: height()}),    
	]);

	const scoreText = add([text(score), pos(12, 12)]);
	const player = add([
		sprite("bird"),
		scale(0.3),
		pos(100, 50),
		area(),
		body(),
	]);

	function createPipes(){
		const offset = rand(-100,100);
		//bottom pipe
		add([
			sprite("pipe"),
			pos(width(), height()/2 + offset + PIPE_GAP/2),
			"pipe",
			scale(2),
			area(),
			{passed: false},
		]);

		//top pipe
		add([
			sprite("pipe",{flipY: true}),
			pos(width(), height()/2 + offset - PIPE_GAP/2),
			"pipe",
			anchor("botleft"),
			scale(2),
			area(),
		]);
	}

	loop(rand(1.2,2.0),()=>createPipes());
	onUpdate("pipe",(pipe)=>{
		pipe.move(-300,0);

		if(pipe.passed===false && pipe.pos.x < player.pos.x){
			pipe.passed = true;
			score+=1;
			scoreText.text = score;
			play("pass");
		}
	});

	player.onCollide("pipe",()=>{
		const ss = screenshot();
		go("gameOver",score,ss);
	})

	player.onUpdate(()=>{
		if(player.pos.y > height()){
			const ss = screenshot();
			go("gameOver",score,ss);
		}
	});


	//jump effect
	// onkeyPress("space", () => {
	// 	play("jump");
	// 	player.jump(400);
	// }); 
	document.addEventListener("keydown", (event) => {
		if (event.code === "Space") {
		  play("jump");
		  player.jump(400);
		}
	  });
	  
	//for touch devices not laptop or desktop
	// window.addEventListener("touchstart", () =>{
	// 	play("jump");
	// 	player.jump(400);
	// })

	function handleJump() {
		play("jump");
		player.jump(400);
	} 
	window.addEventListener("touchstart", handleJump);
	window.addEventListener("mousedown", handleJump);
	  

});

//game over scene
scene("gameOver", (score,screenshot) => {
	
	if(score>highscore){
		highscore = score;
	}

	play("bruh");
	loadSprite("gameOverScreen", screenshot);

	add([
		sprite("gameOverScreen",{width:width(),height:height()}),
	]);

	add([
		text('Game Over!\n'+"score: "+score + "\nhigh score: " + highscore,{size:45}),
		pos(width()/2,height()/3),
	]);

	//restart the game on pressing space
	const handleRestart = (event) => {
        if (event.code === "Space") {
            go("game");
            // Remove the listener after restarting
            document.removeEventListener("keydown", handleRestart);
        }
    };

    document.addEventListener("keydown", handleRestart);
	  


});

//start the game
go("game");
