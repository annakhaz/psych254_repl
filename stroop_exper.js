$(function(){
  
  // TODO figure out why fixation and patch still showing up during classic!!! something is wonky.
  
  
  var CLASSIC_NUM_TRIALS = 4; //96;
  var WM_NUM_TRIALS = 10; //120;
  var NUM_BLOCKS = 4;
  
  var TASK_ORDER = _(['classic', 'wm']).shuffle(); 
  var num_tasks_run = 0
  
  // [word1, patch, word2, ?, congruency]
  var WM_TRIAL_ITEMS = _([[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,3,1,2],[1,1,3,1,2],[1,1,3,1,2],
  [1,1,2,1,2],[1,1,4,1,2],[1,1,4,1,2],[1,1,4,1,2],[1,3,1,2,1],[1,3,1,2,1],[1,3,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,4,1,2,1],
  [1,3,2,2,2],[1,3,4,2,2],[1,3,3,2,2],[1,4,4,2,2],[1,4,3,2,2],[1,4,2,2,2],[1,2,2,2,2],[1,2,3,2,2],[1,2,4,2,2],[2,2,2,1,1],
  [2,2,2,1,1],[2,2,2,1,1],[2,2,2,1,1],[2,2,2,1,1],[2,2,2,1,1],[2,2,2,1,1],[2,2,2,1,1],[2,2,2,1,1],[2,2,3,1,2],[2,2,3,1,2],
  [2,2,1,1,2],[2,2,1,1,2],[2,2,1,1,2],[2,2,4,1,2],[2,2,4,1,2],[2,2,4,1,2],[2,1,2,2,1],[2,1,2,2,1],[2,1,2,2,1],[2,3,2,2,1],
  [2,3,2,2,1],[2,3,2,2,1],[2,4,2,2,1],[2,4,2,2,1],[2,4,2,2,1],[2,1,1,2,2],[2,1,4,2,2],[2,4,1,2,2],[2,4,3,2,2],[2,4,4,2,2],
  [2,3,1,2,2],[2,3,3,2,2],[2,3,4,2,2],[3,3,3,1,1],[3,3,3,1,1],[3,3,3,1,1],[3,3,3,1,1],[3,3,3,1,1],[3,3,3,1,1],[3,3,3,1,1],
  [3,3,1,1,2],[3,3,1,1,2],[3,3,1,1,2],[3,3,2,1,2],[3,3,4,1,2],[3,3,4,1,2],[3,3,4,1,2],[3,1,3,2,1],[3,1,3,2,1],[3,1,3,2,1],
  [3,2,3,2,1],[3,2,3,2,1],[3,4,3,2,1],[3,4,3,2,1],[3,4,3,2,1],[3,1,1,2,2],[3,1,4,2,2],[3,2,1,2,2],[3,2,4,2,2],[3,4,1,2,2],
  [3,4,2,2,2],[4,4,4,1,1],[4,4,4,1,1],[4,4,4,1,1],[4,4,4,1,1],[4,4,4,1,1],[4,4,4,1,1],[4,4,3,1,2],[4,4,3,1,2],[4,4,3,1,2],
  [4,4,2,1,2],[4,4,2,1,2],[4,4,2,1,2],[4,4,1,1,2],[4,4,1,1,2],[4,4,1,1,2],[4,3,4,2,1],[4,3,4,2,1],[4,3,4,2,1],[4,2,4,2,1],
  [4,2,4,2,1],[4,1,4,2,1],[4,1,4,2,1],[4,1,3,2,2],[4,3,1,2,2],[4,3,3,2,2],[4,3,2,2,2],[4,2,1,2,2],[4,2,3,2,2],[4,2,2,2,2]]).shuffle();  
  
  var COLORS = ['red', 'green', 'blue', 'yellow']
  
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
      $('#word-text').text(COLORS[WM_TRIAL_ITEMS[WM_NUM_TRIALS-trialsLeft][0] - 1])
      $word.show()
      debugger
      setTimeout(function() {
        $word.hide()
        //interTrial(task, trialsLeft) //for testing
        interStim('patch', trialsLeft) 
      }, 500);
    }
    
    if (task === 'classic') {
      $('#word-text').text(COLORS[WM_TRIAL_ITEMS[CLASSIC_NUM_TRIALS - trialsLeft][0] - 1]) //temp; need to make classic trial items
      $word.css('color', _(COLORS).shuffle()[0])
      $word.show()
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
        interTrial('wm', trialsLeft) //temp
        //displayProbe(trialsLeft) //temp
      }, 1000);
    }
   
  }

  
  var displayPatch = function(trialsLeft) {
    var $patch = $('#'.concat(COLORS[WM_TRIAL_ITEMS[WM_NUM_TRIALS-trialsLeft][1] - 1],"-patch"));
    $patch.show()
    
    setTimeout(function() {
      $patch.hide()
      interStim('probe', trialsLeft)
    }, 500);
  }
  
  var displayProbe = function(trialsLeft) {
    //
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