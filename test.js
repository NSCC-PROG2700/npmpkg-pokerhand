const pkg = require('./index')

const hand = pkg.generateRandomHand()
console.log(hand)
console.log(pkg.calculateHand(hand.cards))
console.log(pkg.getVersion())
