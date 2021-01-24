
// randomly assign to condition
var mutInfo = Math.floor(Math.random()*2)

// save condition, date, and time
jsPsych.data.addProperties({
    condition: mutInfo,
    startDate: jsPsych.data.getURLVariable('date'),
    startTime: jsPsych.data.getURLVariable('time'),
});

var qBlocks = (function() {

    var zeroToExtremely = ['0<br>Not<br>at all', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely'];
    var zeroToALot = ['0<br>Not<br>at all', '1', '2', '3', '4', '5', '6', '7', '8<br>A lot'];
    
    var qInfoSling = `<div class='qInfo'>

    <p><strong>Thank you for playing Target Practice!</strong></p>

    <p>Now, please provide your honest assessment of Target Practice<br> 
    by answering each of the following questions.</p></div>`;
    
    var qInfoHole = `<div class='qInfo'>

    <p><strong>Thank you for playing Hole in One!</strong></p>

    <p>Now, please provide your honest assessment of Hole in One<br> 
    by answering each of the following questions.</p></div>`;

    var questions = {};

    questions.flow_sling = {
        type: 'survey-likert',
        preamble: qInfoSling,
        questions: [
            {prompt: 'How engaging was Target Practice?',
            name: 'engaging_sling',
            labels: zeroToExtremely},
            {prompt: 'How engrossing was Target Practice?',
            name: 'engrossing_sling',
            labels: zeroToExtremely},
            {prompt: 'How immersive was Target Practice?',
            name: 'immersive_sling',
            labels: zeroToExtremely}
        ],
        randomize_question_order: false,
        scale_width: 500
    };

    questions.flow_hole = {
        type: 'survey-likert',
        preamble: qInfoHole,
        questions: [
            {prompt: 'How engaging was Hole in One?',
            name: 'engaging_hole',
            labels: zeroToExtremely},
            {prompt: 'How engrossing was Hole in One?',
            name: 'engrossing_hole',
            labels: zeroToExtremely},
            {prompt: 'How immersive was Hole in One?',
            name: 'immersive_hole',
            labels: zeroToExtremely}
        ],
        randomize_question_order: false,
        scale_width: 500
    };

    questions.enjoyment_sling = {
        type: 'survey-likert',
        preamble: null,
        questions: [
            {prompt: 'How much did you like Target Practice?',
            name: 'like_sling',
            labels: zeroToALot},
            {prompt: 'How much did you dislike Target Practice?',
            name: 'dislike_sling',
            labels: zeroToALot},
            {prompt: 'How enjoyable was Target Practice?',
            name: 'enjoyable_sling',
            labels: zeroToExtremely},
            {prompt: 'How fun was Target Practice?',
            name: 'fun_sling',
            labels: zeroToExtremely},
            {prompt: 'How entertaining was Target Practice?',
            name: 'entertaining_sling',
            labels: zeroToExtremely},
        ],
        randomize_question_order: false,
        scale_width: 500
    };

    questions.enjoyment_hole = {
        type: 'survey-likert',
        preamble: null,
        questions: [
            {prompt: 'How much did you like Hole in One?',
            name: 'like_hole',
            labels: zeroToALot},
            {prompt: 'How much did you dislike Hole in One?',
            name: 'dislike_hole',
            labels: zeroToALot},
            {prompt: 'How enjoyable was Hole in One?',
            name: 'enjoyable_hole',
            labels: zeroToExtremely},
            {prompt: 'How fun was Hole in One?',
            name: 'fun_hole',
            labels: zeroToExtremely},
            {prompt: 'How entertaining was Hole in One?',
            name: 'entertaining_hole',
            labels: zeroToExtremely},
        ],
        randomize_question_order: false,
        scale_width: 500
    };

    return questions;
}());

var infoBlocks = (function() {

    var info = {};

    // create pages
    var block1page1 = [`<div class='instructions'>

    <p><strong>Welcome!</strong></p>

    <p>We are designing games that can be used by behavioral scientists to study motivation 
    and decision making. To make the games as engaging as possible, we are getting feedback from people like you.</p>

    <p>You will play two different games: "Hole in One" and "Target Practice". After each game, we will ask you
    a series of questions about your experience.</p>

    <p>Continue to learn about and play "Hole in One".</p>

    <p>After you finish, you will learn about and play "Target Practice".</p>
    
    <p>Press your SPACEBAR to progress through each screen.</p></div>`]; 

    // combine pages into blocks
    info.block1 = {
        type: "instructions",
        pages: [block1page1],
        key_forward: 32,
    };

    return info;
}());

var taskBlocks = (function() {

    var tasks = {};

    tasks.holeInOne = {
        type: 'hole-in-one-game',
        stimulus: holeInOne.run,
        total_shots: 10,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        wall_width: 50,
        wall_color: '#797D7F',
        wall_xPos: .9,
        hole_size: 75,
        friction: .02,
        tension: .03,
        prompt: `<div class='instructions'>

        <p><strong>Hole in One</strong>. The goal of Hole in One is to shoot the ball through the hole. 
        Follow the instructions in the game area, then spend the next few minutes 
        playing Hole in One. We'll let you know when time is up.</p></div>`
    };

    tasks.slingshotGame = {
        type: 'slingshot-game',
        stimulus: slingshot.run,
        total_shots: 10,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        target_color: 'red',
        target_color_hit: 'green',
        target_size: mutInfo == 1 ? 20 : 60,
        target_xPos: .9,
        target_yPos: [.2, .4, .5, .6, .8],
        friction: .02,
        tension: .03,
        prompt: `<div class='instructions'>

        <p><strong>Target Practice</strong>. The goal of Target Practice is to hit the red circle. 
        Follow the instructions in the game area, then spend the next few minutes 
        playing Target Practice. We'll let you know when time is up.</p></div>`
    };

    return tasks;
}());

function makeTimeline(taskBlocks, infoBlocks, qBlocks) {

    var timeline = [
        infoBlocks.block1,
        taskBlocks.holeInOne,
        qBlocks.flow_hole,
        qBlocks.enjoyment_hole,
        taskBlocks.slingshotGame,
        qBlocks.flow_sling,
        qBlocks.enjoyment_sling];

    return timeline;
};

jsPsych.init({
    timeline: makeTimeline(taskBlocks, infoBlocks, qBlocks),
    on_finish: function() { jsPsych.data.displayData('json') }
});