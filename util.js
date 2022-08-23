function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectWeightedValue(totalweight, items, weightKey) {
    const selectedDist = Math.random() * totalweight;
    let rollingDist = 0;
    for (const key in items) {
        rollingDist += weightKey ? items[key][weightKey] : items[key];
        if (rollingDist > selectedDist) {
            return key;
        }
    }
}

export { getRandomElement, getRandomInt, selectWeightedValue }
