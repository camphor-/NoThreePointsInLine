var Main, are_three_in_a_line, arraysEqual, clearConflict, clearGuide, judge, pickQueenImageNumber, playBGM, playClick, playNyah, playSound, refreshGuide, removeElem, replaceScene, reset, showMessage, showResult, startTimer, switchGuide, toggle, updateCountLabel, updateJudgeButtonState, updateTimeLabel;

Main = {
  max_piece: 16,
  blocks: [[], [], [], [], [], [], [], []],
  queens: [],
  guides: [],
  guideEnabled: false,
  count: 0,
  time: 0,
  timer: null,
  result: false,
  queenImageUsed: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
};

replaceScene = function(id) {
  var i, s, scenes, _i, _len;
  scenes = ['intro', 'main', 'message'];
  for (i = _i = 0, _len = scenes.length; _i < _len; i = ++_i) {
    s = scenes[i];
    $('#' + s).hide();
  }
  return $('#' + id).show();
};

toggle = function(block) {
  var imageNum, queen;
  if (block.status) {
    $(block).removeClass('active');
    console.log('Remove cat' + block.image);
    $(block).removeClass('cat' + block.image);
    Main.queenImageUsed[block.image] = false;
    block.status = 0;
    Main.count--;
    queen = {
      x: block.x,
      y: block.y
    };
    console.log(Main.queens);
    removeElem(Main.queens, queen);
  } else if (Main.count < Main.max_piece) {
    imageNum = pickQueenImageNumber();
    Main.queenImageUsed[imageNum] = true;
    $(block).addClass('active');
    $(block).addClass('cat' + imageNum);
    console.log('Add cat' + imageNum);
    block.status = 1;
    block.image = imageNum;
    Main.count++;
    queen = {
      x: block.x,
      y: block.y
    };
    console.log(block.x + "," + block.y);
    Main.queens.push(queen);
    playNyah();
  }
  if (Main.guideEnabled) {
    refreshGuide();
  }
  updateCountLabel();
  return updateJudgeButtonState();
};

updateJudgeButtonState = function() {
  if (Main.count === Main.max_piece) {
    return $('#judgebutton').removeClass('disabled');
  } else {
    return $('#judgebutton').addClass('disabled', 'disabled');
  }
};

judge = function() {
  var i, j, k, _i, _j, _k, _ref, _ref1, _ref2;
  for (i = _i = 2, _ref = Main.max_piece; 2 <= _ref ? _i < _ref : _i > _ref; i = 2 <= _ref ? ++_i : --_i) {
    for (j = _j = 1, _ref1 = i - 1; 1 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
      for (k = _k = 0, _ref2 = j - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; k = 0 <= _ref2 ? ++_k : --_k) {
        if (are_three_in_a_line(i, j, k)) {
          return false;
        }
      }
    }
  }
  return true;
};

are_three_in_a_line = function(i, j, k) {
  var dx12, dx13, dy12, dy13, q1, q2, q3, _ref, _ref1, _ref2;
  if (i === j || j === k || i === k) {
    return false;
  }
  q1 = Main.queens[i];
  q2 = Main.queens[j];
  q3 = Main.queens[k];
  if (q1.x > q2.x) {
    _ref = [q2, q1], q1 = _ref[0], q2 = _ref[1];
  }
  if (q1.x > q3.x) {
    _ref1 = [q3, q1], q1 = _ref1[0], q3 = _ref1[1];
  }
  if (q2.x > q3.x) {
    _ref2 = [q3, q2], q2 = _ref2[0], q3 = _ref2[1];
  }
  dx12 = q2.x - q1.x;
  dy12 = q2.y - q1.y;
  dx13 = q3.x - q1.x;
  dy13 = q3.y - q1.y;
  return dy12 * dx13 === dx12 * dy13;
};

updateCountLabel = function() {
  return $('#countlabel').html('×' + Main.count + '/' + Main.max_piece);
};

updateTimeLabel = function() {
  $('#timelabel').html(Main.time + '秒');
  return Main.time++;
};

startTimer = function() {
  Main.time = 0;
  if (Main.timer) {
    clearInterval(Main.timer);
  }
  return Main.timer = setInterval(updateTimeLabel, 1000);
};

reset = function() {
  var block, g, i, j, _i, _j, _k, _len, _ref;
  Main.count = 0;
  updateCountLabel();
  for (i = _i = 0; _i < 8; i = ++_i) {
    Main.queenImageUsed[i] = false;
    for (j = _j = 0; _j < 8; j = ++_j) {
      block = Main.blocks[i][j];
      block.status = 0;
      block.conflict = false;
      $(block).removeClass('active');
      $(block).removeClass('mark');
      $(block).removeClass(function(index, css) {
        return (css.match(/cat\d/g) || []).join(' ');
      });
    }
  }
  Main.queens = [];
  _ref = Main.guides;
  for (i = _k = 0, _len = _ref.length; _k < _len; i = ++_k) {
    g = _ref[i];
    g.remove();
  }
  Main.guides = [];
  return updateJudgeButtonState();
};

showMessage = function(mes) {
  $('.messagelabel').html(mes);
  return $('#message').show();
};

showResult = function() {
  if (!$(this).hasClass('disabled')) {
    if (judge()) {
      clearInterval(Main.timer);
      showMessage("正解！<br>✌(’ω’✌ )三✌(’ω’)✌三( ✌’ω’)✌<br><br>タイム: " + (Main.time - 1) + "秒");
      return Main.result = true;
    } else {
      showMessage("不正解<br>('ω'乂)");
      return Main.result = false;
    }
  }
};

