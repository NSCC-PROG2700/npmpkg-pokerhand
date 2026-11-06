const _ = require('lodash')
const cardRanks = require('./src/cardRanks')
const cardSuits = require('./src/cardSuits')
const ranksManager = require('./src/cardRanksManager')
const suitsManager = require('./src/cardSuitsManager')
const cardGenerator = require('./src/cardGenerator')
const cardDeck = require('./src/cardDeck')
const createPayload = require('./src/payload')
const handCalculator = require('./src/handCalculator')
const pjson = require('./package.json')

//pair up ranks and suits by position into cards
const toCards = (ranks, suits) => ranks.map((rank, index) => cardGenerator.generateCard(rank, suits[index]))

//the given ranks, all in one random suit
const suited = ranks => {
    const suit = _.sample(cardSuits)
    return toCards(ranks, ranks.map(() => suit))
}

//build a hand made of groups of same-rank cards, e.g. [3, 2] for a full house.
//each group gets a different rank, and the cards within a group get different suits
const fromGroups = sizes => {
    const ranks = _.sampleSize(cardRanks, sizes.length)
    return sizes.flatMap((size, index) =>
        _.sampleSize(cardSuits, size)
            .map(suit => cardGenerator.generateCard(ranks[index], suit))
    )
}

//keep making hands until one scores as the wanted hand type
const until = (handName, makeCards) => {
    let cards
    do {
        cards = makeCards()
    } while (!handCalculator.calculateHand(cards).startsWith(handName))
    return cards
}

const generators = {
    generateRoyalFlush: () => createPayload(_.shuffle(suited(ranksManager.getRoyalFlushRanks()))),

    generateStraightFlush: () =>
        createPayload(_.shuffle(suited(ranksManager.getRandomStraightRanks({ excludeHighAce: true })))),

    generateFourOfAKind: () => createPayload(_.shuffle(fromGroups([4, 1]))),

    generateFullHouse: () => createPayload(_.shuffle(fromGroups([3, 2]))),

    //five different ranks in one suit, retried if they happen to form a straight
    generateFlush: () => createPayload(until('Flush', () => suited(_.sampleSize(cardRanks, 5)))),

    generateStraight: () =>
        createPayload(_.shuffle(toCards(ranksManager.getRandomStraightRanks(), suitsManager.getNonFlushSuitHand()))),

    generateThreeOfAKind: () => createPayload(_.shuffle(fromGroups([3, 1, 1]))),

    generateTwoPair: () => createPayload(_.shuffle(fromGroups([2, 2, 1]))),

    generatePair: () => createPayload(_.shuffle(fromGroups([2, 1, 1, 1]))),

    //five different ranks in mixed suits, retried if they happen to form a straight
    generateHighCard: () => createPayload(_.shuffle(until('High Card', () =>
        toCards(_.sampleSize(cardRanks, 5), suitsManager.getNonFlushSuitHand())
    ))),

    //deal five cards from a shuffled deck
    generateRandomHand: () => createPayload(
        cardDeck.getShuffled().slice(0, 5).map(({ rank, suit }) => cardGenerator.generateCard(rank, suit))
    ),
}

//the generator for each hand type, keyed by the name calculateHand gives that hand
const GENERATORS_BY_TYPE = {
    'Royal Flush': generators.generateRoyalFlush,
    'Straight Flush': generators.generateStraightFlush,
    'Four of a Kind': generators.generateFourOfAKind,
    'Full House': generators.generateFullHouse,
    'Flush': generators.generateFlush,
    'Straight': generators.generateStraight,
    'Three of a Kind': generators.generateThreeOfAKind,
    'Two Pair': generators.generateTwoPair,
    'One Pair': generators.generatePair,
    'High Card': generators.generateHighCard,
}
const handTypes = Object.freeze(Object.keys(GENERATORS_BY_TYPE))

//ignore case, spaces, hyphens and underscores, so 'full-house' and 'FULL_HOUSE' match 'Full House'
const normalize = name => name.toLowerCase().replace(/[\s_-]/g, '')
const generatorsByKey = new Map(
    Object.entries(GENERATORS_BY_TYPE).map(([type, generate]) => [normalize(type), generate])
)

module.exports = {
    getVersion: () => pjson.version,

    //name the poker hand made by five cards, e.g. 'Full House' or 'High Card - KING'
    calculateHand: handCalculator.calculateHand,

    //the hand types generateHand accepts, strongest first
    handTypes,

    //generate a hand by type name, e.g. generateHand('Full House')
    generateHand: type => {
        const generate = typeof type === 'string' && generatorsByKey.get(normalize(type))
        if (!generate) {
            throw new TypeError(`unknown hand type ${JSON.stringify(type)}; expected one of ${handTypes.join(', ')}`)
        }
        return generate()
    },

    ...generators,
}
