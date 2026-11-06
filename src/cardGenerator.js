const imageUrl = (code, extension) => `https://deckofcardsapi.com/static/img/${code}.${extension}`

module.exports = {
    //build a card in the deckofcardsapi.com format from a rank and a suit
    generateCard: (rank, suit) => {
        const code = `${rank.code}${suit.code}`
        return {
            code,
            image: imageUrl(code, 'png'),
            images: {
                svg: imageUrl(code, 'svg'),
                png: imageUrl(code, 'png'),
            },
            value: rank.value,
            suit: suit.name,
        }
    }
}
