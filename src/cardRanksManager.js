const cardRanks = require('./cardRanks')
const _ = require('lodash')

module.exports = {
    getRandomRank: (options) => {

        let ranks = [...cardRanks].slice(1) //remove the first ace

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
        return cardRanks.slice(9)
    },
    getRandomStraightRanks: (options) => {
        const cardRanksCopy = [...cardRanks]

        if(options && options.hasOwnProperty('excludeHighAce')){
            if(options.excludeHighAce){
                cardRanksCopy.pop() //remove high ace
            }
        }

        const start = Math.floor(Math.random() * 9)
        return cardRanksCopy.slice(start, start + 5)
    }
}