# @macaines/pokerhand

Generates five-card poker hands of a chosen type, and names the hand any five cards make.

Cards use the same format as [deckofcardsapi.com](https://deckofcardsapi.com), so the images link straight to that site.

## Install

```sh
npm install @macaines/pokerhand
```

## Usage

```js
const pokerhand = require('@macaines/pokerhand')

const hand = pokerhand.generateFullHouse()
console.log(hand.cards.map(card => card.code))   // e.g. [ 'KS', '4D', 'KH', '4C', 'KD' ]
console.log(pokerhand.calculateHand(hand.cards)) // 'Full House'
```

## Generating hands

Each function returns a new, randomly generated hand of that type, with the cards in random order.

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

They all return the same shape:

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

## Naming a hand

`calculateHand(cards)` takes five cards (only `value` and `suit` are used) and returns one of:

`'Royal Flush'`, `'Straight Flush'`, `'Four of a Kind'`, `'Full House'`, `'Flush'`, `'Straight'`, `'Three of a Kind'`, `'Two Pair'`, `'One Pair'`, or `'High Card - <value>'` (for example `'High Card - ACE'`).

Aces count high or low in straights: both 10-J-Q-K-A and A-2-3-4-5 are straights.

It throws a `TypeError` if the input isn't exactly five valid, distinct cards. The message names the problem, for example `card 3 has an unknown value "TEN"` or `the hand contains the ACE of SPADES more than once`. Values and suits must match the formats above exactly, so `'ace'`, `10` (a number) and `'S'` are rejected.

## Other

`getVersion()` returns the installed package version.

The package includes TypeScript type definitions (`Card`, `HandPayload`, `HandName` and the rest), so editors autocomplete the functions and card fields in both TypeScript and JavaScript.

## Development

```sh
npm test
```

The tests check fixed example hands, run every generator many times, and score all 2,598,960 possible hands against the standard poker counts.

Every push to `master` publishes to npm through GitHub Actions, after the tests pass. Bump the version in `package.json` first, or the publish will fail.
