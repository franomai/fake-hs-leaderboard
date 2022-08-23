import moment from 'moment';
import axios from 'axios';

const LEADERBOARD_URL = 'https://hearthstone.blizzard.com/en-us/api/community/leaderboardsData?region=EU&leaderboardId=STD';
async function getCurrentLeaderBoard() {
    const response = await axios.get(LEADERBOARD_URL);
    const data = response.data.leaderboard;
    return { rows: data.rows, timestamp: moment.utc(data.metadata.last_updated_time, "YYYY/MM/DD HH:mm:ss ddd").toDate() }
}

export { getCurrentLeaderBoard }
