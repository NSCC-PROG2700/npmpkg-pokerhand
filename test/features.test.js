const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const pkg = require('../index')

const codes = payload => payload.cards.map(card => card.code).join(' ')

describe('compareHands', () => {
    //[winner, loser]: the first hand beats the second
    const wins = [
        //different hand types
        ['0S JS QS KS AS', '9H 0H JH QH KH'],   //royal flush beats straight flush
        ['AH 2H 3H 4H 5H', '2S 2C 2H 2D AS'],   //lowest straight flush beats four of a kind
        ['2S 2C 2H 2D 3S', 'AS AC AH KD KS'],   //four of a kind beats full house
        ['2S 2C 2H 3D 3S', 'AS KS QS JS 9S'],   //full house beats flush
        ['2S 3S 4S 5S 7S', '0S JC QH KD AS'],   //flush beats straight
        ['AS 2C 3H 4D 5S', 'AS AC AH KD QS'],   //lowest straight beats three of a kind
        ['2S 2C 2H 3D 4S', 'AS AC KH KD QS'],   //three of a kind beats two pair
        ['2S 2C 3H 3D 4S', 'AS AC KH QD JS'],   //two pair beats one pair
        ['2S 2C 3H 4D 5S', 'AS KC QH JD 9S'],   //one pair beats high card

        //same hand type: tie-breakers
        ['6S 2C 3H 4D 5S', 'AS 2C 3H 4D 5S'],   //6-high straight beats A-5 (the ace is low)
        ['0S JC QH KD AS', '9S 0C JH QD KS'],   //ace-high straight beats king-high
        ['3S 3C 3H 2D 2S', '2S 2C 2H AD AS'],   //full house: the three of a kind counts first
        ['AS AC 2H 2D 3S', 'KS KC QH QD JS'],   //two pair: the higher pair counts first
        ['AS AC 3H 3D 2S', 'AS AC 2H 2D KS'],   //two pair: then the lower pair
        ['AS AC KH KD 3S', 'AS AC KH KD 2S'],   //two pair: then the fifth card
        ['KS KC 4H 3D 2S', 'QS QC AH KD JS'],   //one pair: the pair beats higher other cards
        ['KS KC AH 3D 2S', 'KS KC QH JD 9S'],   //one pair: then the other cards, highest first
        ['KS KC AH 5D 3S', 'KS KC AH 4D 3S'],
        ['AS KS QS JS 9S', 'AH KH QH JH 8H'],   //flush: compares all five cards
        ['AS KC QH JD 9S', 'AS KC QH JD 8S'],   //high card: compares all five cards
        ['7S 7C 7H 7D AS', '7S 7C 7H 7D KS'],   //four of a kind: then the fifth card
    ]
    for (const [winner, loser] of wins) {
        test(`${winner} beats ${loser}`, () => {
            assert.equal(pkg.compareHands(pkg.fromCodes(winner), pkg.fromCodes(loser)), 1)
            assert.equal(pkg.compareHands(pkg.fromCodes(loser), pkg.fromCodes(winner)), -1)
        })
    }

    //hands that differ only by suit are a tie
    const ties = [
        ['AS KC QH JD 9S', 'AH KD QC JS 9H'],
        ['0S JS QS KS AS', '0H JH QH KH AH'],
        ['AS 2C 3H 4D 5S', 'AH 2D 3C 4S 5H'],
        ['KS KC 2H 2D 7S', 'KH KD 2S 2C 7H'],
    ]
    for (const [a, b] of ties) {
        test(`${a} ties ${b}`, () => {
            assert.equal(pkg.compareHands(pkg.fromCodes(a), pkg.fromCodes(b)), 0)
        })
    }

    test('ranks each hand type above the next, for generated hands', () => {
        const types = pkg.handTypes
        for (let i = 0; i < types.length - 1; i++) {
            for (let n = 0; n < 50; n++) {
                assert.equal(pkg.compareHands(pkg.generateHand(types[i]), pkg.generateHand(types[i + 1])), 1,
                    `${types[i]} should beat ${types[i + 1]}`)
            }
        }
    })

    test('accepts payloads as well as arrays of cards', () => {
        const pair = pkg.generatePair()
        assert.equal(pkg.compareHands(pkg.generateFlush(), pair), 1)
        assert.equal(pkg.compareHands(pair.cards, pair), 0)
    })

    test('rejects invalid hands, naming which one', () => {
        const good = pkg.fromCodes('AS KC QH JD 9S')
        assert.throws(() => pkg.compareHands(good, pkg.fromCodes('AS KC QH')),
            { name: 'TypeError', message: /compareHands \(second hand\) expects 5 cards, got 3/ })
        assert.throws(() => pkg.compareHands([{ value: 'TEN', suit: 'SPADES' }, ...good.slice(1)], good),
            { name: 'TypeError', message: /compareHands \(first hand\): card 1 has an unknown value "TEN"/ })
    })
})

