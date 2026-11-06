//every rank once, lowest to highest; `order` is the rank's numeric value (ace = 14).
//code and value match the deckofcardsapi.com card format
module.exports = [
    { code: '2', value: '2',     order: 2 },
    { code: '3', value: '3',     order: 3 },
    { code: '4', value: '4',     order: 4 },
    { code: '5', value: '5',     order: 5 },
    { code: '6', value: '6',     order: 6 },
    { code: '7', value: '7',     order: 7 },
    { code: '8', value: '8',     order: 8 },
    { code: '9', value: '9',     order: 9 },
    { code: '0', value: '10',    order: 10 },
    { code: 'J', value: 'JACK',  order: 11 },
    { code: 'Q', value: 'QUEEN', order: 12 },
    { code: 'K', value: 'KING',  order: 13 },
    { code: 'A', value: 'ACE',   order: 14 },
]
