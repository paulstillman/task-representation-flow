var timeline = [];

var game = {
    type: 'slingshot-game',
    stimulus: slingshot.run,
    total_shots: 10,  
    canvas_size: [500, 800],
    ball_color: 'white',
    ball_size: 10,
    ball_xPos: .15,
    ball_yPos: .5,
    target_color: 'red',
    target_color_hit: 'green',
    target_size: 15,
    target_xPos: .9,
    target_yPos: [.2, .4, .5, .6, .8],
    friction: .02,
    tension: .03,
    prompt: '<p>Get as many hits as you can!</p>',
    on_finish: function(data) {
    	console.log(data)
    }
};

timeline.push(game);

jsPsych.init({
  timeline: timeline
});