describe('bestHand', () => {
    const cases = [
        //cards, best hand, the five cards that make it
        ['AS KS 2D 7C QS JS 0S', 'Royal Flush', '0S JS QS KS AS'],
        ['AS KD 2D 7C 3S 4H 5C', 'Straight', '2D 3S 4H 5C AS'],
        ['KS KD KH 7C 7S 2H 2C', 'Full House', '7C 7S KD KH KS'],
        ['9S 9D 4H 4C 2S 2D AC', 'Two Pair', '4C 4H 9D 9S AC'],
        ['2S 5D 9H JC KS 3D 7C', 'High Card - KING', '5D 7C 9H JC KS'],
        ['2H 3H 4H 5H 6H 7H', 'Straight Flush', '3H 4H 5H 6H 7H'],
    ]
    const sorted = cards => cards.map(card => card.code).sort().join(' ')
    for (const [cards, name, best] of cases) {
        test(`${cards} -> ${name}`, () => {
            const result = pkg.bestHand(pkg.fromCodes(cards))
            assert.equal(result.name, name)
            assert.equal(sorted(result.cards), best.split(' ').sort().join(' '))
        })
    }

    test('with exactly five cards, returns them unchanged', () => {
        const hand = pkg.generateTwoPair()
        const result = pkg.bestHand(hand)
        assert.equal(result.name, 'Two Pair')
        assert.deepEqual(result.cards, hand.cards)
    })

    test('returns the original card objects, and no five of the cards beat it', () => {
        const fives = cards => cards.flatMap((_, a) => cards.slice(a + 1).map((_, b) => b + a + 1)
            .map(b => cards.filter((__, index) => index !== a && index !== b)))
        for (let i = 0; i < 200; i++) {
            const [first, second] = pkg.dealHands(2)
            const cards = [...first.cards, ...second.cards.slice(0, 2)]
            const result = pkg.bestHand(cards)
            assert.ok(result.cards.every(card => cards.includes(card)))
            assert.equal(pkg.calculateHand(result.cards), result.name)
            const all = fives(cards)
            assert.equal(all.length, 21)
            assert.ok(all.every(five => pkg.compareHands(result.cards, five) >= 0))
        }
    })

    test('rejects fewer than five or more than seven cards', () => {
        assert.throws(() => pkg.bestHand(pkg.fromCodes('AS KS QS JS')), { name: 'TypeError', message: /bestHand expects 5 to 7 cards, got 4/ })
        assert.throws(() => pkg.bestHand(pkg.fromCodes('AS KS QS JS 0S 9S 8S 7S')), { name: 'TypeError', message: /bestHand expects 5 to 7 cards, got 8/ })
        assert.throws(() => pkg.bestHand(pkg.fromCodes('AS KS QS JS 0S 9S AS')), { name: 'TypeError', message: /ACE of SPADES more than once/ })
    })
})

describe('dealHands', () => {
    test('deals hands from one deck with no card dealt twice', () => {
        for (const count of [1, 2, 6, 10]) {
            const hands = pkg.dealHands(count)
            assert.equal(hands.length, count)
            const all = hands.flatMap(hand => hand.cards.map(card => card.code))
            assert.equal(all.length, count * 5)
            assert.equal(new Set(all).size, count * 5)
        }
    })

    test('counts down the cards remaining in the deck', () => {
        assert.deepEqual(pkg.dealHands(4).map(hand => hand.remaining), [47, 42, 37, 32])
        assert.equal(pkg.dealHands(10)[9].remaining, 2)
    })

    test('uses the deckId option on every hand', () => {
        assert.ok(pkg.dealHands(3, { deckId: 'table-1' }).every(hand => hand.deck_id === 'table-1'))
    })

    const invalid = [
        [0, RangeError, /1 to 10 hands from one deck, got 0/],
        [11, RangeError, /1 to 10 hands from one deck, got 11/],
        [2.5, TypeError, /whole number of hands, got 2.5/],
        ['3', TypeError, /whole number of hands, got "3"/],
        [undefined, TypeError, /whole number of hands, got undefined/],
    ]
    for (const [count, ErrorType, message] of invalid) {
        test(`rejects ${JSON.stringify(count)} hands`, () => {
            assert.throws(() => pkg.dealHands(count), { name: ErrorType.name, message })
        })
    }
})

