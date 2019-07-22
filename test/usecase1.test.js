const tap = require('tap')
const calculateTotalScore = require('../index')
const glob = require('glob')

const useCases = glob.sync('./data/use-cases-1/input*.json', { cwd: 'test/' }).map(require)
const outputs = glob.sync('./data/use-cases-1/output*.json', { cwd: 'test/' }).map(require)

useCases.forEach((useCase, index) => {
  const expectedResults = outputs[index]
  const actualResults = calculateTotalScore(useCase)
  console.log(actualResults)
  tap.strictSame(actualResults.total, expectedResults.total)
})
