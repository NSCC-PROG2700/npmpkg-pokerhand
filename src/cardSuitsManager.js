const suits = require('./cardSuits')
const _ = require('lodash')

module.exports = {
    //five suits that can't all match: two different suits, then three random ones
    getNonFlushSuitHand: () => {
        return [..._.sampleSize(suits, 2), ..._.times(3, () => _.sample(suits))]
    }
}
