const suits = require('./cardSuits')
const random = require('./random')

module.exports = {
    //five suits that can't all match: two different suits, then three random ones
    getNonFlushSuitHand: () => {
        return [...random.sampleSize(suits, 2), ...[1, 2, 3].map(() => random.sample(suits))]
    }
}
