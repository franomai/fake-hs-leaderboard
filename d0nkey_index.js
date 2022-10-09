import { collectD0nkeyInfo } from './d0nkey.js';
import { getRandomArchtype } from './archtypes.js';
import { PlayerStore } from './playerStore.js';
import { EventGenerator } from './eventGenerator.js';

import redis from 'redis'
import dotenv from 'dotenv'

import fs from 'fs';

const regions = ['US']; //, 'EU', 'AP'];
const SEASON_ID = 107;
const REPLAY_USER_PERCENTAGE = 0.7;
const STREAMER_PERCENTAGE = 1;
const stores = {};
for (let region of regions) {
  stores[region] = new PlayerStore(region, REPLAY_USER_PERCENTAGE, STREAMER_PERCENTAGE);
}
const publisher = redis.createClient();

async function runLeaderBoardUpdate(region) {
  console.log(`Running leaderboard update for ${region}, one sec...`);
  const results = await collectD0nkeyInfo(region, SEASON_ID);
  const playerStore = stores[region];
  for (const result of results) {
    playerStore.updateStore(result);
    const enhancedLeaderboard = playerStore.getCurrentLeaderBoard();
    const generator = new EventGenerator(playerStore)
    const events = generator.generateEvents();
    console.log(events);

    await publisher.publish('leaderboardEvent', JSON.stringify({
      leaderboard: {
        region: region,
        timestamp: result.timestamp,
        ranks: enhancedLeaderboard
      },
      events: { events: events }
    }));
  }

  console.log(`${region} all done!~`);
}

(async () => {
  await publisher.connect();
  regions.forEach(region => {
    runLeaderBoardUpdate(region);
  });
})();
