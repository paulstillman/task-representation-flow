var timeline = [];

var game = {
    type: 'canvas-keyboard-response',
    stimulus: draw,
    canvas_size: [500, 800],
    choices: ['e','i'],
    prompt: '<p>Is this a circle or a rectangle? Press "e" for circle and "i" for rectangle.</p>',
};

timeline.push(game);

jsPsych.init({
  timeline: timeline
});