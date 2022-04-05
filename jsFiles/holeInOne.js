/* 
 *  Hole in One
 *  David E. Melnikoff
 *
 *  A ball-shooting game compatible with jsPsych
 *
 */

var holeInOne = (function () {

	var game = {};

	// import methods from matter.js and define physics engine
	var { Engine, Render, Vertices, Composite, World, Bodies, Events, Mouse, MouseConstraint } = Matter;
	var engine = Engine.create();

	// temporary data
	var ballXtrial = [0]; 	// ball's X coordinates on current trial
	var ballYtrial = [0]; 	// ball's Y coordinate on current trial
	var	endTrial = false;	// flag whether the current trial is complete
	var	firing = false;		// flag whether the slingshot was fired
	var inTheHole = false;  // flag whether the ball went through the hold
	var intro = 0;  	    // use to determine which instructions to display during introduction

	// data to save
	game.data = {
		ballX: [],			// ball's X coordinates on all trials
		ballY: [], 			// ball's Y coordinates on all trials
		totalTrials: 0,		// total number of trials
		totalScore: 0		// total times getting the ball through the hole
	};

	// run slingshot game
	game.run = function(c, trial) {

		// import settings
		var set = {
			ball: {
				x: trial.ball_xPos*c.width, 
				y: trial.ball_yPos*c.height, 
				rad: trial.ball_size, 
				fric: trial.friction, 
				col: trial.ball_color
			},
			wall: {
				x: trial.wall_xPos*c.width,
				yTop: (1/6)*(c.height-trial.hole_size),
				yBottom: (5/6)*c.height + (1/6)*trial.hole_size,
				width: trial.wall_width,
				height: .5*(c.height-trial.hole_size),
				col: trial.wall_color
			},
			sling: {
				stiffness: trial.tension,
				x: trial.ball_xPos*c.width,
				y: trial.ball_yPos*c.height
			},
			canvas: {
				height: c.height,
				width: c.width
			}
		};

		// create renderer
		var render = Render.create({ 
			engine: engine, 
			canvas: c, 
			options: {
				height: set.canvas.height,
				width: set.canvas.width,
				wireframes: false,
				writeText: text
			}
		});

		// construct ball
		function Ball() {						
			this.body = Bodies.circle(set.ball.x, set.ball.y, set.ball.rad, { 
				frictionAir: set.ball.fric,
				render: {
					fillStyle: set.ball.col,
				}
			});
			World.add(engine.world, this.body);
		};

		// construct target
		function Wall(y, tri) {
			this.body = Bodies.fromVertices(set.wall.x, y, tri, {
				isStatic: true,
				render: {
					fillStyle: set.wall.col,
				}
			});
			World.add(engine.world, this.body);
		};

		// construct sling
		function Sling() {		
			this.body = Matter.Constraint.create({
				pointA: {x: set.sling.x, y: set.sling.y},
				bodyB: ball,
				stiffness: set.sling.stiffness,
			});
			World.add(engine.world, this.body);
		};

		// construct mouse
		function makeMouse() {		
			mouse = Mouse.create(render.canvas);
			mouseConstraint = MouseConstraint.create(engine, {
				mouse: mouse,
				constraint: {
					render: {visible: false}
				}
			});
			World.add(engine.world, mouseConstraint);
			render.mouse = mouse;
		}

		// construct text
		function text(canvas, options, c) {

			if (intro <= 3) {
				c.font = "bold 20px Arial";
		        c.fillStyle = 'red';
				c.fillText("Shoot the ball through the hole.", 75, 60);
		    }

			if (game.data.totalTrials == 0 && intro <= 2) {
				c.font = "16px Arial";
		        c.fillStyle = "white";
				c.fillText("Step 1: Click and hold the ball. Keeping your cursor in the play area,", 75, 100);
				c.fillText("pull the ball to the left to draw your sling.", 75, 120);
		    }

		    if (game.data.totalTrials == 0 && intro > 0 && intro <= 2) {
				c.font = "16px Arial";
		        c.fillStyle = "white";
				c.fillText("Step 2: Aim at the hole,", 75, 160);
				c.fillText("then release the ball to launch.", 75, 180);
			}

		    if (game.data.totalTrials == 1 && intro > 1 && intro <= 3) {
				c.font = "16px Arial";
		        c.fillStyle = "white";
				c.fillText("Good job! Please spend the next few", 75, 100);
				c.fillText("minutes playing Hole in One. We'll let", 75, 120);
				c.fillText("you know when time is up.", 75, 140);
			}
	    };

		// shoot sling
		function shootSling() {	
			Events.on(mouseConstraint, 'startdrag', function(e) {
				tracker.ball = ball;
				endTrial = false;
				intro++;
			});
			Events.on(mouseConstraint, 'enddrag', function(e) {
				if(e.body === ball) firing = true;
			});
			Events.on(engine, 'beforeUpdate', function() {
				var xDelta = Math.abs(ball.position.x-set.ball.x);
				var yDelta = Math.abs(ball.position.y-set.ball.y);
				if(firing && xDelta<set.ball.rad && yDelta<set.ball.rad) {
					sling.bodyB = null;
					sling.pointB.x = set.ball.x;
					sling.pointB.y = set.ball.y;
					firing = false;
					intro++;
				};
			});
		};

		// track location of ball
		function trackBall() {		
			Events.on(engine, "beforeUpdate", function() {
				var xLoc = tracker.ball.position.x;
				var yLoc = tracker.ball.position.y;
				var xLimR = set.canvas.width*1.5;
				var xLimL = set.ball.x;
				var yLim = set.canvas.height;
				if (xLoc>xLimL && xLoc<xLimR && yLoc<yLim) {
					ballXtrial.push(xLoc);
					ballYtrial.push(yLoc);
				}
				if (xLoc > set.wall.x && !endTrial) {
					inTheHole = true;
				}
			});
		}

		// record data
		function recordData() {
			Events.on(engine, "beforeUpdate", function () {
				var xLoc = tracker.ball.position.x
				var yLoc = tracker.ball.position.y
				var xLim = set.canvas.width;
				var yLim = set.canvas.height;
				if(!endTrial && yLoc>(yLim*2) || !endTrial && xLoc>(xLim*2)) {

					// save data
					game.data.ballX.push(ballXtrial);
					game.data.ballY.push(ballYtrial);
					game.data.totalTrials++;
					if (inTheHole) game.data.totalScore++;

					// reset variables
					ballXtrial = [0];
					ballYtrial = [0];
					endTrial = true;
					inTheHole = false;

					// replace ball
					ball = new Ball().body;
					sling.pointB.x = null;
					sling.pointB.y = null;
					sling.bodyB = ball;
				};
			})
		}

		// specify vertices for walls
		var topWallVert = Vertices.fromPath(`0 0 0 ${set.wall.height} ${set.wall.width} 0`)
		var bottomWallVert = Vertices.fromPath(`0 0 0 ${set.wall.height} ${set.wall.width} ${set.wall.height}`)

		// construct bodies and mouse
		var ball = new Ball().body;
		var tracker = { ball: ball };
		var triWallTop = new Wall(set.wall.yTop, topWallVert).body;
		var triWallBottom = new Wall(set.wall.yBottom, bottomWallVert).body;
		var sling = new Sling().body;
		makeMouse();

		// call functions
		shootSling();
		trackBall();
		recordData();

		// run engine
		Engine.run(engine);

		// run renderer
		Render.run(render);
	};

	return game;

}());