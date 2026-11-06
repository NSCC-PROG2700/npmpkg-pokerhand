const _ = require('lodash')
const cardRanks = require('./cardRanks')

//look up a rank's numeric order (2-14) from a card's value, e.g. 'KING' -> 13
const ORDER = Object.fromEntries(cardRanks.map(rank => [rank.value, rank.order]))
const VALUE = Object.fromEntries(cardRanks.map(rank => [rank.order, rank.value]))

//five distinct ranks in a row; the ace also counts low in A-2-3-4-5
const isStraight = orders => {
    const sorted = _.sortBy(orders)
    if (_.uniq(sorted).length !== 5) return false
    return sorted[4] - sorted[0] === 4 || sorted.join() === '2,3,4,5,14'
}

const calculateHand = hand => {
    const orders = hand.map(card => ORDER[card.value])
    const flush = hand.every(card => card.suit === hand[0].suit)
    const straight = isStraight(orders)
    //how many cards share each rank, largest group first, e.g. '3,2' for a full house
    const groups = Object.values(_.countBy(orders)).sort((a, b) => b - a).join()

    if (straight && flush) return _.min(orders) === 10 ? 'Royal Flush' : 'Straight Flush'
    if (groups === '4,1') return 'Four of a Kind'
    if (groups === '3,2') return 'Full House'
    if (flush) return 'Flush'
    if (straight) return 'Straight'
    if (groups === '3,1,1') return 'Three of a Kind'
    if (groups === '2,2,1') return 'Two Pair'
    if (groups === '2,1,1,1') return 'One Pair'
    return `High Card - ${VALUE[_.max(orders)]}`
}

module.exports.calculateHand = calculateHand