describe('options', () => {
    const generatorNames = Object.keys(pkg).filter(name => name.startsWith('generate') && name !== 'generateHand')

    test('the same seed gives the same hand, for every generator', () => {
        for (const name of generatorNames) {
            for (const seed of [1, 42, 'table-7']) {
                assert.equal(codes(pkg[name]({ seed })), codes(pkg[name]({ seed })), `${name} with seed ${seed}`)
            }
        }
        assert.equal(codes(pkg.generateHand('Flush', { seed: 9 })), codes(pkg.generateFlush({ seed: 9 })))
        assert.deepEqual(pkg.dealHands(4, { seed: 5 }).map(codes), pkg.dealHands(4, { seed: 5 }).map(codes))
    })

    test('different seeds give different hands', () => {
        const hands = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(seed => codes(pkg.generateRandomHand({ seed }))))
        assert.ok(hands.size >= 9)
    })

    test('a seeded call does not make later unseeded calls repeat', () => {
        pkg.generatePair({ seed: 1 })
        const hands = new Set(Array.from({ length: 20 }, () => codes(pkg.generateRandomHand())))
        assert.ok(hands.size >= 19)
    })

    test('deckId sets deck_id, and defaults to testdeck', () => {
        assert.equal(pkg.generateFullHouse({ deckId: 'abc123' }).deck_id, 'abc123')
        assert.equal(pkg.generateHand('Straight', { deckId: 'xyz' }).deck_id, 'xyz')
        assert.equal(pkg.generateFullHouse().deck_id, 'testdeck')
        assert.equal(pkg.generateFullHouse({}).deck_id, 'testdeck')
    })

    const invalid = [
        ['options that are not an object', 'abc', /options must be an object, got string/],
        ['null options', null, /options must be an object, got null/],
        ['an unknown option', { seeed: 1 }, /unknown option "seeed"; expected seed or deckId/],
        ['a seed that is not a number or string', { seed: {} }, /seed must be a number or a string, got object/],
        ['a deckId that is not a string', { deckId: 5 }, /deckId must be a string, got number/],
    ]
    for (const [description, options, message] of invalid) {
        test(`rejects ${description}`, () => {
            assert.throws(() => pkg.generatePair(options), { name: 'TypeError', message })
            assert.throws(() => pkg.dealHands(2, options), { name: 'TypeError', message })
        })
    }
})

describe('fromCodes', () => {
    test('builds full card objects from a string of codes', () => {
        const cards = pkg.fromCodes('AS KD 0H 2C')
        assert.deepEqual(cards.map(card => [card.value, card.suit]),
            [['ACE', 'SPADES'], ['KING', 'DIAMONDS'], ['10', 'HEARTS'], ['2', 'CLUBS']])
        assert.equal(cards[2].image, 'https://deckofcardsapi.com/static/img/0H.png')
    })

    test('accepts arrays, commas, lowercase and 10 for tens', () => {
        const expected = pkg.fromCodes('AS 0H KD')
        assert.deepEqual(pkg.fromCodes(['AS', '0H', 'KD']), expected)
        assert.deepEqual(pkg.fromCodes('as, 10h,kd'), expected)
        assert.deepEqual(pkg.fromCodes('  AS\n10H  KD '), expected)
    })

    test('matches the cards the generators produce', () => {
        const hand = pkg.generateRandomHand()
        assert.deepEqual(pkg.fromCodes(codes(hand)), hand.cards)
    })

    test('returns an empty array for no codes', () => {
        assert.deepEqual(pkg.fromCodes(''), [])
        assert.deepEqual(pkg.fromCodes([]), [])
    })

    const invalid = [
        ['an unknown rank', 'AS 1H', /unknown card code "1H"/],
        ['an unknown suit', 'AX', /unknown card code "AX"/],
        ['a value name', 'ACE', /unknown card code "ACE"/],
        ['a code with no suit', 'K', /unknown card code "K"/],
        ['a non-string code', ['AS', 5], /unknown card code 5/],
        ['a number', 5, /expects a string or an array of card codes, got number/],
    ]
    for (const [description, input, message] of invalid) {
        test(`rejects ${description}`, () => {
            assert.throws(() => pkg.fromCodes(input), { name: 'TypeError', message })
        })
    }
})
