/*
  All printing to the console occurs in this module
*/

const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.log(...params)
}

module.exports = {
  info, error
}