const cardOrder = [
    'ACE','2','3','4','5','6','7','8','9','10','JACK','QUEEN','KING'
]

const calculateHand = hand => {
    if(isRoyalFlush(hand)) return 'Royal Flush'
    if(isStraightFlush(hand)) return 'Straight Flush'
    if(isFourOfAKind(hand)) return 'Four of a Kind'
    if(isFullHouse(hand)) return 'Full House'    
    if(isFlush(hand)) return 'Flush'
    if(isStraight(hand)) return 'Straight'
    if(isThreeOfAKind(hand)) return 'Three of a Kind'
    if(isTwoPair(hand)) return 'Two Pair'
    if(isOnePair(hand)) return 'One Pair'
    return `High Card - ${getHighCard(hand)}`
}

const isRoyalFlush = hand => {
    return isRoyal(hand) && isFlush(hand)
}

const isStraightFlush = hand => {
    return isFlush(hand) && isStraight(hand)
}

const isFourOfAKind = hand => {
    return Object.values(getRankTally(hand)).includes(4)
}

const isFullHouse = hand => {
    const valueCounts = Object.values(getRankTally(hand))
    return valueCounts.length === 2
        && valueCounts.includes(3)
}

const isFlush = hand => {
    return hand.every(card => card.suit === hand[0].suit)
}

const isStraight = hand => {
    const cardPositions = hand.map(card => {
        return cardOrder.indexOf(card.value)
    })
    for(let i=0;i<=8;i++){
        const straightPositions = Array(5).fill(i).map((num,idx) => num+idx)
        if(cardPositions.every(position => straightPositions.includes(position)))
        {
            return true
        }
    }
    return false
}

const isThreeOfAKind = hand => {
    const valueCounts = Object.values(getRankTally(hand))
    return valueCounts.length === 3
        && valueCounts.includes(3)
}

const isTwoPair = hand => {
    const valueCounts = Object.values(getRankTally(hand))
    return valueCounts.length === 3
        && valueCounts.includes(2)
}

const isOnePair = hand => {
    return Object.values(getRankTally(hand)).length === 4
}

const getHighCard = hand => {
    const cardPositions = hand.map(card => {
        return cardOrder.indexOf(card.value)
    })
    return (cardPositions.includes(0)) 
                ? cardOrder[0] 
                : cardOrder[Math.max(...cardPositions)]
}

const isRoyal = hand => {
    const royalPositions = [0, 9, 10, 11, 12] //A, 10, J, Q, K
    return hand.map(card => {
        return cardOrder.indexOf(card.value)
    })
    .every(position => royalPositions.includes(position))
}

const getRankTally = hand => {
    return hand.reduce((tally, card) => {
        if(!tally.hasOwnProperty(card.value)){
            tally[card.value] = 1
        } else {
            tally[card.value] += 1
        }
        return tally
    }, {})
}

module.exports.calculateHand = calculateHand