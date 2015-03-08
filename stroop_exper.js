$(function(){

//set num trials and blocks

  var CLASSIC_NUM_TRIALS = 48; //96; --> dividing in half, 49 -> 48 to be divis by 4
  var WM_NUM_TRIALS = 72 //120; --> dividing in half, 60 -> 72 to work with stim balancing
  var NUM_BLOCKS = 2;

  var PRACTICE_CLASSIC_NUM_TRIALS = 12; //12
  var PRACTICE_WM_NUM_TRIALS = 12; //12

//set up task order (classic vs wm stroop first)

  var TASK_ORDER = _(['classic', 'wm']).shuffle();
  var numTasksRun = 0;

//shuffle stims

  var CLASSIC_TRIAL_ITEMS = _(classic_items).shuffle();
  var WM_TRIAL_ITEMS = _(wm_items).shuffle();

  var PRACTICE_CLASSIC_TRIAL_ITEMS = _(practice_classic_items).shuffle();
  var PRACTICE_WM_TRIAL_ITEMS = _(practice_wm_items).shuffle();

//responses

  var COLOR_RESPONSE_MAPPINGS = {
    'a': 'red',
    's': 'blue',
    'j': 'green',
    'k': 'yellow'
  };

  var SAME_RESPONSE_MAPPINGS = {'0': 'diff', '1': 'same'};

// timing

  var WM_ITI = 1500;
  var WM_ISI1 = 2000;
  var WM_ISI2 = 1000;
  var WM_WORD1 = 1000;
  var WM_PATCH = 500;
  var WM_PROBE = 3000;
  var CLASSIC_ITI = 1000;
  var CLASSIC_WORD = 500;

// output

  var experimentData = {
    trialData: []
  };

  var showWelcome = function() {
    var $welcomeSlide = $('#welcome');
    $welcomeSlide.show()
    if (turk.previewMode == false) {
      $('#begin-exper-button').on('click', function() {
        $welcomeSlide.hide()
        initTask(TASK_ORDER[0]);
      $(this).off(); // to avoid restarting task 1 during task 2
    });
  };
};

//start! show instructions and wait for click

  var initTask = function(task) {
    var $instructSlide = $('#init-task');
    $('#classic-instruct').hide()
    $('#wm-instruct').hide()

    $instructSlide.show()

    if (task === 'classic') {
      $('#classic-instruct').show()
      $('#classic-instruct-text').show()
    } else if (task === 'wm') {
      $('#wm-instruct').show()
      $('#wm-instruct-text').show()
    }
    $('#start-button').text('Start PRACTICE')

    $('#start-button').on('click', function() {
      $instructSlide.hide()
      startTrials(task)
      $(this).off(); // to avoid restarting task 1 during task 2
    })
  };

// show stage and start countdown

  var startTrials = function(task) {
    $('.stim').hide()
    $('#stage').show()
    countDown(3, task, true)
  };

// countdown to first trial of either practice or real

  var countDown = function(number, task, practice) {
    var $fix = $('#intertrial');
    if (number > 0) {
        $('#fix-text').text(String(number))
        $fix.show()
        setTimeout(function() {
          $fix.hide()
          countDown(number - 1, task, practice)
        }, 1000);
      } else {
        setTimeout(function () {
          $fix.hide()
          $('#fix-text').text('*')
          if (task === 'classic') {
            practice ? runClassicPractice() : runClassic()
          } else if (task === 'wm') {
            practice ? runWMPractice() : runWM()
          }
        });
      };
  };

  // run one of two practice tasks

  var runClassicPractice = function() {
    displayWord('classic', PRACTICE_CLASSIC_NUM_TRIALS, true)
  };

  var runWMPractice = function() {
    displayWord('wm', PRACTICE_WM_NUM_TRIALS, true)
  };

  // run real tasks

  var startRealTrial = function(trialObject) {
    var $instructSlide = $('#init-task');
    $('#classic-instruct').hide()
    $('#wm-instruct').hide()
    $('#stage').hide()

    $instructSlide.show()

    if (trialObject.task === 'classic') {
      $('#classic-instruct').show()
    } else if (trialObject.task === 'wm') {
      $('#wm-instruct').show()
    }
    $('#start-button').text('Start TASK')

    $('#start-button').on('click', function() {
      $instructSlide.hide()
      $('#stage').show()
      countDown(3, trialObject.task, false)
      $(this).off();
    });
  };

  var runClassic = function() {
    displayWord('classic', CLASSIC_NUM_TRIALS, false)
  };

  var runWM = function() {
    displayWord('wm', WM_NUM_TRIALS, false)
  };

  // feedback (color) for practice

  var giveColorFeedback = function(trialObject, nextStep) {
    var $feedback = $('#feedback');
    $feedback.show()
    if (trialObject.colorResponse === 'NA') {
      $('#feedback-text').text('TOO SLOW!')
    } else if (trialObject.colorAccurate === true) {
      $('#feedback-text').text('CORRECT!')
    } else if (trialObject.colorAccurate == false) {
      $('#feedback-text').text('INCORRECT!')
    }
    setTimeout(function(){
      $feedback.hide()
      $('#feedback-text').text('')
      nextStep(trialObject)
    }, 1000);
  };

//feedback (same) for practice
  var giveSameFeedback = function(trialObject, nextStep) {
    var $feedback = $('#feedback');
    $feedback.show()
    if (trialObject.sameResponse === 'NA') {
      $('#feedback-text').text('TOO SLOW!')
    } else if (trialObject.sameAccurate === true) {
      $('#feedback-text').text('CORRECT!')
    } else if (trialObject.sameAccurate === false) {
      $('#feedback-text').text('INCORRECT!')
    }
    setTimeout(function(){
      $feedback.hide()
      nextStep(trialObject)
    }, 1000);
  };

// show word (colored for classic, bw word1 for wm)

  var displayWord = function(task, trialsLeft, practice) {
    var $word = $('#word');
    var trialObject = { task: task, trialsLeft: trialsLeft};
    trialObject.practice = practice;

    if (trialObject.task === 'wm') {
      if (trialObject.practice) {
        trialObject.trialNum = PRACTICE_WM_NUM_TRIALS - trialObject.trialsLeft;
        trialObject.word1 = PRACTICE_WM_TRIAL_ITEMS[trialObject.trialNum][0];
      } else {
        trialObject.trialNum = WM_NUM_TRIALS - trialObject.trialsLeft;
        trialObject.word1 = WM_TRIAL_ITEMS[trialObject.trialNum][0];
      }
      $('#word-text').text(trialObject.word1)
      $word.show()
      setTimeout(function() {
        $word.hide()
        interStim('patch', trialObject)
      }, WM_WORD1);
    }

    if (trialObject.task === 'classic') {
      if (trialObject.practice) {
        trialObject.trialNum = PRACTICE_CLASSIC_NUM_TRIALS - trialObject.trialsLeft;
        trialObject.word = PRACTICE_CLASSIC_TRIAL_ITEMS[trialObject.trialNum][0];
        trialObject.ink = PRACTICE_CLASSIC_TRIAL_ITEMS[trialObject.trialNum][1];
      } else {
        trialObject.trialNum = CLASSIC_NUM_TRIALS - trialObject.trialsLeft;
        trialObject.word = CLASSIC_TRIAL_ITEMS[trialObject.trialNum][0];
        trialObject.ink = CLASSIC_TRIAL_ITEMS[trialObject.trialNum][1];
      }
      $('#word-text').text(trialObject.word)
      $word.css('color', trialObject.ink)
      $word.show()
      var displayWordStart = new Date();
      trialObject.colorResponse = 'NA';
      trialObject.colorRT = 0;
      $(window).on('keypress', function(event) {
        handleColorResponse(event, displayWordStart, trialObject)
        $(this).off();
      });
      setTimeout(function() {
        $(this).off();
        $word.css('color', 'black')
        $word.hide()
        if (trialObject.practice) {
          trialObject.colorAccurate = trialObject.colorResponse ? (trialObject.ink === trialObject.colorResponse) : 'NA';
          giveColorFeedback(trialObject, function() {
            interTrial(trialObject)
          });
        } else {
          interTrial(trialObject)
        }
      }, CLASSIC_WORD);
    }

  };

// ITI between trials, send to next task/post-task if finished

  var interTrial = function(trialObject) {
    var $interTrial = $('#intertrial');
    $interTrial.show()
    var isiStart = new Date();

    if (trialObject.task === 'wm') {
      var ITI = WM_ITI;
      trialObject.isisameRT = 0;
      $(window).on('keypress', function(event) {
        handleSameResponse(event, isiStart, trialObject, isi = true)
        $(this).off();
      });
        if (trialObject.same) {
          trialObject.sameAccurate = trialObject.sameResponse ? (trialObject.sameResponse === "same") : 'NA';
        } else {
          trialObject.sameAccurate = trialObject.sameResponse ? (trialObject.sameResponse === "diff") : 'NA';
        }
      } else {
      var ITI = CLASSIC_ITI;
      trialObject.isicolorRT = 0;
      $(window).on('keypress', function(event) {
        handleColorResponse(event, isiStart, trialObject, isi = true)
        $(this).off();
      });
      trialObject.congruent = trialObject.ink === trialObject.word;
      trialObject.colorAccurate = trialObject.colorResponse ? (trialObject.ink === trialObject.colorResponse) : 'NA';
    };

    setTimeout(function() {
      $interTrial.hide()
      saveTrialData(trialObject);
      if (isBreak(trialObject)) {
        blockBreak(trialObject)
      } else if (trialObject.trialsLeft > 1) {
        displayWord(trialObject.task, trialObject.trialsLeft - 1, trialObject.practice)
      } else if (trialObject.practice) {
        startRealTrial(trialObject)
      } else {
        finishTask()
      }
    }, ITI);
  };

// break between blocks

  var blockBreak = function(trialObject) {
    var $breakSlide = $('#break-block');
    $('#stage').hide()
    $breakSlide.show()

    $('#continue-button').on('click', function() {
      $breakSlide.hide()
      $('#stage').show()
      displayWord(trialObject.task, trialObject.trialsLeft - 1, false)
      $(this).off();
    })
  };

// check if time for block break
  var isBreak = function(trialObject) {
  return trialObject.practice === false &&
    trialObject.task === 'wm' &&
    trialObject.trialNum === WM_NUM_TRIALS/NUM_BLOCKS - 1;
  };

// both ISIs for WM task

  var interStim = function(next, trialObject) {
    var $fix = $('#interstim');
    $fix.show()

    if (next === 'patch') {
      setTimeout(function() {
        $fix.hide()
        displayPatch(trialObject)
      }, WM_ISI1);
    } else if (next === 'probe') {
      var isiStart = new Date();
      trialObject.isicolorRT = 0;
      $(window).on('keypress', function(event) {
        handleColorResponse(event, isiStart, trialObject, isi = true)
        $(this).off();
      });
      trialObject.congruent = trialObject.patch === trialObject.word1;
      trialObject.colorAccurate = trialObject.colorResponse ? (trialObject.patch === trialObject.colorResponse) : 'NA';


      setTimeout(function() {
        $fix.hide()
        displayProbe(trialObject)
      }, WM_ISI2);
    }
  };

// color patch for wm task

  var displayPatch = function(trialObject) {
    trialObject.patch = WM_TRIAL_ITEMS[trialObject.trialNum][1];
    var $patch = $('#'.concat(trialObject.patch,"-patch"));
    $patch.show()
    var displayPatchStart = new Date();
    trialObject.colorRT = 0;
    trialObject.colorResponse = 'NA';
    $(window).on('keypress', function(event) {
      handleColorResponse(event, displayPatchStart, trialObject)
      $(this).off();
    });
    setTimeout(function() {
      $patch.hide()
      $(this).off()
      if (trialObject.practice) {
        trialObject.colorAccurate = trialObject.colorResponse ? (trialObject.patch === trialObject.colorResponse) : 'NA';
        giveColorFeedback(trialObject, function() {
          interStim('probe', trialObject)
        });
      } else {
        interStim('probe', trialObject)
      }
    }, WM_PATCH);
  };

// bw word probe for wm task

  var displayProbe = function(trialObject) {
    var $probe = $('#probe');
    trialObject.word2 = WM_TRIAL_ITEMS[trialObject.trialNum][2];

    var $probeInstruct = $('#probe-instruct');
    $probeInstruct.show()
    $('#probe-text').text(trialObject.word2)
    $probe.show()
    var displayProbeStart = new Date();
    trialObject.sameRT = 0;
    trialObject.sameResponse = 'NA';
    $(window).on('keypress', function(event) {
      handleSameResponse(event, displayProbeStart, trialObject)
      $(this).off();
    });
    setTimeout(function() {
      $(this).off();
      $probeInstruct.hide()
      $probe.hide()
      trialObject.same = trialObject.word1 === trialObject.word2;
      if (trialObject.practice) {
        if (trialObject.same) {
          trialObject.sameAccurate = trialObject.sameResponse ? (trialObject.sameResponse === "same") : 'NA';
        } else {
          trialObject.sameAccurate = trialObject.sameResponse ? (trialObject.sameResponse === "diff") : 'NA';
        }
        giveSameFeedback(trialObject, function() {
          interTrial(trialObject)
        });
      } else {
        interTrial(trialObject)
      }
    }, WM_PROBE);
  };

// color/same vs different response handling & mapping

  var mapColorResponse = function(keyCode) {
    var responseKey = String.fromCharCode(keyCode);
    return COLOR_RESPONSE_MAPPINGS[responseKey];
  };

  var mapSameResponse = function(keyCode) {
    var responseKey = String.fromCharCode(keyCode);
    return SAME_RESPONSE_MAPPINGS[responseKey];
  };

  var handleColorResponse = function(event, displayStart, trialObject, isi) {
    resp = mapColorResponse(event.keyCode);
    var responseTime = new Date();
    if (isi) {
      if (trialObject.colorResponse === 'NA') { // if no response already given
        if (resp) {trialObject.colorResponse = resp};
        trialObject.isicolorRT = responseTime - displayStart;
      }
    } else {
      if (resp) {trialObject.colorResponse = resp};
      trialObject.colorRT = responseTime - displayStart;
      trialObject.isicolorRT = 0;
    }
  };

  var handleSameResponse = function(event, displayStart, trialObject, isi) {
    resp = mapSameResponse(event.keyCode);
    var responseTime = new Date();
    if (isi) {
      if (trialObject.sameResponse === 'NA') { // if no response already given
        if (resp) {trialObject.sameResponse = resp};
        trialObject.isisameRT = responseTime - displayStart;
      }
    } else {
      if (resp) {trialObject.sameResponse = resp};
      trialObject.sameRT = responseTime - displayStart;
      trialObject.isisameRT = 0;
    }
  };

// add trial object to output object

  var saveTrialData = function(trialObject) {
    experimentData.trialData.push(trialObject)
  };

// fin (or, task2!)

  var finishTask = function() {
      numTasksRun++;
      $("#stage").hide()
      if (numTasksRun === 1) {
        initTask(TASK_ORDER[1])
      } else if (numTasksRun === 2) {
        $('#finished').show()
        setTimeout(function() {
          turk.submit(experimentData, true)
        }, 1500);
      }
  };

// here we go!
  showWelcome();

});