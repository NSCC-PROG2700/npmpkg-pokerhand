const _ = require('lodash')
const random = require('./random')
const ranks = require('./cardRanks')
const suits = require('./cardSuits')

//all 52 cards: one of each rank in each suit
const deck = suits.flatMap(suit => ranks.map(rank => ({ rank, suit })))

module.exports = {
    getFresh: () => _.cloneDeep(deck),
    getShuffled: () => random.shuffle(deck),
}
