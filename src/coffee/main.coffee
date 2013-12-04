Main =
  blocks: [[],[],[],[],[],[],[],[]]
  queens: []
  guides: []
  guideEnabled: false
  count: 0
  time: 0
  timer: null
  result: false
  queenImageUsed: [false, false, false, false, false, false, false, false]

$ ->
  replaceScene('intro')
  #ブロック要素を二次元配列に格納
  blocks = $('.block')
  for i in [0...8]
    for j in [0...8]
      block = blocks[i*8+j]
      block.x = i
      block.y = j
      block.status = 0
      block.onclick = ->
        toggle(this)
      Main.blocks[i].push(block)
  updateCountLabel()
  $('#startbutton').click ->
    replaceScene('main')
    Main.time = 0
    startTimer()
    updateTimeLabel()
  $('#judgebutton').click ->
    if !$('#judgebutton').hasClass('disabled')
      showResult()

  $('#resetbutton').click ->
    reset()

  $('#backbutton').click ->
    if Main.result
      reset()
      Main.guideEnabled = true
      switchGuide()
      replaceScene('intro')
    $('#message').hide()

  $('#guidebutton').click ->
    switchGuide()

replaceScene = (id) ->
  scenes = ['intro', 'main', 'message']
  for s, i in scenes
    $('#'+s).hide()
  $('#'+id).show()

toggle = (block) ->
  if block.status
    $(block).removeClass('active')
    console.log 'cat'+block.image
    $(block).removeClass('cat'+block.image)
    Main.queenImageUsed[block.image] = false
    block.status = 0
    Main.count--
    console.log "hogehoge"
    queen = {x: block.x, y: block.y}
    console.log Main.queens
    removeElem(Main.queens, queen)
    console.log "fugafuga"
  else if Main.count < 5
    imageNum = pickQueenImageNumber()
    $(block).addClass('active')
    $(block).addClass('cat'+imageNum)
    block.status = 1
    block.image = imageNum
    Main.count++

    queen = {x: block.x, y: block.y}
    Main.queens.push(queen)
    console.log "hoge"
  if Main.guideEnabled
    refreshGuide()
  console.log "fuga"
  updateCountLabel()
  updateJudgeButtonState()

updateJudgeButtonState = ->
  if Main.count==5
    $('#judgebutton').removeClass('disabled')
  else
    $('#judgebutton').addClass('disabled', 'disabled')

judge = ->
  for i in [0...8]
    for j in [0...8]
      is_ok = false
      for q in Main.queens
        if is_affected(i, j, q)
          is_ok = true
          continue
      if !is_ok
        return false
  return true

is_affected = (x, y, queen) ->
  nx = x + 1
  ny = y + 1
  qx = queen.x + 1
  qy = queen.y + 1
  horizon = (qx == nx)
  vertical = (qy == ny)
  diagonal = (ny + nx == qx + qy) || (nx - ny == qx - qy)
  return (horizon or vertical or diagonal)

updateCountLabel = ->
  console.log "call updateCountLabel!!! " + Main.count
  $('#countlabel').html('×' + Main.count + '/5')

updateTimeLabel = ->
  $('#timelabel').html(Main.time + '秒')
  Main.time++

startTimer = ->
  Main.time = 0
  if Main.timer
    clearInterval(Main.timer)
  Main.timer = setInterval(updateTimeLabel, 1000)

reset = ->
  Main.count = 0
  updateCountLabel()
  for i in [0...8]
    Main.queenImageUsed[i] = false
    for j in [0...8]
      block = Main.blocks[i][j]
      block.status = 0
      $(block).removeClass('active')
      $(block).removeClass('mark')
      $(block).removeClass (index, css) ->
        (css.match(/cat\d/g) || []).join(' ')
  Main.queens = []
  for g, i in Main.guides
    g.remove()
  Main.guides = []
  updateJudgeButtonState()

showMessage = (mes) ->
  $('.messagelabel').html(mes)
  $('#message').show()

showResult = ->
  if !$(this).hasClass('disabled')
    if judge()
      clearInterval(Main.timer)
      showMessage("正解！<br>✌(’ω’✌ )三✌(’ω’)✌三( ✌’ω’)✌<br><br>タイム: "+(Main.time-1)+"秒")
      Main.result = true
    else
      showMessage("不正解<br>('ω'乂)")
      Main.result = false

switchGuide = ->
  if Main.guideEnabled
    $('#guidebutton').removeClass('active')
    $('#guidebutton').html('ガイドON')
    clearGuide()
  else
    $('#guidebutton').addClass('active')
    $('#guidebutton').html('ガイドOFF')
    refreshGuide()

  Main.guideEnabled = !Main.guideEnabled

refreshGuide = ->
  clearGuide()
  queens = Main.queens
  for q, i in queens
    for x in [0...8]
      #縦横
      if x!=q.y
        guide = $('<div>').addClass('guide')
        guide.x = q.x
        guide.y = x
        block = $(Main.blocks[q.x][x])
        block.append(guide)
        Main.guides.push(guide)
      if x!=q.x
        guide = $('<div>').addClass('guide')
        guide.x = x
        guide.y = q.y
        block = $(Main.blocks[x][q.y])
        block.append(guide)
        Main.guides.push(guide)
      #斜め
      if x!=q.x
        y = -x + q.x+q.y
        if 0<=y<8
          guide = $('<div>').addClass('guide')
          guide.x = x
          guide.y = y
          block = $(Main.blocks[x][y])
          block.append(guide)
          Main.guides.push(guide)

        y = x + q.y-q.x
        if 0<=y<8
          guide = $('<div>').addClass('guide')
          guide.x = x
          guide.y = y
          block = $(Main.blocks[x][y])
          block.append(guide)
          Main.guides.push(guide)

clearGuide = ->
  for g, i in Main.guides
    $(Main.blocks[g.x][g.y]).removeClass('mark')
    g.remove()
  Main.guides = []

pickQueenImageNumber = ->
  for b, i in Main.queenImageUsed
    if !b
      Main.queenImageUsed[i] = true
      return i

#Foundation
removeElem = (array, value) ->
  removeIndexes = []
  for elem, i in array
    if elem.x == value.x and elem.y == value.y
      removeIndexes.push(i)
  for val, i in removeIndexes
    array = array.splice(val-i, 1)

Array.prototype.isEqualToArray = (array) ->
  return arraysEqual(this, array)

arraysEqual = (arrayA, arrayB) ->
  if arrayA.length != arrayB.length
    return false
  for v, i in arrayA
    a = arrayA[i]
    b = arrayB[i]
    if (a instanceof Array) and (b instanceof Array)
      if !arraysEqual(a, b)
        return false
    else
      if a!=b
        return false 
  return true


