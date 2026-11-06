//build a new payload object on every call so results from separate
//generator calls never share (and overwrite) the same object
const createPayload = cards => ({
    success: true,
    deck_id: "testdeck",
    cards,
    remaining: 47
})

module.exports = createPayload
