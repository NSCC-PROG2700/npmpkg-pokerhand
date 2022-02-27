const _ = require('lodash')

deck = [
    {
        rank:{
            code: 'A',
            value: 'ACE'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: '2',
            value: '2'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: '3',
            value: '3'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: '4',
            value: '4'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: '5',
            value: '5'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: '6',
            value: '6'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: '7',
            value: '7'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: '8',
            value: '8'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: '9',
            value: '9'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: '0',
            value: '10'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: 'J',
            value: 'JACK'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: 'Q',
            value: 'QUEEN'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: 'K',
            value: 'KING'
        },
        suit:{
            code: 'S',
            name: 'SPADES'
        }
    },
    {
        rank:{
            code: 'A',
            value: 'ACE'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: '2',
            value: '2'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: '3',
            value: '3'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: '4',
            value: '4'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: '5',
            value: '5'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: '6',
            value: '6'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: '7',
            value: '7'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: '8',
            value: '8'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: '9',
            value: '9'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: '0',
            value: '10'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: 'J',
            value: 'JACK'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: 'Q',
            value: 'QUEEN'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: 'K',
            value: 'KING'
        },
        suit:{
            code: 'D',
            name: 'DIAMONDS'
        }
    },
    {
        rank:{
            code: 'K',
            value: 'KING'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: 'Q',
            value: 'QUEEN'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: 'J',
            value: 'JACK'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: '0',
            value: '10'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: '9',
            value: '9'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: '8',
            value: '8'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: '7',
            value: '7'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: '6',
            value: '6'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: '5',
            value: '5'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: '4',
            value: '4'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: '3',
            value: '3'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: '2',
            value: '2'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: 'A',
            value: 'ACE'
        },
        suit:{
            code: 'C',
            name: 'CLUBS'
        }
    },
    {
        rank:{
            code: 'K',
            value: 'KING'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: 'Q',
            value: 'QUEEN'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: 'J',
            value: 'JACK'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: '0',
            value: '10'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: '9',
            value: '9'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: '8',
            value: '8'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: '7',
            value: '7'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: '6',
            value: '6'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: '5',
            value: '5'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: '4',
            value: '4'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: '3',
            value: '3'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: '2',
            value: '2'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    },
    {
        rank:{
            code: 'A',
            value: 'ACE'
        },
        suit:{
            code: 'H',
            name: 'HEARTS'
        }
    }
]

module.exports = {
    fresh: _.cloneDeep(deck),
    shuffled: _.shuffle(deck),
}