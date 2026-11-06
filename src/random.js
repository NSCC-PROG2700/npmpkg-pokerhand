//all of the package's randomness goes through this module, so a seed can make results repeatable

//turn a number or string seed into a 32-bit integer (FNV-1a hash of its text)
const hashSeed = seed => {
    const text = String(seed)
    let hash = 2166136261
    for (let i = 0; i < text.length; i++) {
        hash = Math.imul(hash ^ text.charCodeAt(i), 16777619)
    }
    return hash >>> 0
}

//mulberry32: a small, fast seeded generator of numbers in [0, 1)
const seededRandom = seed => {
    let state = hashSeed(seed)
    return () => {
        state = (state + 0x6D2B79F5) | 0
        let t = Math.imul(state ^ (state >>> 15), 1 | state)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

let random = Math.random

//run fn using a generator seeded with `seed`, then go back to Math.random.
//with no seed, fn just uses Math.random
const withSeed = (seed, fn) => {
    if (seed === undefined) return fn()
    if (typeof seed !== 'number' && typeof seed !== 'string') {
        throw new TypeError(`seed must be a number or a string, got ${seed === null ? 'null' : typeof seed}`)
    }
    const previous = random
    random = seededRandom(seed)
    try {
        return fn()
    } finally {
        random = previous
    }
}

const randomIndex = length => Math.floor(random() * length)

//a shuffled copy (Fisher-Yates)
const shuffle = items => {
    const copy = [...items]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = randomIndex(i + 1)
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

//one random item
const sample = items => items[randomIndex(items.length)]

//`size` different random items
const sampleSize = (items, size) => shuffle(items).slice(0, size)

module.exports = { withSeed, shuffle, sample, sampleSize }
