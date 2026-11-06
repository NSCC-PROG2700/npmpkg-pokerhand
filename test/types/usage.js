//plain JavaScript, type-checked the way an editor does with type hints on
const pokerhand = require('../..')

const hand = pokerhand.generateStraight({ seed: 1 })
/** @type {string} */
const suit = hand.cards[0].suit
// @ts-expect-error typo in a card field
hand.cards[0].suits
// @ts-expect-error typo in a function name
pokerhand.generateFullhouse()
