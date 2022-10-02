import { getCurrentLeaderBoard } from './leaderboard.js';
import { getRandomArchtype } from './archtypes.js';
import { PlayerStore } from './playerStore.js';
import { EventGenerator } from './eventGenerator.js';

import redis from 'redis'
import dotenv from 'dotenv'

import fs from 'fs';

const LEADERBOARD_UPDATE_RATE = 1000 * 60 * 5;
const regions = ['US', 'EU', 'AP'];
const REPLAY_USER_PERCENTAGE = 0.7;
const STREAMER_PERCENTAGE = 1;
const stores = {};
for (let region of regions) {
  stores[region] = new PlayerStore(region, REPLAY_USER_PERCENTAGE, STREAMER_PERCENTAGE);
}
const publisher = redis.createClient();

async function runLeaderBoardUpdate(region) {
  console.log(`Running leaderboard update for ${region}, one sec...`);
  const result = await getCurrentLeaderBoard(region);
  const playerStore = stores[region];
  playerStore.updateStore(result);

  const enhancedLeaderboard = playerStore.getCurrentLeaderBoard();
  const generator = new EventGenerator(playerStore)
  const events = generator.generateEvents();
  console.log(events);

  /*
  // You can uncomment this if you want to see what the raw data looks like before the message is published
  const now = Math.floor(Date.now() / 1000);
  fs.writeFileSync('./accounts' + now + '.json', JSON.stringify(playerStore.accounts));
  fs.writeFileSync('./events_' + now + '.json', JSON.stringify(events));
  */

  await publisher.publish('leaderboardEvent', JSON.stringify({
    leaderboard: {
      region: region,
      timestamp: result.timestamp,
      ranks: enhancedLeaderboard
    },
    events: { events: events }
  }));

  console.log(`${region} all done!~`);
}

(async () => {
  await publisher.connect();
  regions.forEach(region => {
    runLeaderBoardUpdate(region);
    setInterval(runLeaderBoardUpdate, LEADERBOARD_UPDATE_RATE, region);
  });
})();
