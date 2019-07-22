function calculateTotalScore(rolls) {
  if (isTooManyRollsError(rolls)) {
    return {
      valid: false,
      error: 'Invalid roll',
      total: null,
    }
  }
  let frames
  try {
    frames = identifyFrames(rolls)
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      total: null,
    }
  }
  
  if (frames.length < 10) {
    return {
      valid: false,
      error: 'Not enough rolls',
      total: null,
    }
  }
  return {
    valid: true,
    error: null,
    total: calculateTotalScoreRecursive(frames)
  }
}

function isTooManyRollsError(rolls) {
  const filteredRolls = rolls.filter(roll => roll > 10 || roll < 0)
  return filteredRolls.length !== 0
}

function identifyFrames(rolls) {
  const frames = []
  let i
  for (i=0; i<rolls.length && frames.length<9; i++) {
    if (rolls[i]===10) {
      frames.push({
        firstRollScore: 10,
      })
    }
    else {
      if (rolls[i]+rolls[i+1] > 10) {
        throw new Error('Invalid frame')
      }
      frames.push({
        firstRollScore: rolls[i],
        secondRollScore: rolls[i+1]
      })
      i++
    }
  }
  const lastFrame = {
    firstRollScore: rolls[i],
    secondRollScore: rolls[i+1],
    thirdRollScore: rolls[i+2]
  }
  if (isLastFrameInvalid(lastFrame)) {
    throw new Error('Invalid frame')
  }
  frames.push(lastFrame)
  if (rolls[i] + rolls[i+1] < 10 && rolls[i+2] !== undefined) {
    throw new Error('Too many rolls')
  } 
  if (rolls[i+3]) {
    throw new Error('Too many rolls')
  }
  return frames
}

function isLastFrameInvalid(lastFrame) {
  if (lastFrame.firstRollScore < 10 && lastFrame.firstRollScore + lastFrame.secondRollScore > 10) {
    return true
  }
  if (lastFrame.firstRollScore === 10) {
    if (lastFrame.secondRollScore === 10) {
      return false
    }
    if (lastFrame.secondRollScore + lastFrame.thirdRollScore > 10) {
      return true
    }
  }
  return false
}

function calculateTotalScoreRecursive(frames) {
  if (frames.length === 1) {
    return frames[0].firstRollScore + frames[0].secondRollScore + (frames[0].thirdRollScore || 0)
  }
  if (frames.length === 2) {
    return computeSecondLastFrameScore(frames[0], frames[1]) + calculateTotalScoreRecursive(frames.slice(1))
  }
  return computeFrameScore(frames[0], frames[1], frames[2]) + calculateTotalScoreRecursive(frames.slice(1))
}

function computeSecondLastFrameScore(baseFrame, lastFrame) {
  if (baseFrame.firstRollScore === 10) {
    return 10 + lastFrame.firstRollScore + lastFrame.secondRollScore
  }
  if (baseFrame.firstRollScore + baseFrame.secondRollScore === 10) {
    return 10 + lastFrame.firstRollScore 
  }
  return baseFrame.firstRollScore + baseFrame.secondRollScore 
}

function computeFrameScore(baseFrame, frame1, frame2) {
  if (baseFrame.firstRollScore === 10) {
    return 10 + frame1.firstRollScore + (frame1.secondRollScore || frame2.firstRollScore)
  }
  if (baseFrame.firstRollScore + baseFrame.secondRollScore === 10) {
    return 10 + frame1.firstRollScore 
  }
  return baseFrame.firstRollScore + baseFrame.secondRollScore
}

module.exports = calculateTotalScore