/* 
 *  Slingshot Game
 *  David E. Melnikoff
 *
 *  A slingshot game compatible with jsPsych
 *
 */

var slingshot = (function () {

var game = {};

// import methods from matter.js and define physics engine
var { Engine, Render, Composite, World, Bodies, Events, Mouse, MouseConstraint } = Matter;
var engine = Engine.create();

// temporary data
var ballXtrial = []; 	 // ball's X coordinates on current trial
var ballYtrial = []; 	 // ball's Y coordinates on current trial
var distTrial = [];      // distance from target on current trial
var	hit = false;		 // flag whether hit occurred on current trial
var hitFilter = [false]; // filter out repeat hits
var	endTrial = false;	 // flag whether the current trial is complete
var	firing = false;		 // flag whether the slingshot was fired
var record = false;      // flag whether to record data
var intro = 0;  	     // use to determine which instructions to display during introduction
var loc = 0;			 // current element of target's y-axis location array  
var streak = 0;			 // length of current streak
var missMssg = null      // message to display after miss in non-streak condition

// data to save
game.data = {
	ballX: [],			// ball's X coordinates on all trials
	ballY: [], 			// ball's Y coordinates on all trials
	dist: [],           // ball's distance from target on all trials
	minDist: [],        // ball's minimum distance from target
	minDistMM: [],      // ball's minimum distance from target in millimeters
	outcome: [],		// outcome on each trial
	totalHits: 0,		// total number of hits
	totalTrials: 0,		// total number of trials
	targetLoc: []		// target's y-axis location on all trials 
};

// run slingshot game
game.run = function(c, trial, mmPerPx) {

	// import settings
	var set = {
		ball: {
			x: trial.ball_xPos*c.width, 
			y: trial.ball_yPos*c.height, 
			rad: trial.ball_size, 
			fric: trial.friction, 
			col: trial.ball_color
		},
		target: {
			x: trial.target_xPos*c.width, 
			y: trial.target_yPos.map(y => { return y*c.height }), 
			rad: trial.target_size, 
			col: trial.target_color, 
			colHit: trial.target_color_hit
		},
		frame: {
			streak: trial.game_type,
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

	var goalMssg = set.frame.streak ? "Hit the target as many times is a row as possible" : "Shoot the ball as close to the target as possible"


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
	function Target(loc) {
		this.body = Bodies.circle(set.target.x, set.target.y[loc], set.target.rad, {
			isStatic: true,
			render: {
				fillStyle: set.target.col,
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
			c.fillText(goalMssg, 75, 60);
	    }

		if (game.data.totalTrials == 0 && intro <= 2) {
			c.font = "16px Arial";
	        c.fillStyle = "white";
			c.fillText("Step 1: Click and hold the ball, then pull the ball to the left to draw your sling.", 75, 100);
			c.fillText("Keep your cursor in the play area while holding the ball.", 75, 120);
	    }

	    if (game.data.totalTrials == 0 && intro > 0 && intro <= 2) {
			c.font = "16px Arial";
	        c.fillStyle = "white";
			c.fillText("Step 2: Aim at the red circle,", 75, 160);
			c.fillText("then release the ball to launch.", 75, 180);
		}

	    if (game.data.totalTrials == 1 && intro > 1 && intro <= 3) {
			c.font = "16px Arial";
	        c.fillStyle = "white";
			c.fillText("Good job! Please spend the next few", 75, 100);
			c.fillText("minutes playing Target Practice. We'll let", 75, 120);
			c.fillText("you know when time is up.", 75, 140);
		}

		if (game.data.totalTrials == 1 && intro > 1 && intro <= 3) {
			c.font = "16px Arial";
	        c.fillStyle = "white";
			c.fillText("Good job! Please spend the next few", 75, 100);
			c.fillText("minutes playing Target Practice. We'll let", 75, 120);
			c.fillText("you know when time is up.", 75, 140);
		}

		if (set.frame.streak) {
			if (streak == 0 & length > 0 & endTrial) {
		    	c.font = "30px Arial";
	        	c.fillStyle = "white";
				c.fillText(`Your streak was:`, 330, 220);
				c.fillText(`${length}`, 425, 270);
			} else if (streak > 0 & hit | streak > 0 & endTrial | streak == 0 & length == 0 & endTrial) {
		    	c.font = "30px Arial";
	        	c.fillStyle = "white";
				c.fillText(`Current hit streak:`, 315, 220);
				c.fillText(`${streak}`, 420, 270);
			}
		} 
		else {
			if (streak == 0 & endTrial) {
		    	c.font = "35px Arial";
	        	c.fillStyle = "white";
	        	c.fillText("You missed by:", 310, 220);
	        	c.fillText(missMssg, 380, 270);
			} else if (streak > 0 & hit | streak > 0 & endTrial) {
		    	c.font = "35px Arial";
	        	c.fillStyle = "white";
				c.fillText(`Hit!`, 400, 245);
			}
		}
    };

	// shoot sling
	function shootSling() {	
		Events.on(mouseConstraint, 'startdrag', function(e) {
			target.render.fillStyle = set.target.col;
			tracker.ball = ball;
			endTrial = false;
			intro ++;
		});
		Events.on(mouseConstraint, 'enddrag', function(e) {
			if(e.body === ball) {
				firing = true;
				record = true;
			}
		});
		Events.on(engine, 'beforeUpdate', function() {
			var xDelta = Math.abs(ball.position.x-set.ball.x);
			var yDelta = Math.abs(ball.position.y-set.ball.y);
			if(firing && xDelta<set.ball.rad && yDelta<set.ball.rad) {
				sling.bodyB = null;
				sling.pointB.x = set.ball.x;
				sling.pointB.y = set.ball.y;
				firing = false;
				intro ++;
			};
		});
	};

	// track location of ball
	function trackBall() {		
		Events.on(engine, "beforeUpdate", function() {
			var xLoc = tracker.ball.position.x;
			var yLoc = tracker.ball.position.y;
			// var xLimR = set.canvas.width*1.5;
			// var xLimL = set.ball.x;
			// var yLim = set.canvas.height;
			if (record) {
				ballXtrial.push(xLoc);
				ballYtrial.push(yLoc);
				distTrial.push(Math.hypot(xLoc - set.target.x, yLoc - set.target.y[loc]) - (set.ball.rad + set.target.rad));
/*				if (ballXtrial.length > 1) {
					var dxRaw = xLoc - ballXtrial[ballXtrial.length - 2];
					var dyRaw = yLoc - ballYtrial[ballYtrial.length - 2];
					var dx = (dxRaw > 0) ? Math.floor(dxRaw) : Math.ceil(dxRaw);
					var dy = (dyRaw > 0) ? Math.floor(dyRaw) : Math.ceil(dyRaw);
					var xFlip = 0 > (dx * dxTrial[dxTrial.length-1]) | dx == 0 & dxTrial[dxTrial.length-1] != 0 | dx != 0 & dxTrial[dxTrial.length-1] == 0
					var yFlip = 0 > (dy * dyTrial[dyTrial.length-1]) | dx == 0 & dxTrial[dxTrial.length-1] != 0 | dx != 0 & dxTrial[dxTrial.length-1] == 0
					dxTrial.push(dx);
					dyTrial.push(dy);
					xFlipTrial.push(xFlip);
					yFlipTrial.push(yFlip);
					console.log(yFlip, dy);
				}*/
			}
/*			if (xLoc>xLimL && xLoc<xLimR && yLoc<yLim) {
				ballXtrial.push(xLoc);
				ballYtrial.push(yLoc);
				distTrial.push(Math.hypot(xLoc - set.target.x, yLoc - set.target.y[loc]) - (set.ball.rad + set.target.rad));
			}*/
		});
	}

	// detect hit
	function recordHit() {
		Events.on(engine, 'collisionStart', function(event) {
		    target.render.fillStyle = set.target.colHit;
		    hit = true;
		    hitFilter.push(hit);
			if (hitFilter[hitFilter.length-1] != hitFilter[hitFilter.length-2]) {
				game.data.totalHits++;
				streak++;
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

				// stop recording data
				record = false;

				// minimum distance
				minDistTrial = Math.min.apply(null, distTrial);
				minDistTrialMM = Math.floor(minDistTrial/mmPerPx);
				missMssg = (minDistTrialMM > 1) ? `${minDistTrialMM}mm` : `1mm`;

				// save data
				game.data.ballX.push(ballXtrial);
				game.data.ballY.push(ballYtrial);
				game.data.dist.push(distTrial);
				game.data.minDist.push(minDistTrial);
				game.data.minDistMM.push(minDistTrialMM);
				game.data.targetLoc.push(set.target.y[loc]);
				game.data.outcome.push(hit);
				game.data.totalTrials++;
				if (!hit) {
					length = streak;
					streak = 0;
				};

				// reset variables
				ballXtrial = [];
				ballYtrial = [];
				distTrial = [];
				hit = false;
				hitFilter.push(hit);
				endTrial = true;

				// replace ball
				ball = new Ball().body;
				sling.pointB.x = null;
				sling.pointB.y = null;
				sling.bodyB = ball;

				// relocate target
				Composite.remove(engine.world, target);
				loc = Math.floor(Math.random() * set.target.y.length);
				target = new Target(loc).body;
			};
		})
	}

	// construct bodies and mouse
	var ball = new Ball().body;
	var tracker = { ball: ball };
	var target = new Target(loc).body;
	var sling = new Sling().body;
	makeMouse();

	// call functions
	shootSling();
	trackBall();
	recordHit();
	recordData();

	// run engine
	Engine.run(engine);

	// run renderer
	Render.run(render);
};

return game;

}());


