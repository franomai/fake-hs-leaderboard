import { getCurrentLeaderBoard } from './leaderboard.js';
import { getRandomArchtype } from './archtypes.js';
import { PlayerStore } from './playerStore.js';

import redis from 'redis'
import dotenv from 'dotenv'

import fs from 'fs';

const LEADERBOARD_UPDATE_RATE = 1000 * 60 * 5;
const GHOST_NAME = 'rezplz';
const playerStore = new PlayerStore(0.7);
const publisher = redis.createClient();

function isGameRelatedMovement(rank, rankDiff) {
  if (rank === null || rankDiff === null) return false;
  const movement = Math.abs(rankDiff);
  return (movement >= 4) // Any 4 or more change sub 20 is a game - decay is usually only 1-2
    || (rank < 20  && movement >= 2) // At ranks 20 - 5 it's usually a bit trickier with some games not resulting in large moves
    || (rank < 5 && rankDiff > 0); // At rank 5 plus it's nigh impossible but we will assume a positive movement is a win
}


async function runLeaderBoardUpdate() {
  console.log('Running leaderboard update, one sec...');
  const result = await getCurrentLeaderBoard();
  playerStore.updateStore(result);

  const enhancedLeaderboard = playerStore.getCurrentLeaderBoard();
  const events = generateEvents(playerStore.accounts);

  /*
  // You can uncomment this if you want to see what the raw data looks like before the message is published
  const now = Math.floor(Date.now() / 1000);
  fs.writeFileSync('./accounts' + now + '.json', JSON.stringify(playerStore.accounts));
  fs.writeFileSync('./events_' + now + '.json', JSON.stringify(events));
  */

  await publisher.connect();

  await publisher.publish('leaderboardEvent', JSON.stringify({ leaderboard: enhancedLeaderboard, events: events }));

  console.log('All done!~');
}

runLeaderBoardUpdate();
setInterval(runLeaderBoardUpdate, LEADERBOARD_UPDATE_RATE);

function generateEvents(players) {
  const rankGain = [];
  const rankLoss = [];
  const events = [];

  for (let account of Object.values(players)) {
    for (let player of account) {
        if (isGameRelatedMovement(player.currentRank, player.rankChange)) {
          if (player.rankChange > 0) {
            rankGain.push(player);
          } else if (player.rankChange < 0) {
            rankLoss.push(player);
          }
        }
    }
  }

  let currGain = 0;
  let currLoss = 0;
  let winner = rankGain[currGain];
  let loser = rankLoss[currLoss];
  let ghostCount = 1;

  while (winner || loser) {
    const event = generateGameEvent(winner, loser, ghostCount);
    if (event) {
      events.push(event);
      // Don't need to burn this ghost user if we didn't register a game
      if (!isCompleteEvent(winner, loser)) {
        ghostCount++;
      }
    }

    winner = rankGain[++currGain];
    loser = rankLoss[++currLoss];
  }

  return events;
}

function isCompleteEvent(winner, loser) {
  return winner && loser;
}

function shouldRecordEvent(winner, loser) {
  return winner.replayUser || loser.replayUser;
}

function generateGameEvent(winner, loser, ghostCount) {
  if (!isCompleteEvent(winner, loser)) {
    // Generate a dummy user to pump in instead
    const ghost = {
      accountName: GHOST_NAME,
      accountId: ghostCount,
      lastRank: 200 + ghostCount,
      currentDeck: 0,
      decks: [getRandomArchtype()],
      replayUser: false
    }
    winner ? loser = ghost : winner = ghost;
  }

  if (!shouldRecordEvent(winner, loser)) {
    return null;
  }

  return {
    player1: generateEventPlayer(winner),
    player2: generateEventPlayer(loser),
    winner: 'PLAYER1'
  }

}

function generateEventPlayer(player) {
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
