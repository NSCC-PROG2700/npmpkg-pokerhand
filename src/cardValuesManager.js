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
    },
    getHighCardHand: () => {
        const highCardHand = []
        const cardValuesCopy = [...cardValues] //shallow copy
        cardValuesCopy.pop() //remove high ace

        let pile1 = cardValuesCopy.slice(0, 4)
        let pile2 = cardValuesCopy.slice(4, 8)
        let pile3 = cardValuesCopy.slice(8)

        //select two values from pile1
        highCardHand.push(pile1[Math.floor(Math.random() * pile1.length)])
        pile1 = pile1.filter(item => item.code !== highCardHand[0].code)
        highCardHand.push(pile1[Math.floor(Math.random() * pile1.length)])

        //select one value from pile2
        highCardHand.push(pile2[Math.floor(Math.random() * pile2.length)])

        //select two values from pile3
        highCardHand.push(pile3[Math.floor(Math.random() * pile3.length)])
        pile3 = pile3.filter(item => item.code !== highCardHand[3].code)
        highCardHand.push(pile3[Math.floor(Math.random() * pile3.length)])

        return highCardHand
    }
}