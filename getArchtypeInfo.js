import axios from 'axios';

// From ArchetypeSignature.tsx on hsreplay
const CORE_THRESHOLD = 0.8;
const POPULAR_THRESHOLD = 0.3;
// Not used atm on hsreplay
const OCCASIONAL_THRESHOLD = 0.1;

export async function getArchtypeInfo(archtypeId) {
  const response = await axios.get(`https://hsreplay.net/api/v1/archetypes/${archtypeId}/?hl=en`);
  const info = {
    core: [],
    popular: []
  };
  for (const cardInfo of response.data.standard_signature.components) {
    const [cardId, value] = cardInfo;
    if (value >= CORE_THRESHOLD) {
      info.core.push(cardInfo);
    } else if (value >= POPULAR_THRESHOLD) {
      info.popular.push(cardInfo);
    }
  }

  for (const key of Object.keys(info)) {
    info[key] = info[key].sort().reverse().map(e => e[0]);
  }
  return info;
}
