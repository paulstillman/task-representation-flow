

var exp = (function() {

    var p = {};

    // randomly assign to condition
    var mutInfo = Math.floor(Math.random()*2);

    // assign names to games
    var gameNames = { 
        game1: { full: 'Hole in One', short: 'hole' },
        game2: { full: 'Target Practice', short: 'sling' }
    };

    // save condition, date, and time
    jsPsych.data.addProperties({
        condition: mutInfo,
        startDate: jsPsych.data.getURLVariable('date'),
        startTime: jsPsych.data.getURLVariable('time'),
    });

    /******************

        INSTRUCTIONS

    *******************/

    p.inst = {}

    // instruction pages
    var block1page1 = `<div class='instructions'>

    <p><strong>Welcome!</strong></p>

    <p>Thank you for agreeing to complete our survey. For the next 10 to 15 minutes, you'll be helping us 
    answer the following question: "What makes some games more immersive and engaging than others?" 
    Specifically, you'll play two games and provide feedback about each one. 
    By playing games and providing feedback, you'll help us understand how to design games 
    that are as immersive and engaging as possible.</p>

    <p>To make it easier for you to provide feedback, we will explain exactly what we mean by
    "immersive and engaging." To continue, press your SPACEBAR.</p></div>`; 

    var block2page1 = `<div class='instructions'>

    <p>Next, you'll spend a few minutes playing a game called "Hole in One." After you finish, 
    you'll answer some questions about your experience. When you're ready, 
    press your SPACEBAR to continue.</p></div>`; 

    var block3page1 = `<div class='instructions'>

    <p>Thank you! Next, you'll spend a few minutes playing a game called "Target Practice." After you finish, 
    you'll answer some questions about your experience. When you're ready, 
    press your SPACEBAR to continue.</p></div>`; 

    // combine pages into blocks
    p.inst.block1 = {
        type: "instructions",
        pages: [block1page1],
        key_forward: 32,
    };

    p.inst.block2 = {
        type: "instructions",
        pages: [block2page1],
        key_forward: 32,
    };

    p.inst.block3 = {
        type: "instructions",
        pages: [block3page1],
        key_forward: 32,
    };

    /************

        TASKS

    ************/

    p.tasks = {};

    // parameterize "Hole in One"
    p.tasks.holeInOne = {
        type: 'hole-in-one-game',
        stimulus: holeInOne.run,
        total_shots: 20,  
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

    // parameterize "Target Practice"
    p.tasks.slingshotGame = {
        type: 'slingshot-game',
        stimulus: slingshot.run,
        total_shots: 52,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        target_color: 'red',
        target_color_hit: 'green',
        target_size: mutInfo == 1 ? 20 : 80,
        target_xPos: .9,
        target_yPos: [.2, .4, .5, .6, .8],
        friction: .02,
        tension: .03,
        prompt: `<div class='instructions'>

        <p><strong>Target Practice</strong>. The goal of Target Practice is to hit the red circle. 
        Follow the instructions in the game area, then spend the next few minutes 
        playing Target Practice. We'll let you know when time is up.</p></div>`
    };

    /****************

        QUESTIONS

    ****************/

    p.Qs = {};

    var fullNames = [gameNames.game1.full, gameNames.game2.full];
    var shortNames = [gameNames.game1.short, gameNames.game2.short];
    var zeroToExtremely = ['0<br>Not<br>at all', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely'];
    var zeroToALot = ['0<br>Not<br>at all', '1', '2', '3', '4', '5', '6', '7', '8<br>A lot'];

    p.Qs.flowComp = {
        type: 'survey-text',
        preamble: `<div class='instructions'>

        <p>The feeling of being immersed and engaged in an activity is what psychologists call a "flow state." 
        A flow state is commonly known as being "in the zone" or "hyper-focused." It is a feeling of intense, 
        focused, and effortless concentration on what one is doing in the present moment. Someone in a flow state
        is fully involved and completely absorbed in their current activity. 
        Flow is the opposite or boredom; in a flow state, time seems to "fly by."</p>

        <p>In the spaces below, briefly describe three activities that have made you experience flow in the past.</p>`,
        questions: [
            {prompt: "", placeholder: 'Activity #1', name: 'activity1', required: true}, 
            {prompt: "", placeholder: 'Activity #2', name: 'activity2', required: true}, 
            {prompt: "", placeholder: 'Activity #3', name: 'activity3', required: true}, 
        ]
    };

    for (let i = 0; i < fullNames.length; i++) {
        
        p.Qs['flow_' + shortNames[i]] = {
            type: 'survey-likert',
            preamble: `<div class='qInfo'>

            <p><strong>Thank you for playing ` + fullNames[i] + `!</strong></p>

            <p>While playing ` + fullNames[i] + `, to what extent did you experience <strong>flow</strong>? 
            Report the degree of <strong>flow</strong> you experienced by 
            answering the following questions.</p></div>`,
            questions: [
                {prompt: 'During ' + fullNames[i] + ', to what extent did you feel absorbed in what you were doing?',
                name: 'absorbed_' + shortNames[i],
                labels: zeroToExtremely},
                {prompt: 'During ' + fullNames[i] + ', to what extent did you feel immersed in what you were doing?',
                name: 'immersed_' + shortNames[i],
                labels: zeroToExtremely},
                {prompt: 'During ' + fullNames[i] + ', to what extent did you feel engaged in what you were doing?',
                name: 'engaged_' + shortNames[i],
                labels: zeroToExtremely},
                {prompt: 'During ' + fullNames[i] + ', to what extent did you feel engrossed in what you were doing?',
                name: 'engrossed_' + shortNames[i],
                labels: zeroToExtremely},
            ],
            randomize_question_order: false,
            scale_width: 500
        };

        p.Qs['enjoyment_' + shortNames[i]] = {
            type: 'survey-likert',
            preamble: `<div class='qInfo'>

            <p>Below are a few more questions about ` + fullNames[i] + `. Instead of asking about flow, 
            these questions ask about <strong>enjoyment</strong>: how much did you <strong>enjoy</strong> 
            playing ` + fullNames[i] + `?<br>Please answer each question, then continue.</p></div>`,
            questions: [
                {prompt: 'How much did you enjoy playing ' + fullNames[i] + '?',
                name: 'enjoyable_' + shortNames[i],
                labels: zeroToALot},
                {prompt: 'How much did you like playing ' + fullNames[i] + '?',
                name: 'like_' + shortNames[i],
                labels: zeroToALot},
                {prompt: 'How much did you dislike playing ' + fullNames[i] + '?',
                name: 'dislike_' + shortNames[i],
                labels: zeroToALot},
                {prompt: 'How much fun did you have playing ' + fullNames[i] + '?',
                name: 'fun_' + shortNames[i],
                labels: zeroToALot},
                {prompt: 'How entertaining was ' + fullNames[i] + '?',
                name: 'entertaining_' + shortNames[i],
                labels: zeroToExtremely},
            ],
            randomize_question_order: false,
            scale_width: 500
        };
    };

    return p;
}());

var timeline = [
    exp.inst.block1,
    exp.Qs.flowComp,
    exp.inst.block2,
    exp.tasks.holeInOne,
    exp.Qs.flow_hole,
    exp.Qs.enjoyment_hole,
    exp.inst.block3,
    exp.tasks.slingshotGame,
    exp.Qs.flow_sling,
    exp.Qs.enjoyment_sling,
];

jsPsych.init({
    timeline: timeline,
    on_finish: function() { jsPsych.data.displayData('csv') }
});