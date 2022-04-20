const suitsManager = require('./src/cardSuitsManager')
const ranksManager = require('./src/cardRanksManager')
const cardGenerator = require('./src/cardGenerator')
const payload = require('./src/payload')
const _ = require('lodash')
const handCalculator = require('./src/handCalculator')
const cardDeck = require('./src/cardDeck')

const functions = {
    generateRoyalFlush: () => {
        const suit = suitsManager.getRandomSuit()
        const ranks = ranksManager.getRoyalFlushRanks()
        
        const cards = ranks.map(rank => {
          return cardGenerator.generateCard(rank, suit)
        })
      
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateStraightFlush: () => {
        const suit = suitsManager.getRandomSuit()
        const ranks = ranksManager.getRandomStraightRanks({ excludeHighAce: true })
      
        cards = ranks.map(rank => {
          return cardGenerator.generateCard(rank, suit)
        })
      
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateFourOfAKind: () => {
        const suits = suitsManager.getAllSuits()
        const fourOfAKindRank = ranksManager.getRandomRank()
      
        //generate the four of a kind cards
        const cards = suits.map(suit => {
          return cardGenerator.generateCard(fourOfAKindRank, suit)
        })
      
        //generate one extra card
        const additionalRank = ranksManager.getRandomRank({
          exclude: fourOfAKindRank
        })
        const extraCard = cardGenerator.generateCard(additionalRank,
                                                     suitsManager.getRandomSuit())
        cards.push(extraCard)
        
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateFullHouse: () => {
        const threeOfAKindSuits = suitsManager.getRandomSuit({ numberOfSuits: 3 })
        const twoOfAKindSuits = suitsManager.getRandomSuit({ numberOfSuits: 2 })
        const ranks = ranksManager.getRandomRank({ numberOfRanks: 2 })
      
        const allSuits = [...threeOfAKindSuits, ...twoOfAKindSuits]
        const allRanks = [...Array(3).fill(ranks[0]), ...Array(2).fill(ranks[1])]
      
        const cards = allSuits.map((suit, index) => {
          return cardGenerator.generateCard(allRanks[index], suit)
        })
      
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateFlush: () => {
        let cards;

        do {
          const randomSuit = suitsManager.getRandomSuit()
          const randomRanks = ranksManager.getRandomRank({ numberOfRanks: 5 })
        
          cards = randomRanks.map(rank => {
            return cardGenerator.generateCard(rank, randomSuit)
          })
        } while( handCalculator.calculateHand(cards) !== 'Flush' )
      
        payload.cards = cards
        return payload
    },
    generateStraight: () => {
        const ranks = ranksManager.getRandomStraightRanks()
        const suits = suitsManager.getNonFlushSuitHand()
      
        const cards = ranks.map((rank, index) => {
          return cardGenerator.generateCard(rank, suits[index])
        })
      
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateThreeOfAKind: () => {
        const suits = suitsManager.getRandomSuit({ numberOfSuits: 3 })
        const rank = ranksManager.getRandomRank()
      
        //generate the three of a kind cards
        const cards = suits.map(suit => {
          return cardGenerator.generateCard(rank, suit)
        })
      
        //generate and add two extra cards to go with the three of a kind
        const options = {
          numberOfRanks: 2,
          exclude: rank //exclude the rank from the three of a kind
        }
        ranksManager.getRandomRank(options).forEach(rank => {
          const newCard = cardGenerator.generateCard(rank, suitsManager.getRandomSuit())
          cards.push(newCard)
        })
      
        //build the payload
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateTwoPair: () => {
        const firstPairSuits = suitsManager.getRandomSuit({ numberOfSuits: 2 })
        const secondPairSuits = suitsManager.getRandomSuit({ numberOfSuits: 2 })
        const pairRanks = ranksManager.getRandomRank({ numberOfRanks: 2 })
        const fifthCardRank = ranksManager.getRandomRank({ exclude: pairRanks })
      
        const cards = []
        firstPairSuits.forEach(suit => {
          cards.push(cardGenerator.generateCard(pairRanks[0], suit))
        })
        secondPairSuits.forEach(suit => {
          cards.push(cardGenerator.generateCard(pairRanks[1], suit))
        })
        cards.push(cardGenerator.generateCard(fifthCardRank, suitsManager.getRandomSuit()))
      
        //build the payload
        payload.cards = _.shuffle(cards)
        return payload
    },
    generatePair: () => {
        const suits = suitsManager.getRandomSuit({ numberOfSuits: 2 })
        const pairRank = ranksManager.getRandomRank()
      
        //generate the pair
        const cards = suits.map(suit => {
          return cardGenerator.generateCard(pairRank, suit)
        })
      
        //generate and add three extra cards to go with the pair
        const options = {
          numberOfRanks: 3,
          exclude: pairRank //exclude the rank from the pair
        }
        ranksManager.getRandomRank(options).forEach(rank => {
          const newCard = cardGenerator.generateCard(rank, suitsManager.getRandomSuit())
          cards.push(newCard)
        })
      
        //build the payload
        payload.cards = _.shuffle(cards)
        return payload
    },
    generateHighCard: () => {
        let cards; 
        do{
            cards = []
            const ranks = ranksManager.getRandomRank({numberOfRanks: 5})
            const suits = suitsManager.getRandomSuit({numberOfSuits: 5})
          
            ranks.forEach((rank, index) => {
                cards.push(cardGenerator.generateCard(rank, suits[index]))
            })
        } while (!handCalculator.calculateHand(cards).toUpperCase().includes('HIGH CARD'))
        
        //build the payload
        payload.cards = _.shuffle(cards)
        return payload 
    },
    generateRandomHand: () => {
        //draw five cards from a shuffled deck
        const fiveCards = cardDeck.getShuffled().slice(0,5)

        const cards = []
        fiveCards.forEach(card => {
          cards.push(cardGenerator.generateCard(card.rank, card.suit))
        })

        //build the payload
        payload.cards = cards
        return payload 
    }
}

const generateRandomHand = functions.generateRandomHand

module.exports = functions