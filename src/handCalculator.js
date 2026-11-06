const _ = require('lodash')
const cardRanks = require('./cardRanks')
const cardSuits = require('./cardSuits')

//look up a rank's numeric order (2-14) from a card's value, e.g. 'KING' -> 13
const ORDER = Object.fromEntries(cardRanks.map(rank => [rank.value, rank.order]))
const VALUE = Object.fromEntries(cardRanks.map(rank => [rank.order, rank.value]))

//five distinct ranks in a row; the ace also counts low in A-2-3-4-5
const isStraight = orders => {
    const sorted = _.sortBy(orders)
    if (_.uniq(sorted).length !== 5) return false
    return sorted[4] - sorted[0] === 4 || sorted.join() === '2,3,4,5,14'
}

const VALUES = cardRanks.map(rank => rank.value)
const SUITS = cardSuits.map(suit => suit.name)

//throw a TypeError describing the first problem with the hand, if there is one
const validateHand = hand => {
    if (!Array.isArray(hand)) {
        throw new TypeError(`calculateHand expects an array of 5 cards, got ${typeof hand}`)
    }
    if (hand.length !== 5) {
        throw new TypeError(`calculateHand expects 5 cards, got ${hand.length}`)
    }
    hand.forEach((card, index) => {
        const which = `card ${index + 1}`
        if (card === null || typeof card !== 'object') {
            throw new TypeError(`${which} is not a card object: ${JSON.stringify(card)}`)
        }
        if (!VALUES.includes(card.value)) {
            throw new TypeError(`${which} has an unknown value ${JSON.stringify(card.value)}; expected one of ${VALUES.join(', ')}`)
        }
        if (!SUITS.includes(card.suit)) {
            throw new TypeError(`${which} has an unknown suit ${JSON.stringify(card.suit)}; expected one of ${SUITS.join(', ')}`)
        }
    })
    const duplicate = hand.find((card, index) =>
        hand.findIndex(other => other.value === card.value && other.suit === card.suit) !== index)
    if (duplicate) {
        throw new TypeError(`the hand contains the ${duplicate.value} of ${duplicate.suit} more than once`)
    }
}

const calculateHand = hand => {
    validateHand(hand)
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
