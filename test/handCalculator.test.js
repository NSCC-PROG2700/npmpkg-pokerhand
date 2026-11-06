const { test } = require('node:test')
const assert = require('node:assert/strict')
const { calculateHand } = require('../src/handCalculator')

//build a hand from short codes, e.g. 'AS 0H JD' (rank code + suit code, 0 = 10)
const VALUES = { A: 'ACE', 0: '10', J: 'JACK', Q: 'QUEEN', K: 'KING' }
const SUITS = { S: 'SPADES', C: 'CLUBS', H: 'HEARTS', D: 'DIAMONDS' }
const hand = codes => codes.split(' ').map(([rank, suit]) => ({
    code: rank + suit,
    value: VALUES[rank] || rank,
    suit: SUITS[suit]
}))

const cases = [
    //one of each hand type
    ['0S JS QS KS AS', 'Royal Flush'],
    ['5H 6H 7H 8H 9H', 'Straight Flush'],
    ['7S 7C 7H 7D 2S', 'Four of a Kind'],
    ['KS KC KH 4D 4S', 'Full House'],
    ['2D 7D 9D JD KD', 'Flush'],
    ['4S 5C 6H 7D 8S', 'Straight'],
    ['QS QC QH 3D 8S', 'Three of a Kind'],
    ['9S 9C 4H 4D AS', 'Two Pair'],
    ['JS JC 2H 6D 9S', 'One Pair'],
    ['2S 5C 8H JD KS', 'High Card - KING'],
    ['AS 3C 6H 9D QS', 'High Card - ACE'],

    //aces count both high and low in straights
    ['0S JC QH KD AS', 'Straight'],
    ['AS 2C 3H 4D 5S', 'Straight'],
    ['AH 2H 3H 4H 5H', 'Straight Flush'],
    ['KS AC 2H 3D 4S', 'High Card - ACE'], //straights don't wrap around

    //duplicate ranks inside a five-rank window are not straights
    ['2S 2C 3H 4D 5S', 'One Pair'],
    ['3S 3C 3H 4D 5S', 'Three of a Kind'],
    ['2S 2C 3H 3D 4S', 'Two Pair'],
    ['0S 0C JH QD AS', 'One Pair'],

    //card order doesn't matter
    ['AS KS QS JS 0S', 'Royal Flush'],
    ['8S 4C 7H 5D 6S', 'Straight'],
    ['4D KS 4S KC KH', 'Full House'],
]

for (const [codes, expected] of cases) {
    test(`${codes} is ${expected}`, () => {
        assert.equal(calculateHand(hand(codes)), expected)
    })
}

//scoring all 2,598,960 possible hands must match the standard poker counts
test('every possible hand scores with the standard frequencies', () => {
    const deck = require('../src/cardDeck').getFresh()
        .map(({ rank, suit }) => ({ value: rank.value, suit: suit.name }))
    const counts = {}
    const hand = []
    const deal = (start, depth) => {
        if (depth === 5) {
            const name = calculateHand(hand).replace(/ - .*/, '')
            counts[name] = (counts[name] || 0) + 1
            return
        }
        for (let i = start; i <= deck.length - (5 - depth); i++) {
            hand[depth] = deck[i]
            deal(i + 1, depth + 1)
        }
    }
    deal(0, 0)

    assert.deepEqual(counts, {
        'Royal Flush': 4,
        'Straight Flush': 36,
        'Four of a Kind': 624,
        'Full House': 3744,
        'Flush': 5108,
        'Straight': 10200,
        'Three of a Kind': 54912,
        'Two Pair': 123552,
        'One Pair': 1098240,
        'High Card': 1302540,
    })
})

//bad input throws a TypeError naming the problem instead of returning a wrong answer
const invalidCases = [
    ['not an array', 'AS KS', /array of 5 cards, got string/],
    ['undefined', undefined, /array of 5 cards, got undefined/],
    ['too few cards', hand('AS KS QS JS'), /expects 5 cards, got 4/],
    ['too many cards', hand('AS KS QS JS 0S 9S'), /expects 5 cards, got 6/],
    ['a null card', [...hand('AS KS QS JS'), null], /card 5 is not a card object: null/],
    ['a string card', ['AS', ...hand('KS QS JS 0S')], /card 1 is not a card object: "AS"/],
    ['an unknown value', [...hand('AS KS QS JS'), { value: 'TEN', suit: 'SPADES' }], /card 5 has an unknown value "TEN"/],
    ['a lowercase value', [{ value: 'ace', suit: 'SPADES' }, ...hand('KS QS JS 0S')], /card 1 has an unknown value "ace"/],
    ['a numeric value', [{ value: 10, suit: 'SPADES' }, ...hand('KS QS JS AS')], /card 1 has an unknown value 10/],
    ['a missing suit', [...hand('AS KS QS JS'), { value: '10' }], /card 5 has an unknown suit undefined/],
    ['a suit code instead of a name', [{ value: 'ACE', suit: 'S' }, ...hand('KS QS JS 0S')], /card 1 has an unknown suit "S"/],
    ['an inherited property name as the value', [{ value: 'toString', suit: 'SPADES' }, ...hand('KS QS JS 0S')], /unknown value "toString"/],
    ['the same card twice', hand('AS AS KD QH JC'), /contains the ACE of SPADES more than once/],
]

for (const [description, input, message] of invalidCases) {
    test(`rejects ${description}`, () => {
        assert.throws(() => calculateHand(input), { name: 'TypeError', message })
    })
}
