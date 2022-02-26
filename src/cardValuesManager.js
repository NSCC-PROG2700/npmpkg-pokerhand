const cardValues = require('./cardValues')
const _ = require('lodash')

module.exports = {
    getRandomValue: (options) => {

        let values = [...cardValues].slice(1) //remove the first ace

        if(options && options.hasOwnProperty('exclude')){
            if(Array.isArray(options.exclude)){
                values = values.filter(value => {
                    return !options.exclude.includes(value)
                })
            } else {
                values = values.filter(value => {
                    return value.code !== options.exclude.code
                })
            }
        }

        const shuffled = _.shuffle(values)
        
        if(options && options.hasOwnProperty('numberOfValues')){
            if(options.numberOfValues > 1){
                return shuffled.slice(0, options.numberOfValues)
            }            
        } 

        return shuffled[0]
   
    },
    getRoyalFlushValues: () => {
        return cardValues.slice(9)
    },
    getStraightValues: (options) => {
        const cardValuesCopy = [...cardValues]

        if(options && options.hasOwnProperty('excludeHighAce')){
            if(options.excludeHighAce){
                cardValuesCopy.pop() //remove high ace
            }
        }

        const start = Math.floor(Math.random() * 9)
        return cardValuesCopy.slice(start, start + 5)
    }
}