var timeline = [];

var game = {
    type: 'slingshot-game',
    stimulus: slingshot.run,
    total_shots: 5,  
    canvas_size: [500, 800],
    ball_color: 'white',
    ball_size: 10,
    ball_xPos: .15,
    ball_yPos: .5,
    target_color: 'red',
    target_color_hit: 'yellow',
    target_size: 20,
    target_xPos: .9,
    target_yPos: .3,
    friction: .02,
    tension: .03,
    prompt: '<p>Get as many hits as you can!</p>',
    on_finish: function(data) {
    	console.log('Hits:' + data.totalHits, 'X:', data.xCoordinates, 'Y:', data.yCoordinates)
    }
};

timeline.push(game);

jsPsych.init({
  timeline: timeline
});