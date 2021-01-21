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
	var ballXtrial = []; 	// ball's X coordinates on current trial
	var ballYtrial = []; 	// ball's Y coordinate on current trial
	var	hit = false;		// flag whether hit occurred on current trial
	var	endTrial = false;	// flag whether the current trial is complete
	var	firing = false;		// flag whether the slingshot was fired	

	// data to save
	game.data = {
		ballX: [],			// ball's X coordinates on all trials
		ballY: [], 			// ball's Y coordinates on all trials
		totalHits: 0,		// total number of hits
		totalTrials: 0,		// total number of trials
	}

	// run slingshot game
	game.run = function (c, trial) {

		// settings
		var set = {
			ball: {
				x: trial.ball_xPos, 
				y: trial.ball_yPos, 
				rad: trial.ball_size, 
				fric: trial.friction, 
				col: trial.ball_color},
			target: {
				x: trial.target_xPos, 
				y: trial.target_yPos, 
				h: trial.target_size, 
				w: trial.target_size, 
				col: trial.target_color, 
				colHit: trial.target_color_hit},
			sling: {stiffness: trial.tension} 
		}

		var height = c.height;
		var width = c.width;
		set.ball.x = set.ball.x*width;
		set.ball.y = set.ball.y*height;
		set.target.x = set.target.x*width;
		set.target.y = set.target.y*height;
		set.sling.x = set.ball.x;
		set.sling.y = set.ball.y;

		// create renderer
		var render = Render.create({ 
			engine: engine, 
			canvas: c, 
			options: {
				height: height,
				width: width,
				wireframes: false,
			}
		});

		// constructor function: ball
		function Ball() {						
			this.body = Bodies.circle(set.ball.x, set.ball.y, set.ball.rad, { 
				frictionAir: set.ball.fric,
				render: {
					fillStyle: set.ball.col,
				}
			});
			World.add(engine.world, this.body);
		};

		// constructor function: target
		function Target() {
			this.body = Bodies.rectangle(set.target.x, set.target.y, set.target.h, set.target.w, {
				isStatic: true,
				render: {
					fillStyle: set.target.col,
				}
			});
			World.add(engine.world, this.body);
		};

		// constructor function: sling
		function Sling() {		
			this.body = Matter.Constraint.create({
				pointA: {x: set.sling.x, y: set.sling.y},
				bodyB: ball,
				stiffness: set.sling.stiffness,
			});
			World.add(engine.world, this.body);
		};

		// constructor function: mouse
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

		// shoot sling
		function shootSling() {	
			Events.on(mouseConstraint, 'startdrag', function(e) {
				target.render.fillStyle = set.target.col;
				tracker.ball = ball;
				endTrial = false;
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
				};
			});
		};

		// track location of ball
		function trackBall() {		
			Events.on(engine, "beforeUpdate", function () {
				var xLoc = tracker.ball.position.x;
				var yLoc = tracker.ball.position.y;
				var xLimR = width;
				var xLimL = set.ball.x;
				var yLim = height;
				if (xLoc>xLimL && xLoc<xLimR && yLoc<yLim) {
					ballXtrial.push(xLoc);
					ballYtrial.push(yLoc);
				}
			});
		}

		// detect hit
		function recordHit() {
			Events.on(engine, 'collisionStart', function(event) {
			    target.render.fillStyle = set.target.colHit;
			    hit = true;
			});
		}

		// record data
		function recordData() {
			Events.on(engine, "beforeUpdate", function () {
				var xLoc = tracker.ball.position.x
				var yLoc = tracker.ball.position.y
				var xLim = width;
				var yLim = height;
				if(!endTrial && yLoc>yLim || !endTrial && xLoc>xLim) {

					// save data
					game.data.ballX.push(ballXtrial);
					game.data.ballY.push(ballYtrial);
					if (hit) game.data.totalHits += 1;
					game.data.totalTrials += 1;

					// reset variables
					ballXtrial = [];
					ballYtrial = [];
					hit = false;
					endTrial = true;

					// replace ball
					ball = new Ball().body;
					sling.pointB.x = null;
					sling.pointB.y = null;
					sling.bodyB = ball;
				};
			})
		}

		// construct bodies and mouse
		var ball = new Ball().body;
		var tracker = { ball: ball };
		var target = new Target().body;
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
	}

	return game;

}());


