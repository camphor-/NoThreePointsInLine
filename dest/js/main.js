var Main, arraysEqual, clearGuide, is_affected, judge, pickQueenImageNumber, refreshGuide, removeElem, replaceScene, reset, showMessage, showResult, startTimer, switchGuide, toggle, updateCountLabel, updateJudgeButtonState, updateTimeLabel;

Main = {
  blocks: [[], [], [], [], [], [], [], []],
  queens: [],
  guides: [],
  guideEnabled: false,
  count: 0,
  time: 0,
  timer: null,
  result: false,
  queenImageUsed: [false, false, false, false, false, false, false, false]
};

$(function() {
  var block, blocks, i, j, _i, _j;
  replaceScene('intro');
  blocks = $('.block');
  for (i = _i = 0; _i < 8; i = ++_i) {
    for (j = _j = 0; _j < 8; j = ++_j) {
      block = blocks[i * 8 + j];
      block.x = i;
      block.y = j;
      block.status = 0;
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
    return updateTimeLabel();
  });
  $('#judgebutton').click(function() {
    if (!$('#judgebutton').hasClass('disabled')) {
      return showResult();
    }
  });
  $('#resetbutton').click(function() {
    return reset();
  });
  $('#backbutton').click(function() {
    if (Main.result) {
      reset();
      Main.guideEnabled = true;
      switchGuide();
      replaceScene('intro');
    }
    return $('#message').hide();
  });
  return $('#guidebutton').click(function() {
    return switchGuide();
  });
});

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
    console.log('cat' + block.image);
    $(block).removeClass('cat' + block.image);
    Main.queenImageUsed[block.image] = false;
    block.status = 0;
    Main.count--;
    console.log("hogehoge");
    queen = {
      x: block.x,
      y: block.y
    };
    console.log(Main.queens);
    removeElem(Main.queens, queen);
    console.log("fugafuga");
  } else if (Main.count < 5) {
    imageNum = pickQueenImageNumber();
    $(block).addClass('active');
    $(block).addClass('cat' + imageNum);
    block.status = 1;
    block.image = imageNum;
    Main.count++;
    queen = {
      x: block.x,
      y: block.y
    };
    Main.queens.push(queen);
    console.log("hoge");
  }
  if (Main.guideEnabled) {
    refreshGuide();
  }
  console.log("fuga");
  updateCountLabel();
  return updateJudgeButtonState();
};

updateJudgeButtonState = function() {
  if (Main.count === 5) {
    return $('#judgebutton').removeClass('disabled');
  } else {
    return $('#judgebutton').addClass('disabled', 'disabled');
  }
};

judge = function() {
  var i, is_ok, j, q, _i, _j, _k, _len, _ref;
  for (i = _i = 0; _i < 8; i = ++_i) {
    for (j = _j = 0; _j < 8; j = ++_j) {
      is_ok = false;
      _ref = Main.queens;
      for (_k = 0, _len = _ref.length; _k < _len; _k++) {
        q = _ref[_k];
        if (is_affected(i, j, q)) {
          is_ok = true;
          continue;
        }
      }
      if (!is_ok) {
        return false;
      }
    }
  }
  return true;
};

is_affected = function(x, y, queen) {
  var diagonal, horizon, nx, ny, qx, qy, vertical;
  nx = x + 1;
  ny = y + 1;
  qx = queen.x + 1;
  qy = queen.y + 1;
  horizon = qx === nx;
  vertical = qy === ny;
  diagonal = (ny + nx === qx + qy) || (nx - ny === qx - qy);
  return horizon || vertical || diagonal;
};

updateCountLabel = function() {
  console.log("call updateCountLabel!!! " + Main.count);
  return $('#countlabel').html('×' + Main.count + '/5');
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
  var block, guide, i, q, queens, x, y, _i, _len, _results;
  clearGuide();
  queens = Main.queens;
  _results = [];
  for (i = _i = 0, _len = queens.length; _i < _len; i = ++_i) {
    q = queens[i];
    _results.push((function() {
      var _j, _results1;
      _results1 = [];
      for (x = _j = 0; _j < 8; x = ++_j) {
        if (x !== q.y) {
          guide = $('<div>').addClass('guide');
          guide.x = q.x;
          guide.y = x;
          block = $(Main.blocks[q.x][x]);
          block.append(guide);
          Main.guides.push(guide);
        }
        if (x !== q.x) {
          guide = $('<div>').addClass('guide');
          guide.x = x;
          guide.y = q.y;
          block = $(Main.blocks[x][q.y]);
          block.append(guide);
          Main.guides.push(guide);
        }
        if (x !== q.x) {
          y = -x + q.x + q.y;
          if ((0 <= y && y < 8)) {
            guide = $('<div>').addClass('guide');
            guide.x = x;
            guide.y = y;
            block = $(Main.blocks[x][y]);
            block.append(guide);
            Main.guides.push(guide);
          }
          y = x + q.y - q.x;
          if ((0 <= y && y < 8)) {
            guide = $('<div>').addClass('guide');
            guide.x = x;
            guide.y = y;
            block = $(Main.blocks[x][y]);
            block.append(guide);
            _results1.push(Main.guides.push(guide));
          } else {
            _results1.push(void 0);
          }
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    })());
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

pickQueenImageNumber = function() {
  var b, i, _i, _len, _ref;
  _ref = Main.queenImageUsed;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    b = _ref[i];
    if (!b) {
      Main.queenImageUsed[i] = true;
      return i;
    }
  }
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
