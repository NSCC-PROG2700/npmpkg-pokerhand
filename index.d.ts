/** Rank code used in card codes: `0` stands for 10. */
export type RankCode = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | 'J' | 'Q' | 'K' | 'A'

/** Suit code used in card codes. */
export type SuitCode = 'S' | 'C' | 'H' | 'D'

/** Card code: rank code followed by suit code, e.g. `'KS'` or `'0H'` (10 of hearts). */
export type CardCode = `${RankCode}${SuitCode}`

export type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'JACK' | 'QUEEN' | 'KING' | 'ACE'

export type CardSuit = 'SPADES' | 'CLUBS' | 'HEARTS' | 'DIAMONDS'

/** A card in the deckofcardsapi.com format. */
export interface Card {
    code: CardCode
    /** PNG image of the card on deckofcardsapi.com. */
    image: string
    images: {
        svg: string
        png: string
    }
    value: CardValue
    suit: CardSuit
}

/** What every generator returns: a new object each call. */
export interface HandPayload {
    success: true
    deck_id: string
    /** Always five cards. */
    cards: Card[]
    remaining: number
}

/** The hand names `calculateHand` can return. */
export type HandName =
    | 'Royal Flush'
    | 'Straight Flush'
    | 'Four of a Kind'
    | 'Full House'
    | 'Flush'
    | 'Straight'
    | 'Three of a Kind'
    | 'Two Pair'
    | 'One Pair'
    | `High Card - ${CardValue}`

/** Returns the installed package version, e.g. `'1.2.0'`. */
export function getVersion(): string

/**
 * Names the poker hand made by five cards, e.g. `'Full House'` or `'High Card - KING'`.
 * Only each card's `value` and `suit` are used. Aces count high or low in straights.
 * @throws {TypeError} if the input isn't exactly five valid, distinct cards.
 */
export function calculateHand(cards: ReadonlyArray<Pick<Card, 'value' | 'suit'>>): HandName

/** 10, J, Q, K, A of one suit. */
export function generateRoyalFlush(): HandPayload

/** Five ranks in a row in one suit, never 10 to ace. */
export function generateStraightFlush(): HandPayload

/** Four cards of one rank, plus one other card. */
export function generateFourOfAKind(): HandPayload

/** Three cards of one rank and two of another. */
export function generateFullHouse(): HandPayload

/** Five cards of one suit, not in a row. */
export function generateFlush(): HandPayload

/** Five ranks in a row in mixed suits, from A-2-3-4-5 up to 10-J-Q-K-A. */
export function generateStraight(): HandPayload

/** Three cards of one rank, plus two cards of different ranks. */
export function generateThreeOfAKind(): HandPayload

/** Two pairs of different ranks, plus one other card. */
export function generateTwoPair(): HandPayload

/** One pair, plus three cards of different ranks. */
export function generatePair(): HandPayload

/** Five cards that make none of the other hands. */
export function generateHighCard(): HandPayload

/** Five cards dealt from a shuffled deck; any hand type. */
export function generateRandomHand(): HandPayload
