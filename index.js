const suitsManager = require('./src/cardSuitsManager')
const ranksManager = require('./src/cardRanksManager')
const cardGenerator = require('./src/cardGenerator')
const createPayload = require('./src/payload')
const _ = require('lodash')
const handCalculator = require('./src/handCalculator')
const cardDeck = require('./src/cardDeck')
const pjson = require('./package.json')
const cardRanks = require('./src/cardRanks')

//build a hand made of groups of same-rank cards, e.g. [3, 2] for a full house.
//each group gets a different rank, and the cards within a group get different suits
const fromGroups = sizes => {
    const ranks = _.sampleSize(cardRanks, sizes.length)
    const cards = sizes.flatMap((size, index) =>
        _.sampleSize(suitsManager.getAllSuits(), size)
            .map(suit => cardGenerator.generateCard(ranks[index], suit))
    )
    return _.shuffle(cards)
}

const functions = {
    getVersion: () => {
        return pjson.version
    },
    generateRoyalFlush: () => {
        const suit = suitsManager.getRandomSuit()
        const ranks = ranksManager.getRoyalFlushRanks()
        
        const cards = ranks.map(rank => {
          return cardGenerator.generateCard(rank, suit)
        })
      
        return createPayload(_.shuffle(cards))
    },
    generateStraightFlush: () => {
        const suit = suitsManager.getRandomSuit()
        const ranks = ranksManager.getRandomStraightRanks({ excludeHighAce: true })
      
        const cards = ranks.map(rank => {
          return cardGenerator.generateCard(rank, suit)
        })
      
        return createPayload(_.shuffle(cards))
    },
    generateFourOfAKind: () => createPayload(fromGroups([4, 1])),
    generateFullHouse: () => createPayload(fromGroups([3, 2])),
    generateFlush: () => {
        let cards;

        do {
          const randomSuit = suitsManager.getRandomSuit()
          const randomRanks = ranksManager.getRandomRank({ numberOfRanks: 5 })
        
          cards = randomRanks.map(rank => {
            return cardGenerator.generateCard(rank, randomSuit)
          })
        } while( handCalculator.calculateHand(cards) !== 'Flush' )
      
        return createPayload(cards)
    },
    generateStraight: () => {
        const ranks = ranksManager.getRandomStraightRanks()
        const suits = suitsManager.getNonFlushSuitHand()
      
        const cards = ranks.map((rank, index) => {
          return cardGenerator.generateCard(rank, suits[index])
        })
      
        return createPayload(_.shuffle(cards))
    },
    generateThreeOfAKind: () => createPayload(fromGroups([3, 1, 1])),
    generateTwoPair: () => createPayload(fromGroups([2, 2, 1])),
    generatePair: () => createPayload(fromGroups([2, 1, 1, 1])),
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
        return createPayload(_.shuffle(cards))
    },
    generateRandomHand: () => {
        //draw five cards from a shuffled deck
        const fiveCards = cardDeck.getShuffled().slice(0,5)

        const cards = []
        fiveCards.forEach(card => {
          cards.push(cardGenerator.generateCard(card.rank, card.suit))
        })

        //build the payload
        return createPayload(cards)
    }
}

const generateRandomHand = functions.generateRandomHand

module.exports = functions