const _ = require('lodash')
const cardRanks = require('./cardRanks')
const cardSuits = require('./cardSuits')

//look up a rank's numeric order (2-14) from a card's value, e.g. 'KING' -> 13
const ORDER = Object.fromEntries(cardRanks.map(rank => [rank.value, rank.order]))
const VALUE = Object.fromEntries(cardRanks.map(rank => [rank.order, rank.value]))
const VALUES = cardRanks.map(rank => rank.value)
const SUITS = cardSuits.map(suit => suit.name)

//hand types from weakest to strongest; the position is the hand's category when comparing hands
const CATEGORIES = [
    'High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 'Straight',
    'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush',
]

//accept either an array of cards or a payload holding them
const cardsOf = hand =>
    hand !== null && typeof hand === 'object' && !Array.isArray(hand) && Array.isArray(hand.cards)
        ? hand.cards
        : hand

//throw a TypeError describing the first problem with the cards, if there is one
const validateCards = (cards, label, min = 5, max = 5) => {
    const expected = min === max ? `${min}` : `${min} to ${max}`
    if (!Array.isArray(cards)) {
        throw new TypeError(`${label} expects an array of ${expected} cards, got ${typeof cards}`)
    }
    if (cards.length < min || cards.length > max) {
        throw new TypeError(`${label} expects ${expected} cards, got ${cards.length}`)
    }
    cards.forEach((card, index) => {
        const which = `${label}: card ${index + 1}`
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
    const duplicate = cards.find((card, index) =>
        cards.findIndex(other => other.value === card.value && other.suit === card.suit) !== index)
    if (duplicate) {
        throw new TypeError(`${label}: the hand contains the ${duplicate.value} of ${duplicate.suit} more than once`)
    }
}

//the top card of a straight (5 for A-2-3-4-5), or 0 if the ranks aren't a straight
const straightHigh = orders => {
    const sorted = _.sortBy(orders)
    if (_.uniq(sorted).length !== 5) return 0
    if (sorted[4] - sorted[0] === 4) return sorted[4]
    return sorted.join() === '2,3,4,5,14' ? 5 : 0
}

const handType = (high, flush, groups) => {
    if (high && flush) return high === 14 ? 'Royal Flush' : 'Straight Flush'
    if (groups === '4,1') return 'Four of a Kind'
    if (groups === '3,2') return 'Full House'
    if (flush) return 'Flush'
    if (high) return 'Straight'
    if (groups === '3,1,1') return 'Three of a Kind'
    if (groups === '2,2,1') return 'Two Pair'
    if (groups === '2,1,1,1') return 'One Pair'
    return 'High Card'
}

//name five valid cards, and work out their strength for comparing hands:
//[category, ...tie-breakers], where higher numbers win and earlier entries count first
const evaluate = cards => {
    const orders = cards.map(card => ORDER[card.value])
    const counts = _.countBy(orders)
    //each rank once: the biggest groups first, then the highest rank first
    const ranked = _.uniq(orders).sort((a, b) => counts[b] - counts[a] || b - a)
    //how many cards share each rank, e.g. '3,2' for a full house
    const groups = ranked.map(order => counts[order]).join()
    const flush = cards.every(card => card.suit === cards[0].suit)
    const high = straightHigh(orders)
    const type = handType(high, flush, groups)

    return {
        name: type === 'High Card' ? `High Card - ${VALUE[ranked[0]]}` : type,
        //straights are decided by their top card; everything else by rank groups, biggest first
        strength: [CATEGORIES.indexOf(type), ...(high ? [high] : ranked)],
    }
}

//1 if strength a is higher, -1 if b is, 0 if they're equal
const compareStrength = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1
    }
    return 0
}

//every way to choose `size` items, keeping their order
const combinations = (items, size) => size === 0
    ? [[]]
    : items.flatMap((item, index) =>
        combinations(items.slice(index + 1), size - 1).map(rest => [item, ...rest]))

const calculateHand = hand => {
    const cards = cardsOf(hand)
    validateCards(cards, 'calculateHand')
    return evaluate(cards).name
}

const compareHands = (first, second) => {
    const a = cardsOf(first)
    const b = cardsOf(second)
    validateCards(a, 'compareHands (first hand)')
    validateCards(b, 'compareHands (second hand)')
    return compareStrength(evaluate(a).strength, evaluate(b).strength)
}

const bestHand = hand => {
    const cards = cardsOf(hand)
    validateCards(cards, 'bestHand', 5, 7)
    let best
    for (const five of combinations(cards, 5)) {
        const result = evaluate(five)
        if (!best || compareStrength(result.strength, best.strength) > 0) {
            best = { ...result, cards: five }
        }
    }
    return { name: best.name, cards: best.cards }
}

module.exports = { calculateHand, compareHands, bestHand, evaluate }
