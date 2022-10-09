import moment from 'moment';

import { getRandomArchtype } from './archtypes.js';
import { getRandomInt } from './util.js';

export class EventGenerator {

  static GHOST_NAME = 'rezplz';

  constructor(playerStore) {
    this.players = playerStore;
  }

  generateEvents() {
    const movements = this.#getGameRelatedMovements();
    const events = this.#getEventsForMovements(movements.gains, movements.losses);
    return events;
  }

  #getEventsForMovements(winners, losers) {
    const events = [];

    let currentWinIndex = 0;
    let currentLossIndex = 0;
    let winner = winners[currentWinIndex];
    let loser = losers[currentLossIndex];
    let ghostCount = 1;

    while (winner || loser) {
      const event = this.#generateGameEvent(winner, loser, ghostCount);
      if (event) {
        events.push(event);
        // Don't need to burn this ghost user if we didn't register a game
        if (!this.#isCompleteEvent(winner, loser)) {
          ghostCount++;
        }
      }

      winner = winners[++currentWinIndex];
      loser = losers[++currentLossIndex];
    }

    return events;
  }


  #generateGameEvent(winner, loser, ghostCount) {
    if (!this.#isCompleteEvent(winner, loser)) {
      // Generate a dummy user to pump in instead
      const ghost = {
        accountName: EventGenerator.GHOST_NAME,
        accountId: ghostCount,
        lastRank: 200 + ghostCount,
        currentDeck: 0,
        decks: [getRandomArchtype()],
        replayUser: false,
        streamInfo: null
      }
      winner ? loser = ghost : winner = ghost;
    }

    if (!this.#shouldRecordEvent(winner, loser)) {
      return null;
    }

    // pick a random time to have this game start at
    const end = this.players.lastUpdated;
    const start = this.players.previousLastUpdated || end.clone().subtract(5, 'minutes');
    const maxDifference = end.diff(start, 'seconds');
    const gameTime = end.clone().subtract(getRandomInt(1, maxDifference) + (5 * 60), 'seconds');

    return {
      matchStartTimestamp: gameTime,
      region: this.players.region,
      player1Info: this.#generateEventPlayer(winner),
      player2Info: this.#generateEventPlayer(loser),
      winner: 'PLAYER1'
    };
  }

  #generateEventPlayer(player) {
    const deckInfo = player.decks[player.currentDeck];
    const vod = player.streamInfo ? player.streamInfo.vods[player.streamInfo.nextVod] : null;
    if (vod) {
      player.streamInfo.nextVod = (player.streamInfo.nextVod + 1) % player.streamInfo.vods.length;
    }
    return {
      user: {
        name: player.accountName,
        id: (player.accountId + '').padStart(4, '0'),
        streamLinks: player.streamInfo ? [{
          platform: 'twitch',
          url: `https://www.twitch.tv/${player.streamInfo.channel}`
        }] : null
      },
      rank: player.lastRank,
      deck: {
        deckArchetype: {
          deckClass: {
            deckClassName: deckInfo.class,
            hsreplayId: deckInfo.classId,
          },
          deckArchetypeName: deckInfo.name,
          hsreplayId: deckInfo.archtypeId,
        },
        hsreplayId: player.replayUser ? deckInfo.deckList.hsReplayId : null,
        deckCardsId: player.replayUser ? deckInfo.deckList.deckString : null
      },
      usedHsReplay: player.replayUser,
      vod: vod ? {
        platform: 'twitch',
        url: `https://www.twitch.tv/videos/${vod}`
      } : null
    };
  }


  #isCompleteEvent(winner, loser) {
    return winner && loser;
  }

  #shouldRecordEvent(winner, loser) {
    return winner.replayUser || loser.replayUser;
  }

  #getGameRelatedMovements() {
    const movements = {
      gains: [], // 💪
      losses: []
    };
    for (let account of Object.values(this.players.accounts)) {
      for (let player of account) {
          if (this.#isGameRelatedMovement(player.currentRank, player.rankChange)) {
            if (player.rankChange > 0) {
              movements.gains.push(player);
            } else if (player.rankChange < 0) {
              movements.losses.push(player);
            }
          }
      }
    }

    return movements;
  }

  #isGameRelatedMovement(rank, rankDiff) {
    if (rank === null || rankDiff === null) return false;
    const movement = Math.abs(rankDiff);
    return (movement >= 5) // Any 5 or more change sub 20 is a game - decay is usually only 1-2
      || (rank < 20  && movement >= 2) // At ranks 20 - 5 it's usually a bit trickier with some games not resulting in large moves
      || (rank < 5 && rankDiff > 0); // At rank 5 plus it's nigh impossible but we will assume a positive movement is a win
  }
}
