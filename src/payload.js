//build a new payload object on every call so results from separate
//generator calls never share (and overwrite) the same object
const createPayload = (cards, { deckId = 'testdeck', remaining = 47 } = {}) => ({
    success: true,
    deck_id: deckId,
    cards,
    remaining
})

module.exports = createPayload
