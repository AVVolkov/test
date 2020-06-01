const cfg = {
  url: 'http://localhost:3000',
  interval: 2000,
  minNum: 1,
  maxNum: 10,
  maxParam: 20,
  minValue: -1,
  maxValue: 1,
};

const axios = require('axios');

const ids = [];
for (let i = cfg.minNum; i <= cfg.maxNum; i += 1) {
  ids.push({
    id: `testId${i}`,
    name: `testName${i}`,
  });
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const addUniqueParam = (obj) => {
  if (Object.keys(obj).length === cfg.maxParam) {
    return obj;
  }

  const paramNum = randomInt(cfg.minNum, cfg.maxParam);

  if (obj[paramNum]) {
    return addUniqueParam(obj);
  }
  return Object.assign(obj, {
    [`p${paramNum}`]: randomFloat(cfg.minValue, cfg.maxValue),
  });
};

const loopSend = async () => {
  try {
    const params = {};
    for (let paramIter = 0; paramIter <= randomInt(cfg.minNum, cfg.maxParam); paramIter += 1) {
      addUniqueParam(params);
    }

    const res = await axios.post(`${cfg.url}/v1/upsert`, Object.assign(
      params,
      ids[randomInt(cfg.minNum - 1, cfg.maxNum - 1)],
    ));
    console.log('Success:', res.data);
  } catch (err) {
    console.error('loopSend', err);
  }

  setTimeout(() => {
    loopSend();
  }, cfg.interval);
};

loopSend();
