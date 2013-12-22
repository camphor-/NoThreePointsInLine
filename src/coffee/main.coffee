Main =
  max_piece: 16
  blocks: [[],[],[],[],[],[],[],[]]
  queens: []
  guides: []
  guideEnabled: false
  count: 0
  time: 0
  timer: null
  result: false
  queenImageUsed: [false, false, false, false, false, false, false, false,
                   false, false, false, false, false, false, false, false]

replaceScene = (id) ->
  scenes = ['intro', 'main', 'message']
  for s, i in scenes
    $('#'+s).hide()
  $('#'+id).show()

toggle = (block) ->
  if block.status
    $(block).removeClass('active')
    console.log 'Remove cat'+ block.image
    $(block).removeClass('cat' + block.image)
    Main.queenImageUsed[block.image] = false
    block.status = 0
    Main.count--
    queen = {x: block.x, y: block.y}
    console.log Main.queens
    removeElem(Main.queens, queen)
  else if Main.count < Main.max_piece
    imageNum = pickQueenImageNumber()
    Main.queenImageUsed[imageNum] = true
    $(block).addClass('active')
    $(block).addClass('cat' + imageNum)
    console.log 'Add cat' + imageNum
    block.status = 1
    block.image = imageNum
    Main.count++
    queen = {x: block.x, y: block.y}
    console.log block.x + "," + block.y
    Main.queens.push(queen)
    playNyah()
  if Main.guideEnabled
    refreshGuide()
  updateCountLabel()
  updateJudgeButtonState()

updateJudgeButtonState = ->
  if Main.count == Main.max_piece
    $('#judgebutton').removeClass('disabled')
  else
    $('#judgebutton').addClass('disabled', 'disabled')

judge = ->
  for i in [2...Main.max_piece]
    for j in [1...(i-1)]
      for k in [0..(j-1)]
        if are_three_in_a_line(i, j, k)
          return false
  return true

are_three_in_a_line = (i, j, k) ->
  if i == j || j == k || i == k
    return false
  q1 = Main.queens[i]
  q2 = Main.queens[j]
  q3 = Main.queens[k]
  # q1.x < q2.x
  if q1.x > q2.x
    [q1, q2] = [q2, q1]
  # q1.x < q3.x
  if q1.x > q3.x
    [q1, q3] = [q3, q1]
  # q2.x < q3.x
  if q2.x > q3.x
    [q2, q3] = [q3, q2]

  dx12 = q2.x - q1.x
  dy12 = q2.y - q1.y
  dx13 = q3.x - q1.x
  dy13 = q3.y - q1.y

  return (dy12 * dx13 == dx12 * dy13)

updateCountLabel = ->
  $('#countlabel').html('×' + Main.count + '/' + Main.max_piece)

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
      block.conflict = false
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
  console.log "call refreshGuide!!!"
  clearGuide()
  clearConflict()
  queens = Main.queens
  for i in [0...queens.length]
    for j in [0...i]
      for k in [0...j]
        console.log i + "," + j + "," + k
        if are_three_in_a_line(i, j, k)
          console.log "    conflict!!!"
          [qi, qj, qk] = [queens[i], queens[j], queens[k]]
          Main.blocks[qi.x][qi.y].conflict = true
          Main.blocks[qj.x][qj.y].conflict = true
          Main.blocks[qk.x][qk.y].conflict = true

  for q, i in queens
    guide = $('<div>').addClass('guide')
    guide.x = q.x
    guide.y = q.y
    qb = Main.blocks[q.x][q.y]
    block = $(qb)
    block.append(guide)
    if qb.conflict
      mark = $('<div>').addClass('mark')
      $(guide).append(mark)
    Main.guides.push(guide)
    
clearGuide = ->
  for g, i in Main.guides
    $(Main.blocks[g.x][g.y]).removeClass('mark')
    g.remove()
  Main.guides = []

clearConflict = ->
  for i in [0...8]
    for j in [0...8]
      Main.blocks[i][j].conflict = false

pickQueenImageNumber = ->
  for b, i in Main.queenImageUsed
    if !b
      return i

playBGM = ->
  bgm = new Audio('../sound/bgm.wav')
  bgm.loop = true
  bgm.play()

playNyah = ->
  Main.nyahSound = new Audio('../sound/cat.wav')
  Main.nyahSound.play();

playClick = ->
  Main.clickSound = new Audio('../sound/click.wav')
  Main.clickSound.play();

playSound = (path) ->
  sound = new Audio(path)
  sound.play()

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

$ ->
  playBGM()
  replaceScene('intro')
  #ブロック要素を二次元配列に格納
  blocks = $('.block')
  for i in [0...8]
    for j in [0...8]
      block = blocks[i*8+j]
      block.x = i
      block.y = j
      block.status = 0
      block.conflict = false
      console.log i + "," + j
      block.onclick = ->
        toggle(this)
      Main.blocks[i].push(block)
  updateCountLabel()
  $('#startbutton').click ->
    replaceScene('main')
    Main.time = 0
    startTimer()
    updateTimeLabel()
    playSound('../sound/start.wav')    

  $('#judgebutton').click ->
    playClick()
    if !$('#judgebutton').hasClass('disabled')
      showResult()

  $('#resetbutton').click ->
    playSound('../sound/reset.wav')
    reset()

  $('#backbutton').click ->
    if Main.result
      reset()
      Main.guideEnabled = true
      switchGuide()
      replaceScene('intro')
      playClick()      
    $('#message').hide()

  $('#guidebutton').click ->
    switchGuide()


