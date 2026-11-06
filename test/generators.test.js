const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const pkg = require('../index')
const { calculateHand } = require('../src/handCalculator')
const { version } = require('../package.json')

//generators are random, so each is run many times
const RUNS = 1000

const GENERATORS = {
    generateRoyalFlush: 'Royal Flush',
    generateStraightFlush: 'Straight Flush',
    generateFourOfAKind: 'Four of a Kind',
    generateFullHouse: 'Full House',
    generateFlush: 'Flush',
    generateStraight: 'Straight',
    generateThreeOfAKind: 'Three of a Kind',
    generateTwoPair: 'Two Pair',
    generatePair: 'One Pair',
    generateHighCard: 'High Card',
}

const RANK_CODES = { ACE: 'A', 10: '0', JACK: 'J', QUEEN: 'Q', KING: 'K' }
const SUIT_CODES = { SPADES: 'S', CLUBS: 'C', HEARTS: 'H', DIAMONDS: 'D' }

//checks every generated hand has to pass, whatever its type
const assertValidPayload = payload => {
    assert.equal(payload.success, true)
    assert.equal(payload.deck_id, 'testdeck')
    assert.equal(payload.remaining, 47)
    assert.equal(payload.cards.length, 5)

    const codes = payload.cards.map(card => card.code)
    assert.equal(new Set(codes).size, 5, `duplicate card in ${codes}`)

    for (const card of payload.cards) {
        const rankCode = RANK_CODES[card.value] || card.value
        assert.equal(card.code, rankCode + SUIT_CODES[card.suit], `bad code for ${JSON.stringify(card)}`)
        assert.equal(card.image, `https://deckofcardsapi.com/static/img/${card.code}.png`)
        assert.deepEqual(card.images, {
            svg: `https://deckofcardsapi.com/static/img/${card.code}.svg`,
            png: `https://deckofcardsapi.com/static/img/${card.code}.png`,
        })
    }
}

describe('hand generators', () => {
    for (const [name, expected] of Object.entries(GENERATORS)) {
        test(`${name} always produces a valid ${expected}`, () => {
            for (let i = 0; i < RUNS; i++) {
                const payload = pkg[name]()
                assertValidPayload(payload)
                const result = calculateHand(payload.cards)
                assert.ok(result.startsWith(expected), `${name} produced ${result}`)
            }
        })
    }

    test('generateRandomHand deals five valid cards', () => {
        for (let i = 0; i < RUNS; i++) {
            assertValidPayload(pkg.generateRandomHand())
        }
    })

    test('generateStraight covers all ten straights, A-5 through 10-A', () => {
        const order = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING']
        const lowCards = new Set()
        for (let i = 0; i < 2000; i++) {
            const values = pkg.generateStraight().cards.map(card => card.value)
            //name each straight by its lowest card; the ace is high when the king is present
            lowCards.add(values.includes('ACE') && values.includes('KING')
                ? '10'
                : order[Math.min(...values.map(value => order.indexOf(value)))])
        }
        assert.equal(lowCards.size, 10, `only saw straights starting at ${[...lowCards]}`)
    })

    test('each call returns a separate payload', () => {
        const pair = pkg.generatePair()
        const flush = pkg.generateFlush()
        assert.notEqual(pair, flush)
        assert.equal(calculateHand(pair.cards), 'One Pair')
    })
})

test('getVersion matches package.json', () => {
    assert.equal(pkg.getVersion(), version)
})

test('loading the package creates no globals', () => {
    assert.equal(globalThis.cards, undefined)
    assert.equal(globalThis.deck, undefined)
})

test('calculateHand is exported', () => {
    assert.equal(pkg.calculateHand(pkg.generateFullHouse().cards), 'Full House')
})

describe('generateHand', () => {
    test('handTypes lists the ten hand types, strongest first', () => {
        assert.deepEqual(pkg.handTypes, [
            'Royal Flush', 'Straight Flush', 'Four of a Kind', 'Full House', 'Flush',
            'Straight', 'Three of a Kind', 'Two Pair', 'One Pair', 'High Card',
        ])
        assert.ok(Object.isFrozen(pkg.handTypes))
    })

    //what generateHand(type) produces scores back as that same type
    for (const type of pkg.handTypes) {
        test(`generateHand('${type}') produces a valid ${type}`, () => {
            for (let i = 0; i < 200; i++) {
                const payload = pkg.generateHand(type)
                assertValidPayload(payload)
                assert.ok(pkg.calculateHand(payload.cards).startsWith(type))
            }
        })
    }

    test('ignores case, spaces, hyphens and underscores', () => {
        for (const type of ['full house', 'FULL HOUSE', 'full-house', 'Full_House', 'fullhouse', ' Full House '])
            assert.equal(pkg.calculateHand(pkg.generateHand(type).cards), 'Full House', type)
    })

    const invalid = [
        ['an unknown type', 'Five of a Kind', /unknown hand type "Five of a Kind"; expected one of Royal Flush, .*High Card/],
        ['an empty string', '', /unknown hand type ""/],
        ['a generator function name', 'generatePair', /unknown hand type "generatePair"/],
        ['an inherited property name', 'constructor', /unknown hand type "constructor"/],
        ['a non-string', 5, /unknown hand type 5/],
        ['undefined', undefined, /unknown hand type undefined/],
    ]
    for (const [description, input, message] of invalid) {
        test(`rejects ${description}`, () => {
            assert.throws(() => pkg.generateHand(input), { name: 'TypeError', message })
        })
    }
})
