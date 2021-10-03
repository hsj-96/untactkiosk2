import express from 'express';
const menuRouter = express.Router();

import { getMenuData, getPredictionByCategory } from './menu_method.js';

function timeLog(text) {
  const today = new Date();
  console.log(`[${today.toLocaleString()}] : ${text}`);
}

// 메뉴 데이터 전달
menuRouter.post('/menudata', function(req, res, next) {
  timeLog('/menudata requested');

  const result = getMenuData();
  res.send(result);
  res.end();
});

// feature 에 따른 카테고리별 추천 메뉴
menuRouter.post('/prediction', function(req, res, next) {
  const month = req.body.month;
  const time = req.body.time;
  const sex = req.body.sex;
  const age = req.body.age;

  timeLog(`month: ${month} | time: ${time} | sex: ${sex} | age: ${age} /prediction requested`);

  const result = getPredictionByCategory(month, time, sex, age);
  res.send(result);
  res.end();
});

export default menuRouter;