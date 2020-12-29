const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
const upperCase = lowerCase.toUpperCase()
const number = '0123456789'
const letterBox = lowerCase + upperCase + number

function getRandomCode() {
  let code = '/'
  for (let i = 1; i <= 5; i++) {
    code += letterBox[Math.floor(Math.random() * letterBox.length)]
  }
  return code
}
module.exports = getRandomCode