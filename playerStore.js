import { getRandomArchtype, getUnusedArchtype } from './archtypes.js';
import { getRandomElement, getRandomInt } from './util.js';

export class PlayerStore {

    static PLAYER_TYPES = {
        'ONE_TRICK': {minDecks: 1, maxDecks: 1},
        'ROULETTE': {minDecks: 4, maxDecks: 6},
        'LOSS_SWAP': {minDecks: 3, maxDecks: 6},
        'TIME_SWAP': {minDecks: 3, maxDecks: 5},
    };

    constructor(replayUserPercentage) {
        // In memory store for players we have already seen
        // This allows us to simulate some trends between leaderboard update evocations
        this.accounts = {};

        // Represents how many people we should have complete data for
        // Take this in from the construct for ease of re-use
        this.replayUserPercentage = replayUserPercentage;
    }

    updateStore(leaderboard) {
        this.#refreshStore();
        leaderboard.rows.forEach(player => this.#processPlayer(player));
        this.#updatePlayerDecks();
    }

    getCurrentLeaderBoard() {
      const leaderboardPlayers = [];
      for (let account of Object.values(this.accounts)) {
          for (let player of account) {
              if (player.currentRank) {
                leaderboardPlayers.push({
                  name: player.accountName,
                  id: player.accountId,
                  rank: player.currentRank,
                  rankChange: player.rankChange,
                });
              }
          }
      }

      return leaderboardPlayers.sort((a, b) => a.rank - b.rank);
    }

    #updatePlayerDecks() {
        for (let account of Object.values(this.accounts)) {
            for (let player of account) {
                if (player.matched) {
                    const info = player.playerTypeInfo;
                    console.log(player);
                    switch (player.playerType) {
                        case 'ONE_TRICK':
                            // Do nothing, their deck will not change
                            break;
                        case 'ROULETTE':
                            player.currentDeck = (player.currentDeck + 1) % player.decks.length;
                            break;
                        case 'LOSS_SWAP':
                            if (player.rankChange < 0) {
                                info.currentLosses++;
                                if (info.currentLosses > info.maxLosses) {
                                    // Reroll max losses
                                    info.maxLosses = getRandomInt(3, 5);
                                    // Reset current losses
                                    info.currentLosses = 0;
                                    // Bump current deck
                                    player.currentDeck = player.currentDeck + 1 % player.decks.length;
                                }
                            } else {
                                info.currentLosses = 0;
                            }
                            break;
                        case 'LOSS_SWAP':
                            info.currentDuration++;
                            if (info.currentDuration > info.maxDuration) {
                                // Reroll max duration
                                info.maxDuration = getRandomInt(5, 7);
                                // Reset current duration
                                info.currentDuration = 0;
                                // Bump current deck
                                player.currentDeck = player.currentDeck + 1 % player.decks.length;
                            }
                            break;
                    }
                }
            }
        }
    }

    #refreshStore() {
        for (let account of Object.values(this.accounts)) {
            for (let player of account) {
                player.lastRank = player.currentRank;
                player.currentRank = null;
                player.rankChange = null;
                player.matched = false;
            }
        }
    }

    #processPlayer(player) {
        const {accountid, rank} = player;
        let storePlayer;
        // First, check if this player NAME is in our store
        if (!this.accounts[accountid]) {
            // Add an instance of this account to the store
            storePlayer = this.#createNewPlayer(accountid, 0, rank);
            this.accounts[accountid] = [storePlayer];
        } else {
            // Is this person actually one of the ones on our list?
            storePlayer = this.accounts[accountid]
                .filter(player => !player.matched && Math.abs((player.lastRank || rank) - rank) <= 25 ) // If the gap is bigger than 25 its probs not the same person
                .sort((p1, p2) => Math.abs(p1.lastRank - p2.lastRank))[0];
            if (storePlayer) {
                storePlayer.matched = true;
            } else {
                // This person is new, attach them to the end of the current collection
                storePlayer = this.#createNewPlayer(accountid, 0, rank);
                this.accounts[accountid].push(storePlayer);
            }
        }

        storePlayer.currentRank = rank;
        storePlayer.rankChange = storePlayer.lastRank ? storePlayer.lastRank - storePlayer.currentRank : null;
    }

    #getDeckCollection(size, allowUnknowns) {
        const decks = [];
        for (let i = 0 ; i < size; i++) {
            const newDeck = getUnusedArchtype(decks, allowUnknowns);
            decks.push(newDeck);
        }
        return decks;
    }

    #createNewPlayer(name, maxId, rank) {
        const isUsingHSReplay = Math.random() <= this.replayUserPercentage;
        const playerType = getRandomElement(Object.keys(PlayerStore.PLAYER_TYPES));
        const numDecks = getRandomInt(PlayerStore.PLAYER_TYPES[playerType].minDecks, PlayerStore.PLAYER_TYPES[playerType].maxDecks);
        const decks = this.#getDeckCollection(numDecks, !isUsingHSReplay) ;

        let playerTypeInfo;
        switch (playerType) {
            case 'ONE_TRICK':
            case 'ROULETTE':
                playerTypeInfo = {};
                break;
            case 'LOSS_SWAP':
                playerTypeInfo = {currentLosses: 0, maxLosses: getRandomInt(3, 5)};
                break;
            case 'TIME_SWAP':
                playerTypeInfo = {currentDuration: 0, maxDuration: getRandomInt(5, 7)};
                break;
        }

        return {
            accountName: name,
            accountId: maxId + 1,
            lastRank: null,
            currentRank: rank,
            playerType: playerType,
            playerTypeInfo: playerTypeInfo,
            currentDeck: 0,
            decks: decks,
            replayUser: isUsingHSReplay,
            matched: true
        }
    }

}
