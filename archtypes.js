import { selectWeightedValue, getRandomElement } from './util.js';

const distribution =
{
    'warlock': {
        total: 17.3,
        classId: 9,
        archtypes: {
            'imp': {
                total: 13.66,
                archtypeId: 546,
                decks: [
                  {
                    hsReplayId: 'QnnrLgpQzROWVnfn7Ydtke',
                    deckString: 'AAECAf0GAseyBJvkBA707QP9+gP/+gOB+wPFgASpkQSEoATmoAT50wT60wT/2QSA2gSB2gSr6gQA'
                  },
                  {
                    hsReplayId: 'FlO8QJGairXn75hW0a62ud',
                    deckString: 'AAECAf0GBrCRBI21BPXHBOnQBJvkBL7wBAz9+gP/+gPFgASEoATmoAT50wT60wT/2QSA2gSB2gTL4gSr6gQA'
                  },
                  {
                    hsReplayId: 'cOOQrCYQI7XXpkqSRrqpad',
                    deckString: 'AAECAf0GAo21BJvkBA7X7QP07QP9+gP/+gPFgASEoATmoAT50wT60wSi1AT/2QSA2gSB2gSr6gQA'
                  }
                ]
            }
        }
    },
    'mage': {
        total: 17.2,
        classId: 4,
        archtypes: {
            'spooky': {
                total: 16.00,
                archtypeId: 547,
                decks: [
                  {
                    hsReplayId: 'sXRRU05iT1Te9zVAvRX84e',
                    deckString: 'AAECAf0EDNjsA53uA6CKBJiNBOWwBOnQBJjUBLjZBKneBLrkBJfvBL7wBA7U6gPS7APT7APW7AOTgQSfkgShkgT8ngT7ogTx0wTK3gTb3gT67ASEkwUA'
                  },
                  {
                    hsReplayId: '0abHQpFVFuVIWPYPVrsRBh',
                    deckString: 'AAECAf0ECNjsA53uA6CKBOWwBJjUBLjZBLrkBJfvBBDU6gPS7APT7APW7AOSgQSTgQSogQSfkgShkgT8ngT7ogTx0wTK3gTb3gT67ASEkwUA'
                  },
                  {
                    hsReplayId: 'KmkEgZ44yriwbWELSnaYCg',
                    deckString: 'AAECAf0EBtjsA53uA6CKBJjUBKneBLrkBAzU6gPS7APT7APW7AOogQSfkgShkgT8ngTb3gT67ASCkwWEkwUA'
                  }
                ]
            }
        }
    },
    'shaman': {
        total: 16.5,
        classId: 8,
        archtypes: {
            'control': {
                total: 15.95,
                archtypeId: 192,
                decks: [
                  {
                    hsReplayId: '5pf9s6Dphvhs253hVz352',
                    deckString: 'AAECAaoIDKjuA6bvA4b6A6SBBMORBOm2BOnQBJjUBLjZBJfvBL7wBL/wBA7j7gPG+QPTgAS5kQSVkgTVsgTgtQSywQTFzgTGzgS12QS22QTg7QS88AQA'
                  },
                  {
                    hsReplayId: 'zygQqKb23yyTecGIeHpt2b',
                    deckString: 'AAECAaoIDKjuA6bvA4b6A6SBBMORBMeyBOm2BOnQBJjUBLjZBJfvBL7wBA7j7gPG+QPTgAS5kQSVkgTVsgTgtQSywQTFzgTGzgS12QS22QTg7QS88AQA'
                  },
                  {
                    hsReplayId: 'OLDsIBjtQslLReLdVEF3jc',
                    deckString: 'AAECAaoIDKjuA6bvA4b6A6SBBMORBI21BOm2BOnQBJjUBLjZBJfvBL7wBA7j7gPG+QPTgAS5kQSVkgTVsgTgtQSywQTFzgTGzgS12QS22QTg7QS88AQA'
                  }
                ]
            }
        }
    },
    'druid': {
        total: 15.6,
        classId: 2,
        archtypes: {
            'ramp': {
                total: 10.76,
                archtypeId: 512,
                decks: [
                  {
                    hsReplayId: 'z4mN1lxHI9piTvSheJ0I3',
                    deckString: 'AAECAZICBomLBOnQBJjUBO/eBJfvBNqhBRGsgASvgASwgASJnwSunwTanwSwpQTPrAT2vQT/vQTwvwSuwASB1ASy3QTW3gTB3wTg7QQA'
                  },
                  {
                    hsReplayId: '2xDrz4wTZKpae1Onejc6o',
                    deckString: 'AAECAZICCsn1A4mLBPGkBKWtBI21BOnQBJjUBLjZBO/eBJfvBA+sgASvgASwgASJnwSunwTanwTPrASNsgT/vQTwvwSuwATW3gTB3wTg7QTaoQUA'
                  },
                  {
                    hsReplayId: 'X819Eec3JNAB13gdi9TTFe',
                    deckString: 'AAECAZICBomLBKWtBOnQBJjUBO/eBJfvBBGB9wOvgASwgASJnwSunwTanwTPrASNsgT2vQT/vQTwvwSuwASozgSB1ATW3gTB3wTaoQUA'
                  }
                ]
            },
            'celestial': {
                total: 4.21,
                archtypeId: 440,
                decks: [
                  {
                    hsReplayId: 'Q2WQIVGSFUCg4XIa7Gp6bf',
                    deckString: 'AAECAZICDOTuA7CKBLWKBImLBKWtBISwBI21BL/OBOnQBJjUBO/eBJfvBA7A7AOsgASvgASwgASJnwSunwTanwTPrAT/vQSuwAT63QTB3wTg7QTaoQUA'
                  },
                  {
                    hsReplayId: 'uP6tuxWv6KK8YGpC8ypgpe',
                    deckString: 'AAECAZICDOTuA7CKBLWKBImLBKWNBO+kBKWtBISwBOnQBO/eBODtBJfvBA7A7APG+QOvgASwgASJnwSunwTanwTPrASNtQT/vQSuwATW3gTB3wTaoQUA'
                  },
                  {
                    hsReplayId: 'PBNgvRuQ7BL8MscGK0AUqe',
                    deckString: 'AAECAZICDuTuA6yABLCKBLWKBImLBKWNBO+kBKWtBISwBMeyBI21BOnQBO/eBJfvBA3A7APG+QOvgASwgASJnwSunwTanwTPrAT/vQSuwATW3gTB3wTaoQUA'
                  }
                ] // These are mistagged in HSReplay
            }
        }
    },
    'hunter': {
        total: 14.3,
        classId: 3,
        archtypes: {
            'face': {
                total: 8.85,
                archtypeId: 355,
                decks: [
                  {
                    hsReplayId: '8QmzhsWm9dn7PjcOf5ZNjg',
                    deckString: 'AAECAR8E5e8DhskE0+QE+ZIFDff4A8X7A8OABLugBOGkBJ2wBIiyBOG1BIHJBL/TBMzkBNDkBNTkBAA='
                  },
                  {
                    hsReplayId: 'VkyagHYiDkTWyLSHjxT6Ch',
                    deckString: 'AAECAR8C5e8D0+QEDvf4A8X7A8OABLugBOGkBJ2wBIiyBOG1BIHJBL/TBMzkBNDkBNTkBPmSBQA='
                  },
                  {
                    hsReplayId: '2vcnERf8TuDafdmd4IPneg',
                    deckString: 'AAECAR8G5e8D25EE4bUE57kEvuME0+QEDNvtA8OABIiyBL/TBMviBLjjBMHjBMzkBNDkBNTkBLzwBI6kBQA='
                  }
                ]
            },
            'quest': {
                total: 3.43,
                archtypeId: 211,
                decks: [
                  {
                    hsReplayId: '7XunRKznD77UurNZja8jch',
                    deckString: 'AAECAR8E5e8D/fgD25EEl+8EEtzqA9vtA/f4A6iBBKmNBKuNBKmfBKqfBOOfBOSfBLugBL+sBJmtBJ2wBMHTBIzUBNDkBNTkBAA='
                  },
                  {
                    hsReplayId: 'aJ0NbKEl3R6cDxnbuSvvM',
                    deckString: 'AAECAR8E5e8D/fgDhskEl+8EEtzqA9vtA/f4A6iBBKmNBKuNBKmfBKqfBOOfBOSfBLugBL+sBJmtBJ2wBITJBMDTBMHTBIzUBAA='
                  },
                  {
                    hsReplayId: '43pNNd6eFax6tmRz1aUDj',
                    deckString: 'AAECAR8G5e8D/fgD25EE5J8E0+QEl+8EEdzqA9vtA/f4A6iBBKmNBKuNBKmfBKqfBOOfBLugBL+sBJmtBJ2wBMHTBIzUBNDkBNTkBAA='
                  }
                ]
            },
            'beast': {
                total: 1.96,
                archtypeId: 170,
                decks: [
                  {
                    hsReplayId: 'A9ykecsU0SArMHbAaaF95f',
                    deckString: 'AAECAR8M++gDyvsD25EE4Z8E2qMEx7IEwLkE57kE6dAEvuME0+QEl+8EDurpA/T2A8OABOWkBMCsBIPIBL/TBLjjBMHjBMzkBNDkBNLkBNTkBODtBAA='
                  },
                  {
                    hsReplayId: 'k94MJa5Xulb8UIz55twIFd',
                    deckString: 'AAECAR8M5e8DyvsDqIoE25EEx7IEwLkE57kE6dAEvuME0+QEl+8EvPAEDsX7A8OABKmfBOGkBOWkBMCsBIiyBIPIBL/TBLjjBMHjBNDkBNTkBODtBAA='
                  },
                  {
                    hsReplayId: 'rUdvykTLIyphzRJ9yfadFb',
                    deckString: 'AAECAR8I++gD5e8D25EE4Z8EwLkE57kEvuMEl+8EEMX7A8OABKmfBLugBOWkBMCsBIiyBOG1BIPIBL/TBLjjBMHjBMzkBNDkBNLkBNTkBAA='
                  }
                ]
            },
        }
    },
    'rogue': {
        total: 9.9,
        classId: 7,
        archtypes: {
            'miracle': {
                total: 3.95,
                archtypeId: 25,
                decks: [
                  {
                    hsReplayId: 'LXpD4JV5GfYdE9gqMwJ5l',
                    deckString: 'AAECAaIHBKH5A+2ABJGfBPbdBA2q6wOu6wP+7gOh9AO9gAT2nwT3nwT7pQT5rAS3swT03QT13QTBgwUA'
                  },
                  {
                    hsReplayId: 'WSpRDXl79mwRc1RZm8HxBb',
                    deckString: 'AAECAaIHBKH5A+2ABNi2BPbdBA2q6wP+7gOh9AO9gASRnwT2nwT3nwT7pQT5rAS3swT03QT13QTBgwUA'
                  },
                  {
                    hsReplayId: 'unFj1dXA01NW5mjkTdR9ac',
                    deckString: 'AAECAaIHBKH0A6H5A+2ABPbdBA2q6wP+7gO9gASRnwSUnwT2nwT3nwT7pQT5rAS3swT03QT13QTBgwUA'
                  }
                ]
            },
            'thief': {
                total: 3.62,
                archtypeId: 276,
                decks: [
                  {
                    hsReplayId: 'emfnQBQrEJ4fcRJReMz0rf',
                    deckString: 'AAECAaIHCqH5A+2ABPuKBJafBNi2BNu5BLjZBPXdBJfvBIukBQ+q6wP+7gOh9AO9gAS+gAT2nwT3nwTuoAS6pAT7pQTspwT5rAS3swTVtgT58QQA'
                  },
                  {
                    hsReplayId: '24Ax8S4tFdYod8KAkt6hoe',
                    deckString: 'AAECAaIHBqH0A6H5A/uKBNi2BNu5BIukBQyq6wP+7gO9gAT3nwS6pAT7pQTspwT5rAS3swSZtgTVtgT58QQA'
                  },
                  {
                    hsReplayId: 'MdBJIL9hKpSzAfZOGvS8Yc',
                    deckString: 'AAECAaIHBqH5A/uKBJm2BNi2BNu5BIukBQyq6wP+7gO9gAT3nwS6pAT7pQTspwT5rAS3swTVtgT13QT58QQA'
                  }
                ]
            },
        }
    },
    'priest': {
        total: 5.7,
        classId: 6,
        archtypes: {
            'naga': {
                total: 2.22,
                archtypeId: 530,
                decks: [
                  {
                    hsReplayId: '5vRnMKn3gsCxw3Jifq4nFh',
                    deckString: 'AAECAa0GBvvoA4f3A4ujBImyBPPbBPrbBAytigSEowSJowTtsQSIsgSktgSntgSHtwSywQT10wT02wSGgwUA'
                  },
                  {
                    hsReplayId: 'gSGUr6gme26WUdfJsgunYd',
                    deckString: 'AAECAa0GBPvoA4f3A4myBPrbBA2tigSEowSJowTtsQSIsgSktgSntgSHtwSWtwSywQT10wT02wSGgwUA'
                  },
                  {
                    hsReplayId: 'JXkci3go1MiQ3kioeWvkde',
                    deckString: 'AAECAa0GAomyBJbUBA6H9wOtigSEowSJowTtsQSEsgSIsgSktgSltgSntgSHtwSWtwSywQT10wQA'
                  }
                ]
            },
            'quest': {
                total: 2.16,
                archtypeId: 56,
                decks: [
                  {
                    hsReplayId: 'GPZ89Cx6roX2YoW4pjXL4c',
                    deckString: 'AAECAa0GCtTtA6bvA932A4yBBOiLBPCfBOWwBKi2BLjZBJfvBA+W6AOZ6wOa6wOe6wOH9wOtigSIowSKowTUrAShtgT52wS63ASS3wSGgwWGpAUA'
                  },
                  {
                    hsReplayId: 'BMj6qAwjFe14nxLqenwZmh',
                    deckString: 'AAECAa0GDNTtA6bvA932A4f3A9D5A4yBBOiLBPCfBOWwBKi2BLjZBJfvBA6W6AOZ6wOa6wOe6wOtigSIowSKowTUrAShtgT52wS63ASS3wSGgwWGpAUA'
                  },
                  {
                    hsReplayId: '8pFMzH5gC3jdFzlz21en8d',
                    deckString: 'AAECAa0GDtTtA6bvA932A8P5A4yBBKiKBOiLBPCfBIWjBMeyBKi2BLjZBLrcBJfvBA2Z6wOa6wOb6wOe6wOH9wOtigSIowSKowTUrAShtgSS3wSGgwWGpAUA'
                  }
                ]
            },
        }
    },
    'demon hunter': {
        total: 1.8,
        classId: 14,
        archtypes: {}
    },
    'paladin': {
        total: 1.2,
        classId: 5,
        archtypes: {}
    },
    'warrior': {
        total: 0.5,
        classId: 10,
        archtypes: {
            'concede': {
                total: 0.5,
                archtypeId: 161, // :v)
                decks: [
                  {
                    hsReplayId: 'FBv7sS4iuJFwY4BEnuubef',
                    deckString: 'AAECAQcG++gDle0Dv4AEi6AEjaAEgdwEDI3tA5btA4ygBLysBJC3BJzUBLzbBP/bBL7iBKXkBImDBZikBQA='
                  },
                  {
                    hsReplayId: 'wPGkN2KmcLVk38NjhBGlrg',
                    deckString: 'AAECAQcGle0Di6AEj9QEgdwEiN8EmKQFDI3tA5btA9XxA4ygBI2gBJzUBLzbBP/bBL7iBLbjBKXkBImDBQA='
                  },
                  {
                    hsReplayId: 'Ris3cwzefT5ksnoVUhIAY',
                    deckString: 'AAECAQcGle0Dqu4Dm4EEvIoEi6AEgdwEDI3tA5btA9XxA5X2A42gBJC3BJzUBLzbBP/bBL7iBI7jBImDBQA='
                  }
                ]
            }
        }
    },
};

function getClasses() { return Object.keys(distribution) }

function getRandomArchtype() {
    const className = selectWeightedValue(100, distribution, 'total');
    if (!className) return null; // Should never happen
    const classDistribution = distribution[className];
    const archtypeName = selectWeightedValue(classDistribution.total, classDistribution.archtypes, 'total');
    return {
      name: `${archtypeName || 'unknown'} ${className}`,
      archtypeId: archtypeName ? classDistribution.archtypes[archtypeName].archtypeId : null,
      class: className,
      classId: classDistribution.classId,
      deckList: archtypeName ? getRandomElement(classDistribution.archtypes[archtypeName].decks) : null
    };
}

function getUnusedArchtype(archtypesUsed, allowUnknowns) {
    // This is gross and icky but ensures a fair distro and is much faster to write
    const archtypeNames = archtypesUsed.map(archtype => archtype.name);
    while (true) {
        const newArchtype = getRandomArchtype();
        if (!(archtypeNames.includes(newArchtype.name) || (!allowUnknowns && newArchtype.name.startsWith('unknown')))) {
            return newArchtype;
        }
    }
}

export { getClasses, getRandomArchtype, getUnusedArchtype }
