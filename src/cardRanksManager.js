const cardRanks = require('./cardRanks')
const _ = require('lodash')

const ACE = cardRanks.find(rank => rank.code === 'A')

//the ten possible straights, from A-2-3-4-5 (ace low) up to 10-J-Q-K-A (ace high)
const STRAIGHTS = _.range(1, 11).map(low =>
    _.range(low, low + 5).map(order =>
        order === 1 ? ACE : cardRanks.find(rank => rank.order === order)
    )
)

module.exports = {
    getRandomRank: (options) => {

        let ranks = cardRanks

        if(options && options.hasOwnProperty('exclude')){
            if(Array.isArray(options.exclude)){
                ranks = ranks.filter(rank => {
                    return !options.exclude.includes(rank)
                })
            } else {
                ranks = ranks.filter(rank => {
                    return rank.code !== options.exclude.code
                })
            }
        }

        const shuffled = _.shuffle(ranks)
        
        if(options && options.hasOwnProperty('numberOfRanks')){
            if(options.numberOfRanks > 1){
                return shuffled.slice(0, options.numberOfRanks)
            }            
        } 

        return shuffled[0]
   
    },
    getRoyalFlushRanks: () => {
        return cardRanks.filter(rank => rank.order >= 10)
    },
    getRandomStraightRanks: (options) => {
        //10-J-Q-K-A is excluded when building a straight flush (it would be a royal flush)
        const straights = (options && options.excludeHighAce)
            ? STRAIGHTS.slice(0, -1)
            : STRAIGHTS
        return _.sample(straights)
    }
}
