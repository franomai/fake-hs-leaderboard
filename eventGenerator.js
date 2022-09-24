import { getRandomArchtype } from './archtypes.js';

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
        replayUser: false
      }
      winner ? loser = ghost : winner = ghost;
    }

    if (!this.#shouldRecordEvent(winner, loser)) {
      return null;
    }

    return {
      player1: this.#generateEventPlayer(winner),
      player2: this.#generateEventPlayer(loser),
      winner: 'PLAYER1'
    }

  }

  #generateEventPlayer(player) {
    const deckInfo = player.decks[player.currentDeck];
    return {
      name: player.accountName,
      id: player.accountId,
      rank: player.lastRank,
      replayUser: player.replayUser,
      deckInfo: {
        className: deckInfo.class,
        classId: deckInfo.classId,
        archtypeName: deckInfo.name,
        archtypeId: deckInfo.archtypeId,
        deckList: player.replayUser ? deckInfo.deckList : null
      }
    }
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
    for (let account of Object.values(this.players)) {
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
    return (movement >= 4) // Any 4 or more change sub 20 is a game - decay is usually only 1-2
      || (rank < 20  && movement >= 2) // At ranks 20 - 5 it's usually a bit trickier with some games not resulting in large moves
      || (rank < 5 && rankDiff > 0); // At rank 5 plus it's nigh impossible but we will assume a positive movement is a win
  }
}
