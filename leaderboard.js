import moment from 'moment';
import axios from 'axios';

async function getCurrentLeaderBoard(region, mode = 'STD') {
    const LEADERBOARD_URL = `https://hearthstone.blizzard.com/en-us/api/community/leaderboardsData?region=${region}&leaderboardId=${mode}`;
    // Go ping for the number of pages
    const response = await axios.get(LEADERBOARD_URL);
    const data = response.data.leaderboard;
    const rows = data.rows;
    const pages = data.pagination.totalPages;
    console.log(`Inspecting ${pages} pages...`);
    const leaderboardPages = [];
    // Start at page 2 because page 1 is hit by the initial call
    for (let i = 2; i <= pages; i++) {
        leaderboardPages.push(fetchPage(LEADERBOARD_URL, i).then(pageRows => rows.push(...pageRows)));
    }
    await Promise.all(leaderboardPages);
    return { rows: rows, timestamp: moment.utc() }
}

async function fetchPage(url, page) {
    const response = await axios.get(`${url}&page=${page}`);
    console.log(`Page ${page} done!`)
    return response.data.leaderboard.rows;
}

export { getCurrentLeaderBoard }
