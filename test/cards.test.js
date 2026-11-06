const { test } = require('node:test')
const assert = require('node:assert/strict')
const ranks = require('../src/cardRanks')
const deck = require('../src/cardDeck')
const ranksManager = require('../src/cardRanksManager')

const codesOf = cards => cards.map(({ rank, suit }) => rank.code + suit.code)

test('there are 13 distinct ranks in ascending order', () => {
    assert.equal(ranks.length, 13)
    assert.equal(new Set(ranks.map(rank => rank.code)).size, 13)
    assert.deepEqual(ranks.map(rank => rank.order), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
})

test('the deck has 52 distinct cards', () => {
    assert.equal(new Set(codesOf(deck.getFresh())).size, 52)
    assert.equal(new Set(codesOf(deck.getShuffled())).size, 52)
})

test('royal flush ranks are 10 through ace', () => {
    assert.deepEqual(ranksManager.getRoyalFlushRanks().map(rank => rank.code), ['0', 'J', 'Q', 'K', 'A'])
})

test('straight-flush ranks never include 10-J-Q-K-A', () => {
    for (let i = 0; i < 1000; i++) {
        const codes = ranksManager.getRandomStraightRanks({ excludeHighAce: true }).map(rank => rank.code)
        assert.ok(!(codes.includes('A') && codes.includes('K')), `got ${codes}`)
    }
})
