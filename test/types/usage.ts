//type-checked by `npm test` (never run): correct use must compile, and every
//line marked @ts-expect-error must be rejected by the type definitions
import * as pokerhand from '../..'
import type { Card, CardCode, HandName, HandPayload, HandType } from '../..'

const hand: HandPayload = pokerhand.generateFullHouse()
const card: Card = hand.cards[0]
const code: CardCode = card.code
const name: HandName = pokerhand.calculateHand(hand.cards)
const fromPayload: HandName = pokerhand.calculateHand(hand)
const fromApi: HandName = pokerhand.calculateHand([{ value: 'ACE', suit: 'SPADES' }])
const version: string = pokerhand.getVersion()

const byName = pokerhand.generateHand('Full House')
const bySlug = pokerhand.generateHand('full-house', { seed: 1, deckId: 'abc' })
const types: readonly HandType[] = pokerhand.handTypes
for (const type of pokerhand.handTypes) pokerhand.generateHand(type)

const seeded = pokerhand.generatePair({ seed: 'table-7' })
const dealt: HandPayload[] = pokerhand.dealHands(4, { seed: 3 })
const parsed: Card[] = pokerhand.fromCodes('AS KD 0H')
const parsedArray: Card[] = pokerhand.fromCodes(['AS', 'KD'])
const result: -1 | 0 | 1 = pokerhand.compareHands(hand, dealt[0].cards)
const sorted = dealt.sort((a, b) => pokerhand.compareHands(b, a))
const best = pokerhand.bestHand([...dealt[0].cards, ...dealt[1].cards.slice(0, 2)])
const bestName: HandName = best.name
const bestCard: Card = best.cards[0]

// @ts-expect-error unknown value
pokerhand.calculateHand([{ value: 'TEN', suit: 'SPADES' }])
// @ts-expect-error suit code instead of name
pokerhand.calculateHand([{ value: 'ACE', suit: 'S' }])
// @ts-expect-error not a hand name
const wrongName: HandName = 'Five of a Kind'
// @ts-expect-error not a card code (T is not a rank code)
const badCode: CardCode = 'TS'
// @ts-expect-error no such function
pokerhand.generateFiveOfAKind()
// @ts-expect-error handTypes is read-only
pokerhand.handTypes.push('Five of a Kind')
// @ts-expect-error a number is not a hand type
pokerhand.generateHand(5)
// @ts-expect-error unknown option
pokerhand.generatePair({ seeed: 1 })
// @ts-expect-error seed must be a number or string
pokerhand.generatePair({ seed: true })
// @ts-expect-error dealHands needs a count
pokerhand.dealHands()
// @ts-expect-error compareHands returns -1, 0 or 1, not a boolean
const firstWins: boolean = pokerhand.compareHands(hand, hand)