switchGuide = function() {
  if (Main.guideEnabled) {
    $('#guidebutton').removeClass('active');
    $('#guidebutton').html('ガイドON');
    clearGuide();
  } else {
    $('#guidebutton').addClass('active');
    $('#guidebutton').html('ガイドOFF');
    refreshGuide();
  }
  return Main.guideEnabled = !Main.guideEnabled;
};

refreshGuide = function() {
  var block, guide, i, j, k, mark, q, qb, qi, qj, qk, queens, _i, _j, _k, _l, _len, _ref, _ref1, _results;
  console.log("call refreshGuide!!!");
  clearGuide();
  clearConflict();
  queens = Main.queens;
  for (i = _i = 0, _ref = queens.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    for (j = _j = 0; 0 <= i ? _j < i : _j > i; j = 0 <= i ? ++_j : --_j) {
      for (k = _k = 0; 0 <= j ? _k < j : _k > j; k = 0 <= j ? ++_k : --_k) {
        console.log(i + "," + j + "," + k);
        if (are_three_in_a_line(i, j, k)) {
          console.log("    conflict!!!");
          _ref1 = [queens[i], queens[j], queens[k]], qi = _ref1[0], qj = _ref1[1], qk = _ref1[2];
          Main.blocks[qi.x][qi.y].conflict = true;
          Main.blocks[qj.x][qj.y].conflict = true;
          Main.blocks[qk.x][qk.y].conflict = true;
        }
      }
    }
  }
  _results = [];
  for (i = _l = 0, _len = queens.length; _l < _len; i = ++_l) {
    q = queens[i];
    guide = $('<div>').addClass('guide');
    guide.x = q.x;
    guide.y = q.y;
    qb = Main.blocks[q.x][q.y];
    block = $(qb);
    block.append(guide);
    if (qb.conflict) {
      mark = $('<div>').addClass('mark');
      $(guide).append(mark);
    }
    _results.push(Main.guides.push(guide));
  }
  return _results;
};

clearGuide = function() {
  var g, i, _i, _len, _ref;
  _ref = Main.guides;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    g = _ref[i];
    $(Main.blocks[g.x][g.y]).removeClass('mark');
    g.remove();
  }
  return Main.guides = [];
};

clearConflict = function() {
  var i, j, _i, _results;
  _results = [];
  for (i = _i = 0; _i < 8; i = ++_i) {
    _results.push((function() {
      var _j, _results1;
      _results1 = [];
      for (j = _j = 0; _j < 8; j = ++_j) {
        _results1.push(Main.blocks[i][j].conflict = false);
      }
      return _results1;
    })());
  }
  return _results;
};

pickQueenImageNumber = function() {
  var b, i, _i, _len, _ref;
  _ref = Main.queenImageUsed;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    b = _ref[i];
    if (!b) {
      return i;
    }
  }
};

playBGM = function() {
  var bgm;
  bgm = new Audio('../sound/bgm.wav');
  bgm.loop = true;
  return bgm.play();
};

playNyah = function() {
  Main.nyahSound = new Audio('../sound/cat.wav');
  return Main.nyahSound.play();
};

playClick = function() {
  Main.clickSound = new Audio('../sound/click.wav');
  return Main.clickSound.play();
};

playSound = function(path) {
  var sound;
  sound = new Audio(path);
  return sound.play();
};

removeElem = function(array, value) {
  var elem, i, removeIndexes, val, _i, _j, _len, _len1, _results;
  removeIndexes = [];
  for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
    elem = array[i];
    if (elem.x === value.x && elem.y === value.y) {
      removeIndexes.push(i);
    }
  }
  _results = [];
  for (i = _j = 0, _len1 = removeIndexes.length; _j < _len1; i = ++_j) {
    val = removeIndexes[i];
    _results.push(array = array.splice(val - i, 1));
  }
  return _results;
};

Array.prototype.isEqualToArray = function(array) {
  return arraysEqual(this, array);
};

arraysEqual = function(arrayA, arrayB) {
  var a, b, i, v, _i, _len;
  if (arrayA.length !== arrayB.length) {
    return false;
  }
  for (i = _i = 0, _len = arrayA.length; _i < _len; i = ++_i) {
    v = arrayA[i];
    a = arrayA[i];
    b = arrayB[i];
    if ((a instanceof Array) && (b instanceof Array)) {
      if (!arraysEqual(a, b)) {
        return false;
      }
    } else {
      if (a !== b) {
        return false;
      }
    }
  }
  return true;
};

$(function() {
  var block, blocks, i, j, _i, _j;
  playBGM();
  replaceScene('intro');
  blocks = $('.block');
  for (i = _i = 0; _i < 8; i = ++_i) {
    for (j = _j = 0; _j < 8; j = ++_j) {
      block = blocks[i * 8 + j];
      block.x = i;
      block.y = j;
      block.status = 0;
      block.conflict = false;
      console.log(i + "," + j);
      block.onclick = function() {
        return toggle(this);
      };
      Main.blocks[i].push(block);
    }
  }
  updateCountLabel();
  $('#startbutton').click(function() {
    replaceScene('main');
    Main.time = 0;
    startTimer();
    updateTimeLabel();
    return playSound('../sound/start.wav');
  });
  $('#judgebutton').click(function() {
    playClick();
    if (!$('#judgebutton').hasClass('disabled')) {
      return showResult();
    }
  });
  $('#resetbutton').click(function() {
    playSound('../sound/reset.wav');
    return reset();
  });
  $('#backbutton').click(function() {
    if (Main.result) {
      reset();
      Main.guideEnabled = true;
      switchGuide();
      replaceScene('intro');
      playClick();
    }
    return $('#message').hide();
  });
  return $('#guidebutton').click(function() {
    return switchGuide();
  });
});
