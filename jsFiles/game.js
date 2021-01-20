function draw(c) {

	// canvas dimensions
	const height = c.height;
	const width = c.width;

	// create renderer
	const render = Render.create({ 
		engine: engine, 
		canvas: c, 
		options: {
			height: height,
			width: width,
			wireframes: false,
		}
	});

	// create elements
	let ball = new Ball(120, height/2, 10, .02, 'blue').body;
	const tracker = { ball: ball };
	let target = new Target(740, 100, 40, 40, true, 'red').body;
	const mouse = new MakeMouse(render);
	const sling = new Sling(120, height/2, ball, .03);

	// events
	shootSling(sling.body, ball, tracker, mouse.constraint, height);
	trackBall(tracker, width);
	recordHit(740, 100, 40, 40, true, 'green');

	// run engine
	Engine.run(engine);

	// run renderer
	Render.run(render);
}