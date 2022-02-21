const suits = require('./cardSuits')
const _ = require('lodash')

const manager = {
    getAllSuits: () => {
        return suits
    },
    getRandomSuit: (options) => {
        let shuffled = _.shuffle(suits) //creates a copy
       
        if(options && options.hasOwnProperty('numberOfSuits')){
            if(options.numberOfSuits > 4){
                return [...shuffled, shuffled[Math.floor(Math.random() * shuffled.length)]]
            }
            else if(options.numberOfSuits > 1){
                return shuffled.slice(0, options.numberOfSuits)
            }
        }
        return shuffled[0]
    },
    getNonFlushSuitHand: () => {
        let shuffled = _.shuffle(suits)
        const result = []

        //add first two different suits to ensure non-flush
        result.push(shuffled[0])
        result.push(shuffled[1])

        //randomly add the remaining card suits
        while(result.length < 5){
            result.push(getRandomSuit())
        }
        
        return result;
    }
}

let getAllSuits = manager.getAllSuits.bind(manager)
let getRandomSuit = manager.getRandomSuit.bind(manager)
let getNonFlushSuitHand = manager.getNonFlushSuitHand.bind(manager)



module.exports = manager
