const suitsManager = require('./src/cardSuitsManager')
const valuesManager = require('./src/cardValuesManager')
const cardGenerator = require('./src/cardGenerator')
const payload = require('./src/payload')
const _ = require('lodash')
const handCalculator = require('./src/handCalculator')

const functions = {
    generateRoyalFlush: () => {
        const randomSuit = suitsManager.getRandomSuit()
        const royalFlushValues = valuesManager.getRoyalFlushValues()
        
        const cards = royalFlushValues.map(value => {
          return cardGenerator.generateCard(value, randomSuit)
        })
      
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateStraightFlush: () => {
        const suit = suitsManager.getRandomSuit()
        const straight = valuesManager.getStraightValues({ excludeHighAce: true })
      
        cards = straight.map(value => {
          return cardGenerator.generateCard(value, suit)
        })
      
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateFourOfAKind: () => {
        const allSuits = suitsManager.getAllSuits()
        const randomValue = valuesManager.getRandomValue()
      
        //generate the four of a kind cards
        const cards = allSuits.map(suit => {
          return cardGenerator.generateCard(randomValue, suit)
        })
      
        //generate one extra card
        const options = {
          exclude: randomValue
        }
        const extraCard = cardGenerator.generateCard(valuesManager.getRandomValue(options),
                                                     suitsManager.getRandomSuit())
        cards.push(extraCard)
        
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateFullHouse: () => {
        const threeOfAKindSuits = suitsManager.getRandomSuit({ numberOfSuits: 3 })
        const twoOfAKindSuits = suitsManager.getRandomSuit({ numberOfSuits: 2 })
        const threeOfAKindValue = valuesManager.getRandomValue()
        const twoOfAKindValue = valuesManager.getRandomValue({ exclude: threeOfAKindValue })
      
        const allSuits = [...threeOfAKindSuits, ...twoOfAKindSuits]
        const allValues = [...Array(3).fill(threeOfAKindValue), ...Array(2).fill(twoOfAKindValue)]
      
        const cards = allSuits.map((suit, index) => {
          return cardGenerator.generateCard(allValues[index], suit)
        })
      
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateFlush: () => {
        let cards;

        do {
          const randomSuit = suitsManager.getRandomSuit()
          const randomValues = valuesManager.getRandomValue({ numberOfValues: 5 })
        
          cards = randomValues.map(value => {
            return cardGenerator.generateCard(value, randomSuit)
          })
        } while( handCalculator.calculateHand(cards) !== 'Flush' )
      
        payload.cards = cards
        return payload
    },
    generateStraight: () => {
        const straightValues = valuesManager.getStraightValues()
        console.log(straightValues)
        const suits = suitsManager.getNonFlushSuitHand()
        console.log(suits)
      
        const cards = straightValues.map((value, index) => {
          return cardGenerator.generateCard(value, suits[index])
        })
      
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateThreeOfAKind: () => {
        const suits = suitsManager.getRandomSuit({ numberOfSuits: 3 })
        const randomValue = valuesManager.getRandomValue()
      
        //generate the three of a kind cards
        const cards = suits.map(suit => {
          return cardGenerator.generateCard(randomValue, suit)
        })
      
        //generate and add two extra cards to go with the three of a kind
        const options = {
          numberOfValues: 2,
          exclude: randomValue //exclude the value from the three of a kind
        }
        valuesManager.getRandomValue(options).forEach(value => {
          const newCard = cardGenerator.generateCard(value, suitsManager.getRandomSuit())
          cards.push(newCard)
        })
      
        //build the payload
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateTwoPair: () => {
        const firstPairSuits = suitsManager.getRandomSuit({ numberOfSuits: 2 })
        const secondPairSuits = suitsManager.getRandomSuit({ numberOfSuits: 2 })
        const pairValues = valuesManager.getRandomValue({ numberOfValues: 2 })
        const fifthCardValue = valuesManager.getRandomValue({ exclude: pairValues })
      
        const cards = []
        firstPairSuits.forEach(suit => {
          cards.push(cardGenerator.generateCard(pairValues[0], suit))
        })
        secondPairSuits.forEach(suit => {
          cards.push(cardGenerator.generateCard(pairValues[1], suit))
        })
        cards.push(cardGenerator.generateCard(fifthCardValue, suitsManager.getRandomSuit()))
      
        //build the payload
        payload.cards = _.shuffle(cards)
        return payload
    },
    generatePair: () => {
        const suits = suitsManager.getRandomSuit({ numberOfSuits: 2 })
        const randomValue = valuesManager.getRandomValue()
      
        //generate the pair
        const cards = suits.map(suit => {
          return cardGenerator.generateCard(randomValue, suit)
        })
      
        //generate and add three extra cards to go with the pair
        const options = {
          numberOfValues: 3,
          exclude: randomValue //exclude the value from the pair
        }
        valuesManager.getRandomValue(options).forEach(value => {
          const newCard = cardGenerator.generateCard(value, suitsManager.getRandomSuit())
          cards.push(newCard)
        })
      
        //build the payload
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateHighCard: () => {
        let hand; 
        do{
            hand = generateRandomHand()
        } while (!handCalculator.calculateHand(hand.cards).toUpperCase().includes('HIGH CARD'))
        
        return hand
    },
    generateRandomHand: () => {
        const fiveRandomValues = valuesManager.getRandomValue({numberOfValues: 5})
        const fiveRandomSuits = suitsManager.getRandomSuit({numberOfSuits: 5})
      
        const cards = []
        fiveRandomValues.forEach((value, index) => {
            cards.push(cardGenerator.generateCard(value, fiveRandomSuits[index]))
        })

        //build the payload
        payload.cards = _.shuffle(cards)
        return payload 
    }
}

const generateRandomHand = functions.generateRandomHand

module.exports = functions