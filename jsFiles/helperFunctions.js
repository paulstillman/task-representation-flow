// constructor functions
function Ball(x, y, radius, friction, color) {
	this.body = Bodies.circle(x, y, radius, { 
		frictionAir: friction,
		render: {
			fillStyle: color,
		}
	});
	World.add(engine.world, this.body);
};

function Target(x, y, h, w, static, color) {
	this.body = Bodies.rectangle(x, y, h, w, {
		isStatic: static,
		render: {
			fillStyle: color,
		}
	});
	World.add(engine.world, this.body);
};

function Sling(x, y, body, stiffness) {
	this.body = Matter.Constraint.create({
		pointA: {x: x, y: y},
		bodyB: body,
		stiffness: stiffness
	});
	World.add(engine.world, this.body);
};

function MakeMouse(render) {
	this.body = Mouse.create(render.canvas);
	this.constraint = MouseConstraint.create(engine, {
		mouse: this.body,
		constraint: {
			render: {visible: false}
		}
	});
	World.add(engine.world, this.constraint);
	render.mouse = this.body;
}

// event functions
function shootSling(sling, body, tracker, mouseConstraint, canvasHeight) {
	Events.on(mouseConstraint, 'startdrag', function(e) {
		target = new Target(740, 100, 40, 40, true, 'red');
		ballX.push(ballXtrial);
		ballXtrial = [];
		tracker.ball = body;
		console.log(ballX)
	});
	Events.on(mouseConstraint, 'enddrag', function(e) {
		if(e.body === body) firing = true;
	});
	Events.on(engine, 'afterUpdate', function() {
		if(firing && Math.abs(body.position.x-120)<10 && Math.abs(body.position.y-(canvasHeight/2))<10) {
			sling.bodyB = null;
			body = new Ball(120, canvasHeight/2, 10, .02, 'blue').body;
			sling.bodyB = body;
			firing = false;
		};
	});
};

function trackBall(tracker, width) {
	Events.on(engine, "afterUpdate", function () {
		if (tracker.ball.position.x > 120 && tracker.ball.position.x < width && tracker.ball.position.y < 500) {
			ballXtrial.push(tracker.ball.position.x);
			ballYtrial.push(tracker.ball.position.y);
			console.log(tracker.ball.position.x);
		}
	});
}

function recordHit(x, y, h, w, static, color) {
	Events.on(engine, 'collisionStart', function(event) {
	    target = Bodies.rectangle(x, y, h, w, {
	     	isStatic: static,
	     	render: {
	     		fillStyle: color,
	     	}
	    });
	    World.add(engine.world, target);
	});
}