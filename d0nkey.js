import axios from 'axios';
import moment from 'moment';
import { parse } from 'node-html-parser';
import pLimit from 'p-limit';

const limit = pLimit(4);

const RANK_POSITIONS = 200;

async function collectD0nkeyInfo(region, seasonId) {
  let counter = { processed: 0 };
  const fetches = new Array(RANK_POSITIONS);
  const ranks = new Array(RANK_POSITIONS);

  for (let i = 0; i < fetches.length; i++) {
    fetches[i] = fetchLeaderboardRank(region, seasonId, i + 1, counter);
  }
  await Promise.all(fetches);

  // This problem should be implemented as a mergesort on all the times
  // If this needs to be optimised, it can be re-reviewed

  const allTimes = new Set();
  for (let i = 0; i < fetches.length; i++) {
    const rankInfo = await fetches[i];
    ranks[i] = rankInfo;
    for (const time of rankInfo.times) {
      allTimes.add(time.time);
    }
  }
  const timeInfo = Array.from(allTimes).sort();
  const result = [];
  for (const time of timeInfo) {
    const timestamp = moment.unix(time).utc();
    const rows = [];
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      if (rank.times.length == 0) {
        console.log(`Rank ${i + 1} is busted, skipping ):`);
        continue;
      }

      while (rank.times[rank.currentIndex + 1] && rank.times[rank.currentIndex + 1].time <= time) {
        rank.currentIndex++;
      }

      rows.push({ accountid: rank.times[rank.currentIndex].name, rank: i + 1});
    }
    result.push({ rows: rows, timestamp: timestamp });
  }
  return result
}

async function fetchLeaderboardRank(region, seasonId, position, counter) {
  const response = await limit(() => axios.get(`https://www.d0nkey.top/leaderboard/rank-history/region/${region}/period/season` +
    `_${seasonId}/leaderboard_id/STD/rank/${position}`));
  console.log(`Received ${position} for ${region}, ${RANK_POSITIONS - (counter.processed++)} to go!`);
  const root = parse(response.data);
  const rows = root.getElementsByTagName('tr').reverse();
  const times = [];
  for (const row of rows) {
    const values = row.getElementsByTagName('td');
    if (values.length < 3) continue; // the header
    const nameParts = values[1].rawText.trim().split('\n');
    const name = nameParts[nameParts.length - 1];
    const time = values[2].querySelector('span').getAttribute('aria-label');
    times.push({name: name, time: time / 1000});
  }
  const result = {
    currentIndex: 0,
    times: times
  };
  return result;
}

export { collectD0nkeyInfo }
