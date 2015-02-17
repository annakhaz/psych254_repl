$(function(){

//set num trials and blocks

  var CLASSIC_NUM_TRIALS = 4; //96; --> dividing in half, 49 -> 48 to be divis by 4
  var WM_NUM_TRIALS = 4; //120; --> dividing in half, 60 -> 72 to work with stim balancing
  var NUM_BLOCKS = 2;

//set up task order (classic vs wm stroop first)

  var TASK_ORDER = _(['classic', 'wm']).shuffle();
  var numTasksRun = 0;

//shuffle stims

  var CLASSIC_TRIAL_ITEMS = _(classic_items).shuffle();
  var WM_TRIAL_ITEMS = _(wm_items).shuffle();

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
    subID: 0,
    taskOrder: TASK_ORDER,
    classicTrialOrder: CLASSIC_TRIAL_ITEMS,
    wmTrialOrder: WM_TRIAL_ITEMS,
    trialData: []
  };

//start! show instructions and wait for click

  var initTask = function(task) {

    var $instructSlide = $('#init-task');
    $('#classic-instruct').hide()
    $('#wm-instruct').hide()

    $instructSlide.show()

    if (task === 'classic') {
      $('#classic-instruct').show()
    } else if (task === 'wm') {
      $('#wm-instruct').show()
    }

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
    countDown(3, task)
  };


// countdown to first trial

  var countDown = function(number, task) {
    var $fix = $('#intertrial');
    if (number > 0) {
        $('#fix-text').text(String(number))
        $fix.show()
        setTimeout(function() {
          $fix.hide()
          countDown(number - 1, task)
        }, 1000);
      } else {
        setTimeout(function () {
          $fix.hide()
          $('#fix-text').text('*')
          if (task === 'classic') {
            runClassic()
          } else if (task === 'wm') {
            runWM()
          }
        });
      };
  };

  // run one of two tasks

  var runClassic = function() {
    displayWord('classic', CLASSIC_NUM_TRIALS)
  };

  var runWM = function() {
    displayWord('wm', WM_NUM_TRIALS)
  };

// show word (colored for classic, bw word1 for wm)

  var displayWord = function(task, trialsLeft) {
    var $word = $('#word');
    var trialObject = { task: task, trialsLeft: trialsLeft};

    if (trialObject.task === 'wm') {
      trialObject.trialNum = WM_NUM_TRIALS - trialObject.trialsLeft;
      trialObject.word1 = WM_TRIAL_ITEMS[trialObject.trialNum][0];
      $('#word-text').text(trialObject.word1)
      $word.show()
      setTimeout(function() {
        $word.hide()
        interStim('patch', trialObject)
      }, WM_WORD1);
    }

    if (trialObject.task === 'classic') {
      trialObject.trialNum = CLASSIC_NUM_TRIALS - trialObject.trialsLeft;
      trialObject.word = CLASSIC_TRIAL_ITEMS[trialObject.trialNum][0];
      $('#word-text').text(trialObject.word)
      trialObject.ink = CLASSIC_TRIAL_ITEMS[trialObject.trialNum][1];
      $word.css('color', trialObject.ink)
      $word.show()
      var displayWordStart = new Date();
      $(window).on('keypress', function(event) {
        handleColorResponse(event, displayWordStart, trialObject)
        $(this).off();
      });
      setTimeout(function() {
        $(this).off();
        $word.css('color', 'black')
        $word.hide()
        trialObject.colorAccurate = trialObject.colorResponse ? (trialObject.ink === trialObject.colorResponse) : 'NA';
        interTrial(task, trialObject)
      }, CLASSIC_WORD);
    }

  };

// ITI between trials, send to next task/post-task if finished

  var interTrial = function(task, trialObject) {
    var $interTrial = $('#intertrial');
    $interTrial.show()
    if (task === 'wm') {
      var ITI = WM_ITI;
    } else {
      var ITI = CLASSIC_ITI;
    };
    setTimeout(function() {
      $interTrial.hide()
      saveTrialData(trialObject)
      if (trialObject.trialsLeft > 1) {
        displayWord(task, trialObject.trialsLeft - 1)
      } else {
        finishTask()
      }
    }, ITI);
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
    $(window).on('keypress', function(event) {
      handleColorResponse(event, displayPatchStart, trialObject)
      $(this).off();
    });
    setTimeout(function() {
      $patch.hide()
      $(this).off()
      trialObject.colorAccurate = trialObject.colorResponse ? (trialObject.patch === trialObject.colorResponse) : 'NA';
      interStim('probe', trialObject)
    }, WM_PATCH);
  };

// bw word probe for wm task

  var displayProbe = function(trialObject) {
    var $probe = $('#probe');
    trialObject.word2 = WM_TRIAL_ITEMS[trialObject.trialNum][2];
    $('#probe-text').text(trialObject.word2)
    $probe.show()
    var displayProbeStart = new Date();
    $(window).on('keypress', function(event) {
      handleSameResponse(event, displayProbeStart, trialObject)
      $(this).off();
    });
    setTimeout(function() {
      $(this).off();
      $probe.hide()
      if (trialObject.word1 === trialObject.word2) {
        trialObject.same = "yes";
        trialObject.sameAccurate = trialObject.sameResponse ? (trialObject.sameResponse === "same") : 'NA';
      } else {
        trialObject.same = "no";
        trialObject.sameAccurate = trialObject.sameResponse ? (trialObject.sameResponse === "diff") : 'NA';
      }
      interTrial('wm', trialObject)
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

  var handleColorResponse = function(event, displayStart, trialObject) {
    trialObject.colorResponse = mapColorResponse(event.keyCode);
    var responseTime = new Date();
    trialObject.colorRT = responseTime - displayStart;
  };

  var handleSameResponse = function(event, displayStart, trialObject) {
    trialObject.sameResponse = mapSameResponse(event.keyCode);
    var responseTime = new Date();
    trialObject.sameRT = responseTime - displayStart;
  };

// add trial object to output object

  var saveTrialData = function(trialObject) {
    console.log('pushing: ', trialObject)
    experimentData.trialData.push(trialObject)
  };

  var finishTask = function() {
      numTasksRun++;
      $("#stage").hide()
      if (numTasksRun === 1) {
        initTask(TASK_ORDER[1])
      } else if (numTasksRun === 2) {
        $('#finished').show()
        console.log(experimentData)
      }
  };

// here we go!

  initTask(TASK_ORDER[0]);

});