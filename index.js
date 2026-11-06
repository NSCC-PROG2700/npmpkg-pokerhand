const random = require('./src/random')
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
    const suit = random.sample(cardSuits)
    return toCards(ranks, ranks.map(() => suit))
}

//build a hand made of groups of same-rank cards, e.g. [3, 2] for a full house.
//each group gets a different rank, and the cards within a group get different suits
const fromGroups = sizes => {
    const ranks = random.sampleSize(cardRanks, sizes.length)
    return sizes.flatMap((size, index) =>
        random.sampleSize(cardSuits, size)
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

const OPTION_NAMES = ['seed', 'deckId']

//check the optional { seed, deckId } argument that every generator takes
const checkOptions = (options = {}) => {
    if (options === null || typeof options !== 'object' || Array.isArray(options)) {
        throw new TypeError(`options must be an object, got ${options === null ? 'null' : typeof options}`)
    }
    const unknown = Object.keys(options).find(key => !OPTION_NAMES.includes(key))
    if (unknown) {
        throw new TypeError(`unknown option "${unknown}"; expected ${OPTION_NAMES.join(' or ')}`)
    }
    if (options.deckId !== undefined && typeof options.deckId !== 'string') {
        throw new TypeError(`deckId must be a string, got ${typeof options.deckId}`)
    }
    return options
}

//turn a card-making function into a generator that takes { seed, deckId } and returns a payload
const generator = makeCards => options => {
    const { seed, deckId } = checkOptions(options)
    return random.withSeed(seed, () => createPayload(makeCards(), { deckId }))
}

//deal up to ten five-card hands from one shuffled deck, with no card dealt twice
const dealHands = (count, options) => {
    if (!Number.isInteger(count)) {
        throw new TypeError(`dealHands expects a whole number of hands, got ${JSON.stringify(count)}`)
    }
    if (count < 1 || count > 10) {
        throw new RangeError(`dealHands can deal 1 to 10 hands from one deck, got ${count}`)
    }
    const { seed, deckId } = checkOptions(options)
    return random.withSeed(seed, () => {
        const deck = cardDeck.getShuffled()
        return Array.from({ length: count }, (_, index) => createPayload(
            deck.slice(index * 5, index * 5 + 5).map(({ rank, suit }) => cardGenerator.generateCard(rank, suit)),
            //cards left in the deck after this hand is dealt
            { deckId, remaining: deck.length - (index + 1) * 5 }
        ))
    })
}

const RANKS_BY_CODE = new Map(cardRanks.map(rank => [rank.code, rank]))
const SUITS_BY_CODE = new Map(cardSuits.map(suit => [suit.code, suit]))

//turn card codes like 'AS KD 0H' into full card objects
const fromCodes = codes => {
    const list = typeof codes === 'string' ? codes.split(/[\s,]+/).filter(Boolean) : codes
    if (!Array.isArray(list)) {
        throw new TypeError(`fromCodes expects a string or an array of card codes, got ${codes === null ? 'null' : typeof codes}`)
    }
    return list.map(code => {
        //accept lowercase, and 10 as well as 0 for tens
        const normalized = typeof code === 'string' ? code.trim().toUpperCase().replace(/^10/, '0') : ''
        const rank = RANKS_BY_CODE.get(normalized.slice(0, -1))
        const suit = SUITS_BY_CODE.get(normalized.slice(-1))
        if (normalized.length !== 2 || !rank || !suit) {
            throw new TypeError(`unknown card code ${JSON.stringify(code)}; expected a rank (2-9, 0 or 10, J, Q, K, A) followed by a suit (S, C, H, D), e.g. "KS"`)
        }
        return cardGenerator.generateCard(rank, suit)
    })
}

const generators = {
    generateRoyalFlush: generator(() => random.shuffle(suited(ranksManager.getRoyalFlushRanks()))),

    generateStraightFlush: generator(() =>
        random.shuffle(suited(ranksManager.getRandomStraightRanks({ excludeHighAce: true })))),

    generateFourOfAKind: generator(() => random.shuffle(fromGroups([4, 1]))),

    generateFullHouse: generator(() => random.shuffle(fromGroups([3, 2]))),

    //five different ranks in one suit, retried if they happen to form a straight
    generateFlush: generator(() => until('Flush', () => suited(random.sampleSize(cardRanks, 5)))),

    generateStraight: generator(() =>
        random.shuffle(toCards(ranksManager.getRandomStraightRanks(), suitsManager.getNonFlushSuitHand()))),

    generateThreeOfAKind: generator(() => random.shuffle(fromGroups([3, 1, 1]))),

    generateTwoPair: generator(() => random.shuffle(fromGroups([2, 2, 1]))),

    generatePair: generator(() => random.shuffle(fromGroups([2, 1, 1, 1]))),

    //five different ranks in mixed suits, retried if they happen to form a straight
    generateHighCard: generator(() => random.shuffle(until('High Card', () =>
        toCards(random.sampleSize(cardRanks, 5), suitsManager.getNonFlushSuitHand())
    ))),

    //deal five cards from a shuffled deck
    generateRandomHand: options => dealHands(1, options)[0],
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

    //1 if the first hand wins, -1 if the second does, 0 for a tie
    compareHands: handCalculator.compareHands,

    //the strongest five-card hand within five to seven cards
    bestHand: handCalculator.bestHand,

    fromCodes,

    //the hand types generateHand accepts, strongest first
    handTypes,

    //generate a hand by type name, e.g. generateHand('Full House')
    generateHand: (type, options) => {
        const generate = typeof type === 'string' && generatorsByKey.get(normalize(type))
        if (!generate) {
            throw new TypeError(`unknown hand type ${JSON.stringify(type)}; expected one of ${handTypes.join(', ')}`)
        }
        return generate(options)
    },

    dealHands,

    ...generators,
}
