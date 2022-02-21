const _ = require('lodash')

const cardTemplate = {
    code: '',
    image: 'https://deckofcardsapi.com/static/img/[code].png',
    images: {
        svg: 'https://deckofcardsapi.com/static/img/[code].svg',
        png: 'https://deckofcardsapi.com/static/img/[code].png'
        },
    value: '',
    suit: ''
}

module.exports.getCardTemplate = () => {
    return _.cloneDeep(cardTemplate)
}