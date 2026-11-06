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

/** Options every generator accepts. */
export interface GenerateOptions {
    /**
     * Makes the result repeatable: the same seed always gives the same hand.
     * Results for a given seed can change between package versions.
     */
    seed?: number | string
    /** Sets `deck_id` on the result. Defaults to `'testdeck'`. */
    deckId?: string
}

/** Any card with a value and a suit, such as a `Card` or a card from deckofcardsapi.com. */
export type CardLike = Pick<Card, 'value' | 'suit'>

/** Cards, or a payload holding them. */
export type CardsInput<C extends CardLike = CardLike> = ReadonlyArray<C> | { cards: ReadonlyArray<C> }

/** The hand types `generateHand` accepts, e.g. `'Full House'`. */
export type HandType =
    | 'Royal Flush'
    | 'Straight Flush'
    | 'Four of a Kind'
    | 'Full House'
    | 'Flush'
    | 'Straight'
    | 'Three of a Kind'
    | 'Two Pair'
    | 'One Pair'
    | 'High Card'

/** Every hand type `generateHand` accepts, strongest first. Handy for building a menu. */
export const handTypes: readonly HandType[]

/**
 * Generates a random hand of the given type, e.g. `generateHand('Full House')`.
 * Case, spaces, hyphens and underscores are ignored, so `'full-house'` also works.
 * @throws {TypeError} if the type isn't one of `handTypes`.
 */
export function generateHand(type: HandType | (string & {}), options?: GenerateOptions): HandPayload

/**
 * Deals 1 to 10 five-card hands from one shuffled deck, with no card dealt twice.
 * `remaining` counts down: 47 after the first hand, 42 after the second, and so on.
 * @throws {TypeError} if count isn't a whole number. @throws {RangeError} if it's outside 1 to 10.
 */
export function dealHands(count: number, options?: GenerateOptions): HandPayload[]

/**
 * Builds full cards from codes, e.g. `fromCodes('AS KD 0H')`. Accepts a string (separated by
 * spaces or commas) or an array; lowercase and `10` for tens also work.
 * @throws {TypeError} for an unknown code.
 */
export function fromCodes(codes: string | readonly string[]): Card[]

/**
 * Compares two hands of five cards: `1` if the first wins, `-1` if the second wins, `0` for a tie.
 * Ties are broken the standard way, e.g. the higher pair, then the other cards from highest down.
 * To sort hands strongest first: `hands.sort((a, b) => compareHands(b, a))`.
 * @throws {TypeError} if either hand isn't exactly five valid, distinct cards.
 */
export function compareHands(first: CardsInput, second: CardsInput): -1 | 0 | 1

/**
 * Finds the strongest five-card hand within 5 to 7 cards, e.g. Texas Hold'em's two hole cards
 * plus five shared cards. Returns its name and the five cards (the same objects passed in).
 * @throws {TypeError} if the input isn't 5 to 7 valid, distinct cards.
 */
export function bestHand<C extends CardLike>(cards: CardsInput<C>): { name: HandName; cards: C[] }

/** Returns the installed package version, e.g. `'1.2.0'`. */
export function getVersion(): string

/**
 * Names the poker hand made by five cards, e.g. `'Full House'` or `'High Card - KING'`.
 * Accepts five cards or a payload. Only each card's `value` and `suit` are used.
 * Aces count high or low in straights.
 * @throws {TypeError} if the input isn't exactly five valid, distinct cards.
 */
export function calculateHand(cards: CardsInput): HandName

/** 10, J, Q, K, A of one suit. */
export function generateRoyalFlush(options?: GenerateOptions): HandPayload

/** Five ranks in a row in one suit, never 10 to ace. */
export function generateStraightFlush(options?: GenerateOptions): HandPayload

/** Four cards of one rank, plus one other card. */
export function generateFourOfAKind(options?: GenerateOptions): HandPayload

/** Three cards of one rank and two of another. */
export function generateFullHouse(options?: GenerateOptions): HandPayload

/** Five cards of one suit, not in a row. */
export function generateFlush(options?: GenerateOptions): HandPayload

/** Five ranks in a row in mixed suits, from A-2-3-4-5 up to 10-J-Q-K-A. */
export function generateStraight(options?: GenerateOptions): HandPayload

/** Three cards of one rank, plus two cards of different ranks. */
export function generateThreeOfAKind(options?: GenerateOptions): HandPayload

/** Two pairs of different ranks, plus one other card. */
export function generateTwoPair(options?: GenerateOptions): HandPayload

/** One pair, plus three cards of different ranks. */
export function generatePair(options?: GenerateOptions): HandPayload

/** Five cards that make none of the other hands. */
export function generateHighCard(options?: GenerateOptions): HandPayload

/** Five cards dealt from a shuffled deck; any hand type. */
export function generateRandomHand(options?: GenerateOptions): HandPayload
