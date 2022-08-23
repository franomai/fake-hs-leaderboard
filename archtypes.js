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
                decks: ['QnnrLgpQzROWVnfn7Ydtke', 'FlO8QJGairXn75hW0a62ud', 'cOOQrCYQI7XXpkqSRrqpad']
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
                decks: ['sXRRU05iT1Te9zVAvRX84e', '0abHQpFVFuVIWPYPVrsRBh', 'KmkEgZ44yriwbWELSnaYCg']
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
                decks: ['5pf9s6Dphvhs253hVz352', 'zygQqKb23yyTecGIeHpt2b', 'OLDsIBjtQslLReLdVEF3jc']
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
                decks: ['z4mN1lxHI9piTvSheJ0I3', '2xDrz4wTZKpae1Onejc6o', 'X819Eec3JNAB13gdi9TTFe']
            },
            'celestial': {
                total: 4.21,
                archtypeId: 440,
                decks: ['Q2WQIVGSFUCg4XIa7Gp6bf', 'uP6tuxWv6KK8YGpC8ypgpe', 'PBNgvRuQ7BL8MscGK0AUqe'] // These are mistagged in HSReplay
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
                decks: ['8QmzhsWm9dn7PjcOf5ZNjg', 'VkyagHYiDkTWyLSHjxT6Ch', '2vcnERf8TuDafdmd4IPneg']
            },
            'quest': {
                total: 3.43,
                archtypeId: 211,
                decks: ['7XunRKznD77UurNZja8jch', 'aJ0NbKEl3R6cDxnbuSvvM', '43pNNd6eFax6tmRz1aUDj']
            },
            'beast': {
                total: 1.96,
                archtypeId: 170,
                decks: ['A9ykecsU0SArMHbAaaF95f', 'k94MJa5Xulb8UIz55twIFd', 'rUdvykTLIyphzRJ9yfadFb']
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
                decks: ['LXpD4JV5GfYdE9gqMwJ5l', 'WSpRDXl79mwRc1RZm8HxBb', 'unFj1dXA01NW5mjkTdR9ac']
            },
            'thief': {
                total: 3.62,
                archtypeId: 276,
                decks: ['emfnQBQrEJ4fcRJReMz0rf', '24Ax8S4tFdYod8KAkt6hoe', 'MdBJIL9hKpSzAfZOGvS8Yc']
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
                decks: ['5vRnMKn3gsCxw3Jifq4nFh', 'gSGUr6gme26WUdfJsgunYd', 'JXkci3go1MiQ3kioeWvkde']
            },
            'quest': {
                total: 2.16,
                archtypeId: 56,
                decks: ['GPZ89Cx6roX2YoW4pjXL4c', 'BMj6qAwjFe14nxLqenwZmh', '8pFMzH5gC3jdFzlz21en8d']
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
                decks: ['FBv7sS4iuJFwY4BEnuubef', 'wPGkN2KmcLVk38NjhBGlrg', 'Ris3cwzefT5ksnoVUhIAY']
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
