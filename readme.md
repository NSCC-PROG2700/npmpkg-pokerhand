# @macaines/pokerhand

Generates five-card poker hands of a chosen type, names and compares hands, deals from a shared deck, and finds the best hand in up to seven cards.

Cards use the same format as [deckofcardsapi.com](https://deckofcardsapi.com), so the images link straight to that site. TypeScript type definitions are included, so editors autocomplete the functions and card fields in both TypeScript and JavaScript.

## Install

```sh
npm install @macaines/pokerhand
```

## Usage

```js
const pokerhand = require('@macaines/pokerhand')

const hand = pokerhand.generateHand('Full House')
console.log(hand.cards.map(card => card.code))   // e.g. [ 'KS', '4D', 'KH', '4C', 'KD' ]
console.log(pokerhand.calculateHand(hand))       // 'Full House'

const [mine, yours] = pokerhand.dealHands(2)
pokerhand.compareHands(mine, yours)              // 1, -1 or 0
```

## Generating hands

`generateHand(type)` generates a random hand of the given type:

```js
pokerhand.generateHand('Full House')
pokerhand.generateHand('full-house')   // case, spaces, hyphens and underscores are ignored
```

`handTypes` lists every type it accepts, strongest first, which is handy for a menu or for checking a URL parameter:

```js
pokerhand.handTypes
// [ 'Royal Flush', 'Straight Flush', 'Four of a Kind', 'Full House', 'Flush',
//   'Straight', 'Three of a Kind', 'Two Pair', 'One Pair', 'High Card' ]
```

The names match what `calculateHand` returns, so `calculateHand(generateHand(type))` gives back `type` (with the high card's value added for `'High Card'`). An unknown name throws a `TypeError` listing the valid ones.

Each hand type also has its own function:

| Function | Hand |
|---|---|
| `generateRoyalFlush()` | 10, J, Q, K, A of one suit |
| `generateStraightFlush()` | Five ranks in a row, one suit (never 10 to ace) |
| `generateFourOfAKind()` | Four cards of one rank |
| `generateFullHouse()` | Three of one rank and two of another |
| `generateFlush()` | Five cards of one suit, not in a row |
| `generateStraight()` | Five ranks in a row, mixed suits (A-2-3-4-5 up to 10-J-Q-K-A) |
| `generateThreeOfAKind()` | Three cards of one rank |
| `generateTwoPair()` | Two pairs of different ranks |
| `generatePair()` | One pair |
| `generateHighCard()` | None of the above |
| `generateRandomHand()` | Five cards dealt from a shuffled deck, any hand type |

### Dealing several hands

`dealHands(count)` deals 1 to 10 hands from one shuffled deck, so no card appears twice across them. It returns an array of results; `remaining` counts down as the deck is used (47, 42, 37, …).

```js
const players = pokerhand.dealHands(4)
```

### Options

Every generator, `generateHand` and `dealHands` take an optional last argument:

| Option | Effect |
|---|---|
| `seed` | A number or string. The same seed always gives the same hand, which is useful for tests, demos, or giving everyone the same hand. Results for a seed can change between package versions. |
| `deckId` | Sets `deck_id` on the result. Defaults to `'testdeck'`. |

```js
pokerhand.generateHand('Flush', { seed: 42 })   // the same flush every time
pokerhand.dealHands(4, { seed: 'table-7', deckId: 'table-7' })
```

An unknown option, or a value of the wrong type, throws a `TypeError`.

### What the generators return

```js
{
  success: true,
  deck_id: 'testdeck',
  remaining: 47,
  cards: [
    {
      code: 'KS',
      image: 'https://deckofcardsapi.com/static/img/KS.png',
      images: {
        svg: 'https://deckofcardsapi.com/static/img/KS.svg',
        png: 'https://deckofcardsapi.com/static/img/KS.png'
      },
      value: 'KING',
      suit: 'SPADES'
    },
    // ...four more cards
  ]
}
```

- `code` is the rank code followed by the suit code. The rank codes are `2`–`9`, `0` (for 10), `J`, `Q`, `K` and `A`; the suit codes are `S`, `C`, `H` and `D`.
- `value` is one of `2`–`10`, `JACK`, `QUEEN`, `KING` or `ACE`.
- `suit` is one of `SPADES`, `CLUBS`, `HEARTS` or `DIAMONDS`.

## Working with hands

The functions below take either an array of cards or a generator result. They only use each card's `value` and `suit`, so cards from deckofcardsapi.com work too. They throw a `TypeError` if the cards aren't valid and distinct; the message names the problem, for example `card 3 has an unknown value "TEN"` or `the hand contains the ACE of SPADES more than once`. Values and suits must match the formats above exactly, so `'ace'`, `10` (a number) and `'S'` are rejected.

### `calculateHand(cards)`

Names the hand made by five cards. Returns one of:

`'Royal Flush'`, `'Straight Flush'`, `'Four of a Kind'`, `'Full House'`, `'Flush'`, `'Straight'`, `'Three of a Kind'`, `'Two Pair'`, `'One Pair'`, or `'High Card - <value>'` (for example `'High Card - ACE'`).

Aces count high or low in straights: both 10-J-Q-K-A and A-2-3-4-5 are straights.

### `compareHands(first, second)`

Compares two five-card hands: returns `1` if the first wins, `-1` if the second wins, and `0` for a tie. Hands of the same type are decided the standard way: the higher pair, three of a kind or straight first, then the remaining cards from highest down. Suits never break ties.

```js
pokerhand.compareHands(pokerhand.fromCodes('KS KD 2C 3H 4S'), pokerhand.fromCodes('QS QD AC KH JS'))   // 1
hands.sort((a, b) => pokerhand.compareHands(b, a))   // strongest first
```

### `bestHand(cards)`

Finds the strongest five-card hand within 5 to 7 cards, such as Texas Hold'em's two hole cards plus the five shared cards. Returns `{ name, cards }`, where `cards` are the five winning cards (the same objects you passed in).

```js
pokerhand.bestHand(pokerhand.fromCodes('AS KD 2D 7C 3S 4H 5C'))
// { name: 'Straight', cards: [ AS, 2D, 3S, 4H, 5C ] }
```

### `fromCodes(codes)`

Builds full cards from codes, for writing hands by hand. Takes a string separated by spaces or commas, or an array. Lowercase and `10` for tens also work.

```js
pokerhand.fromCodes('AS KD 0H')
pokerhand.fromCodes(['as', '10h', 'kd'])
```

## Other

`getVersion()` returns the installed package version.

## Development

```sh
npm test
```

The tests check fixed example hands and hand comparisons, run every generator many times, and score all 2,598,960 possible hands against the standard poker counts and the 7,462 distinct hand ranks. They also type-check example code against the TypeScript definitions.

Every push to `master` publishes to npm through GitHub Actions, after the tests pass. Bump the version in `package.json` first, or the publish will fail.
