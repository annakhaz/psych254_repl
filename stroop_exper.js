$(function(){

  var CLASSIC_NUM_TRIALS = 4; //96; --> dividing in half, 49 -> 48 to be divis by 4
  var WM_NUM_TRIALS = 4; //120; --> dividing in half, 60 -> 72 to work with stim balancing
  var NUM_BLOCKS = 2;

  var TASK_ORDER = _(['classic', 'wm']).shuffle();
  var numTasksRun = 0;

  var CLASSIC_TRIAL_ITEMS = _(classic_items).shuffle();
  var WM_TRIAL_ITEMS = _(wm_items).shuffle();

  var COLOR_RESPONSE_MAPPINGS = {
    'a': 'red',
    's': 'blue',
    'j': 'green',
    'k': 'yellow'
  };

  var SAME_RESPONSE_MAPPINGS = {'0': 'diff', '1': 'same'};

// timing
  var ITI = 1000;
  var WM_ISI = 1000;
  var WM_ISI2 = 2000;
  var WM_WORD1 = 500; //1000; // <temp 500;
  var WM_PATCH = 500;
  var WM_PROBE = 3000;
  var CLASSIC_WORD = 500; //1000; // <temp 500;

  var experimentData = {
    subID: 0,
    taskOrder: TASK_ORDER,
    classicTrialOrder: CLASSIC_TRIAL_ITEMS,
    wmTrialOrder: WM_TRIAL_ITEMS,
    trials: []
  };

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
      startTrials(task);
      $(this).off(); // to avoid restarting task 1 during task 2
    })
  };

  var startTrials = function(task) {
    $('.stim').hide()
    $('#stage').show()
    if (task === 'classic') {
      runClassic()
    } else if (task === 'wm') {
      runWM()
    }
  };

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

  var interTrial = function(task, trialObject) {
    var $interTrial = $('#intertrial');
    $interTrial.show()
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

  var interStim = function(next, trialObject) {
    var $fix = $('#interstim');
    $fix.show()
    if (next === 'patch') {
      setTimeout(function() {
        $fix.hide()
        displayPatch(trialObject)
      }, WM_ISI2);
    } else if (next === 'probe') {
      setTimeout(function() {
        $fix.hide()
        displayProbe(trialObject)
      }, WM_ISI);
    }
  };


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

  var saveTrialData = function(trialObject) {
    console.log('pushing: ', trialObject)
    experimentData.trials.push(trialObject)
  };

  var runClassic = function() {
    displayWord('classic', CLASSIC_NUM_TRIALS)
  };

  var runWM = function() {
    displayWord('wm', WM_NUM_TRIALS)
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


  initTask(TASK_ORDER[0]);

});