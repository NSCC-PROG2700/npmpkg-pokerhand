const handCalculator = require('./src/handCalculator')
const axios = require('axios')
const pkg = require('./index')

;(async () => {

  //const response = await axios.get(`https://pokerhand-tester.herokuapp.com/highcard`)
  //console.log(handCalculator.calculateHand(response.data.cards))

  const hand = pkg.generateFullHouse()
  console.log(hand)
  console.log(handCalculator.calculateHand(hand.cards))
})()
