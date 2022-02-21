const cardTemplate = require('./cardTemplate')

module.exports = {
    generateCard: (value, suit) => {
        const newCardCode = `${value.code}${suit.code}`

        const newCard = cardTemplate.getCardTemplate()
        //console.log(newCard)
        newCard.code = newCardCode
        newCard.image = newCard.image.replace('[code]', newCardCode)
        newCard.images.png = newCard.images.png.replace('[code]', newCardCode)
        newCard.images.svg = newCard.images.svg.replace('[code]', newCardCode)
        newCard.value = value.value
        newCard.suit = suit.name

        return newCard
    }
}