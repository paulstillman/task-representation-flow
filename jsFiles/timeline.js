

var exp = (function() {

    var p = {};

    // save condition, date, and time
    var targetSize = Math.floor(Math.random()*2);
    var streak = Math.floor(Math.random()*2);
    if (streak) {
        var inst = `<div class='instructions'>

        <p><strong>Target Practice</strong>. The goal of Target Practice is to hit the target
        as many times in a row as possible. For each consecutive hit, your current "hit streak" will
        increase by 1. Try your best to make your hit streaks as long as possible! Follow the instructions in the game area, then 
        play Target Practice. We'll let you know when time is up.</p></div>`
    } else {
        var inst = `<div class='instructions'>

        <p><strong>Target Practice</strong>. The goal of Target Practice is to shoot the ball
        as close to the target as possible. After each shot, you'll see how close the 
        ball came to the target. Try your best to get as close to the target as possible! 
        Follow the instructions in the game area, then play Target Practice. We'll let you know when time is up.</p></div>`
    }

    jsPsych.data.addProperties({
        targetSize: targetSize,
        streak: streak,
        date: new Date(),
        PROLIFIC_PID: jsPsych.data.getURLVariable('subject'),
    });

   /*
    *
    *  INSTRUCTIONS
    *
    */
        
    p.inst = {}

    // instruction pages
    var block1page1 = `<div class='instructions'>

    <p>For the next 10 to 15 minutes, you'll be helping us 
    answer the following question: "What makes some games more immersive and engaging than others?"</p>

    <p>Specifically, you'll play two games and provide feedback about each one. 
    By playing games and providing feedback, you'll help us understand how to design games 
    that are as immersive and engaging as possible.</p>

    <p>To make it easier for you to provide feedback, we will explain exactly what we mean by
    "immersive and engaging." To continue, press "Next".</p></div>`; 

    var block2page1 = `<div class='instructions'>

    <p>Next, you'll spend a few minutes playing a game called "Hole in One." After you finish, 
    you'll answer some questions about your experience. When you're ready, 
    press "Next" to continue.</p></div>`; 

    var block3page1 = `<div class='instructions'>

    <p>Thank you! Next, you'll spend a few minutes playing a game called "Target Practice." After you finish, 
    you'll answer some questions about your experience. When you're ready, 
    press "Next" to continue.</p></div>`; 

    var block4page1 = `<div class='instructions'>

    <p>Thank you! Next, you'll complete a brief demographics survey. When you're ready, 
    press "Next" to continue.</p></div>`; 

    // combine pages into blocks
    p.inst.block1 = {
        type: "instructions",
        pages: [block1page1],
        show_clickable_nav: true,
    };

    p.inst.block2 = {
        type: "instructions",
        pages: [block2page1],
        show_clickable_nav: true,
    };

    p.inst.block3 = {
        type: "instructions",
        pages: [block3page1],
        show_clickable_nav: true,
    };

    p.inst.block4 = {
        type: "instructions",
        pages: [block4page1],
        show_clickable_nav: true,
    };

   /*
    *
    *  TASKS
    *
    */

    p.tasks = {};

    // parameterize "Hole in One"
    p.tasks.holeInOne = {
        type: 'hole-in-one-game',
        stimulus: holeInOne.run,
        total_shots: 17,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        wall_width: 75,
        wall_color: '#797D7F',
        wall_xPos: .9,
        hole_size: 75,
        friction: .02,
        tension: .03,
        prompt: `<div class='instructions'>

        <p><strong>Hole in One</strong>. The goal of Hole in One is to shoot the ball through the hole. 
        Follow the instructions in the game area, then play Hole in One. 
        We'll let you know when time is up.</p></div>`
    };

    // parameterize "Target Practice"
    p.tasks.slingshotGame = {
        type: 'slingshot-game',
        stimulus: slingshot.run,
        total_shots: 32,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        target_color: 'red',
        target_color_hit: 'green',
        target_size: targetSize == 1 ? 45 : 10,
        game_type: streak,
        target_xPos: .9,
        target_yPos: [.2, .4, .5, .6, .8],
        friction: .02,
        tension: .03,
        prompt: inst,
    };

   /*
    *
    *  QUESTIONS
    *
    */

    // scales
    var zeroToExtremely = ['0<br>Not<br>at all', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely'];
    var zeroToALot = ['0<br>Not<br>at all', '1', '2', '3', '4', '5', '6', '7', '8<br>A lot'];

    // constructor functions
    var flowQs = function(shortName, fullName) {
        this.type = 'survey-likert';
        this.preamble = `<div class='qInfo'>

        <p><strong>Thank you for playing ` + fullName + `!</strong></p>

        <p>During ` + fullName + `, to what extent did you feel immersed and engaged in what you were doing?<br>
        Report how immersed and engaged you felt by answering the following questions.</p></div>`;
        this.questions = [
            {prompt: 'During ' + fullName + ', to what extent did you feel absorbed in what you were doing?',
            name: 'F_absorbed_' + shortName,
            labels: zeroToExtremely},
            {prompt: 'During ' + fullName + ', to what extent did you feel immersed in what you were doing?',
            name: 'F_immersed_' + shortName,
            labels: zeroToExtremely},
            {prompt: 'During ' + fullName + ', to what extent did you feel engaged in what you were doing?',
            name: 'F_engaged_' + shortName,
            labels: zeroToExtremely},
            {prompt: 'During ' + fullName + ', to what extent did you feel engrossed in what you were doing?',
            name: 'F_engrossed_' + shortName,
            labels: zeroToExtremely},
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
    };

    var enjoyQs = function(shortName, fullName) {
        this.type = 'survey-likert';
        this.preamble = `<div class='qInfo'>

        <p>Below are a few more questions about ` + fullName + `.</p><p>Instead of asking about immersion and engagement, 
        these questions ask about <strong>enjoyment</strong>.<br>Report how much you <strong>enjoyed</strong> 
        playing ` + fullName + ` by answering the following questions.</p></div>`;
        this.questions = [
            {prompt: 'How much did you enjoy playing ' + fullName + '?',
            name: 'E_enjoyable_' + shortName,
            labels: zeroToALot},
            {prompt: 'How much did you like playing ' + fullName + '?',
            name: 'E_like_' + shortName,
            labels: zeroToALot},
            {prompt: 'How much did you dislike playing ' + fullName + '?',
            name: 'E_dislike_' + shortName,
            labels: zeroToALot},
            {prompt: 'How much fun did you have playing ' + fullName + '?',
            name: 'E_fun_' + shortName,
            labels: zeroToALot},
            {prompt: 'How entertaining was ' + fullName + '?',
            name: 'E_entertaining_' + shortName,
            labels: zeroToExtremely},
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
    };

    p.Qs = {};

    p.Qs.flowComp = {
        type: 'survey-multi-choice',
        preamble: `<div class='instructions'>
        <p><strong>Welcome!</strong></p>
        <p>Before you begin this survey, please note the following:</p>
        <p>Unlike some surveys on Prolific, we NEVER deny payment based on performance
        or answers to questions. We simply ask that you try your best, and answer 
        each question as honestly and accurately as possible. No matter what answers you give or how
        you perform, you will be fully compensated. That is a guarantee.</p>
        <p>To ensure that you understand this information, please answer the following question.</p></div>`,
        questions: [
            {prompt: "Will you receive full payment regardless of how you perform and answer questions?", name: 'attnChk', required: true, 
            options: ["Yes", "No"]}, 
        ]
    };

    p.Qs.hole = {
        timeline: [new flowQs('hole', 'Hole in One'), new enjoyQs('hole', 'Hole in One')]
    };

    p.Qs.sling = {
        timeline: [new flowQs('sling', 'Target Practice'), new enjoyQs('sling', 'Target Practice')]
    };

    p.Qs.demographics = (function() {
        var gender = {
            type: 'html-button-response',
            stimulus: '<p>Gender:</p>',
            choices: ['Male', 'Female', 'Other'],
        };
        var age = {
            type: 'survey-text',
            questions: [{prompt: "Age:", name: "age"}],
        }; 
        var ethnicity = {
            type: 'html-button-response',
            stimulus: '<p>Ethnicity:</p>',
            choices: ['White / Caucasian', 'Black / African American','Asian / Pacific Islander', 'Hispanic', 'Native American', 'Other'],
        };
        var english = {
            type: 'html-button-response',
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
        };  
        var finalWord = {
            type: 'survey-text',
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
        }; 
        var email = {
            type: 'survey-text',
            questions: [{prompt: "", placeholder: "Prolific ID", name: "PID", columns: 50, required: true}],
            button_label: ['CLICK HERE TO FINISH'], 
        };
        var demos = {
            timeline: [gender, age, ethnicity, english, finalWord, email]
        };

        return demos;
    }());

    return p;
}());
  
var timeline = [
    exp.Qs.flowComp,
    exp.inst.block1,
    exp.inst.block2,
    exp.tasks.holeInOne,
    exp.Qs.hole,
    exp.inst.block3,
    exp.tasks.slingshotGame,
    exp.Qs.sling,
    exp.inst.block4,
    exp.Qs.demographics,
];

jsPsych.init({
    timeline: timeline,
    on_finish: function() {
        firebase.database().ref(firebase.auth().currentUser.uid).set({
            data: jsPsych.data.get().values()}).then(function() {
            window.location.replace("https://app.prolific.co/submissions/complete?cc=865BE374")
        });
    },
});
