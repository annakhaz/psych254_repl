$(function(){
    
  
  var CLASSIC_NUM_TRIALS = 4; //96; --> dividing in half, 49 -> 48 to be divis by 4
  var WM_NUM_TRIALS = 10; //120; --> dividing in half, 60
  var NUM_BLOCKS = 2;
  
  var TASK_ORDER = _(['classic', 'wm']).shuffle(); 
  var num_tasks_run = 0;
  
  CLASSIC_TRIAL_ITEMS = _(classic_items).shuffle();
  WM_TRIAL_ITEMS = _(wm_items).shuffle();
  
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
  
    $('#start-button').on("click", function() {
      $instructSlide.hide()
      startTrials(task); 
      $(this).off(); // to avoid restarting task 1 during task 2
    })
  }
  
  var startTrials = function(task) {
    $('.stim').hide()
    $('#stage').show()
    if (task === 'classic') {
      runClassic()
    } else if (task === 'wm') {
      runWM()
    }
  }
  
  var displayWord = function(task, trialsLeft) {
    var $word = $('#word');
    
    if (task === 'wm') {
      $('#word-text').text(WM_TRIAL_ITEMS[WM_NUM_TRIALS-trialsLeft][0])
      $word.show()
      debugger
      setTimeout(function() {
        $word.hide()
        interStim('patch', trialsLeft) 
      }, 500);
    }
    
    if (task === 'classic') {
      $('#word-text').text(CLASSIC_TRIAL_ITEMS[CLASSIC_NUM_TRIALS - trialsLeft][1])
      $word.css('color', CLASSIC_TRIAL_ITEMS[CLASSIC_NUM_TRIALS-trialsLeft][0])
      $word.show()
      // new date to start RT?
      setTimeout(function() {
        $word.hide()
        interTrial(task, trialsLeft)
      }, 500);
    }
    
   
    
  }
  
  var interTrial = function(task, trialsLeft) {
    var $interTrial = $('#intertrial');
    $interTrial.show()
    setTimeout(function() {
      $interTrial.hide()
      if (trialsLeft > 1) {
        displayWord(task, trialsLeft - 1)
      } else {
        finishTask()
      }
    }, 1000);
  }
  
  // WM stroop task only
  var interStim = function(next, trialsLeft) {
    // between word and patch - 2000ms, or patch and probe - 1000ms
    var $fix = $('#interstim');
    $fix.show()
    if (next === 'patch') {
      setTimeout(function() {
        $fix.hide()
        displayPatch(trialsLeft)
      }, 2000);
    } else if (next === 'probe') {
      setTimeout(function() {
        $fix.hide()
        //interTrial('wm', trialsLeft) //temp
        displayProbe(trialsLeft)
      }, 1000);
    }
   
  }

  
  var displayPatch = function(trialsLeft) {
    var $patch = $('#'.concat(WM_TRIAL_ITEMS[WM_NUM_TRIALS-trialsLeft][1],"-patch"));
    $patch.show()
    // new date for RT?
    setTimeout(function() {
      $patch.hide()
      interStim('probe', trialsLeft)
    }, 500);
  }
  
  var displayProbe = function(trialsLeft) {
    var $probe = $('#probe');
    $('#probe-text').text(WM_TRIAL_ITEMS[WM_NUM_TRIALS-trialsLeft][2])
    $probe.show()
    // new date for RT?
    // capture response, can call saveTrialData now to calc accuracy, RTs, and record answers
    setTimeout(function() {
      $probe.hide()
      interTrial('wm', trialsLeft) 
    }, 3000);
  }
  
  var saveTrialData = function() {
    // calc accuracy, RT; record answers; save into data struc
  }
  
  var runClassic = function() {
    displayWord('classic', CLASSIC_NUM_TRIALS)
  }
  
  var runWM = function() {
    displayWord('wm', WM_NUM_TRIALS)
  }
  
  var finishTask = function() {
      num_tasks_run++;
      $("#stage").hide()
      if (num_tasks_run === 1) {
        initTask(TASK_ORDER[1])
      } else if (num_tasks_run === 2) {
        $('#finished').show() 
      }
  }


  initTask(TASK_ORDER[0]); 
  
});