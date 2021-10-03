import fs from 'fs';
import parse from 'csv-parse';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const menuData = [];
const menuList = [];
(async () => {
  fs.createReadStream(path.resolve(__dirname, '..', 'csv', 'menus.csv'))
  .pipe(parse({
    columns: true,
    delimiter: ',',
    trim: true,
    skip_empty_lines: true,
  }))
  .on('data', function(csvrow) {
    menuData.push(csvrow);
    menuList.push(csvrow.menu);
  })
  .on('end',function() {
    console.log(`menus.csv data loaded! length : ${menuData.length}`);
  });
})();

const orderData = [];
(async () => {
  fs.createReadStream(path.resolve(__dirname, '..', 'csv', 'order_data.csv'))
  .pipe(parse({
    columns: true,
    delimiter: ',',
    trim: true,
    skip_empty_lines: true,
  }))
  .on('data', function(csvrow) {
    orderData.push(csvrow)
  })
  .on('end',function() {
    console.log(`order_data.csv data loaded! length : ${orderData.length}`);
    setProbability();
  });
})();


// 각 메뉴별 주문 개수
const menuCounter = {};
// 각 메뉴별 feature 의 개수
const menuFeatureCounter = {};
// 각 feature별 개수
const featureCounter = {
  month : { 7: 0, 8: 0, 9: 0 },
  time : { 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0 , 19: 0, 20: 0, 21: 0, 22: 0 },
  sex : { 0: 0, 1: 0 },
  age : { 10: 0, 20: 0, 30: 0, 40: 0, 50: 0 }
};
function setProbability() {
  // 전체 주문 개수
  const orderDataNum = orderData.length;
  
  for(let data of orderData) {
    // 각 메뉴별 주문 개수
    menuCounter[data.menu] = (menuCounter[data.menu] || 0) + 1;

    // 각 메뉴별 feature 의 개수
    const tmpObj = {
      count : 0,
      month : { 7: 0, 8: 0, 9: 0 },
      time : { 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0 , 19: 0, 20: 0, 21: 0, 22: 0 },
      sex : { 0: 0, 1: 0 },
      age : { 10: 0, 20: 0, 30: 0, 40: 0, 50: 0 }
    };
    if(!menuFeatureCounter[data.menu]) {
      menuFeatureCounter[data.menu] = Object.assign({}, tmpObj);
    }
    menuFeatureCounter[data.menu].count++;
    menuFeatureCounter[data.menu].month[data.month]++;
    menuFeatureCounter[data.menu].time[data.time]++;
    menuFeatureCounter[data.menu].sex[data.sex]++;
    menuFeatureCounter[data.menu].age[data.age]++;

    // 각 feature별 개수
    featureCounter.month[data.month]++;
    featureCounter.time[data.time]++;
    featureCounter.sex[data.sex]++;
    featureCounter.age[data.age]++;
  }
}

function getPrediction(month, time, sex, age) {
  // ex) menu = '아이스 카페 아메리카노';

  // P(menu | m, t, s, a) = P(m, t, s, a | menu) * P(menu) / P(m, t, s, a)
  
  // P(m, t, s, a | menu) = P(m | menu) * P(t * menu) * P(s | menu) * P(a | menu))
  // P(menu) = menuCount / totalOrderNumber
  // P(m, t, s, a) = P(m, t, s, a) = mtsa 인 개수 / 전체 주문 개수

  // *** 확률이 0 이 되는 경우의 보정값 필요함 *** // ---> 라플라스 스무딩 분자 + 0.5, 분모 + 1

  const SMOOTHING = 0.5;

  let mtsa_cnt = 0;
  for(let obj of orderData) {
    if(parseInt(obj.month) === month && 
      parseInt(obj.time) === time && 
      parseInt(obj.sex) === sex && 
      parseInt(obj.age) === age) {
      mtsa_cnt++;
    }
  }

  const probability = {};
  for(let menu of menuList) {
    const p_m_menu = menuFeatureCounter[menu].month[month] ?
    menuFeatureCounter[menu].month[month] / menuFeatureCounter[menu].count :
    (menuFeatureCounter[menu].month[month]+SMOOTHING) / (menuFeatureCounter[menu].count+SMOOTHING*2);
    const p_t_menu = menuFeatureCounter[menu].time[time] ?
    menuFeatureCounter[menu].time[time] / menuFeatureCounter[menu].count :
    (menuFeatureCounter[menu].time[time]+SMOOTHING) / (menuFeatureCounter[menu].count+SMOOTHING*2);
    const p_s_menu = menuFeatureCounter[menu].sex[sex] ?
    menuFeatureCounter[menu].sex[sex] / menuFeatureCounter[menu].count :
    (menuFeatureCounter[menu].sex[sex]+SMOOTHING) / (menuFeatureCounter[menu].count+SMOOTHING*2);
    const p_a_menu = menuFeatureCounter[menu].age[age] ?
    menuFeatureCounter[menu].age[age] / menuFeatureCounter[menu].count :
    (menuFeatureCounter[menu].age[age]+SMOOTHING) / (menuFeatureCounter[menu].count+SMOOTHING*2);

    const p_menu = menuFeatureCounter[menu].count / orderData.length;

    const p_m_t_s_a = mtsa_cnt / orderData.length;

    probability[menu] = (p_m_menu * p_t_menu * p_s_menu * p_a_menu) * p_menu / p_m_t_s_a;
  }

  const probList = [];
  for(let key in probability) {
    probList.push({ menu : key, val : probability[key], category: menuData.find(data => data.menu === key).category });
  }

  return probList.sort((a,b) => b.val - a.val);
}


function getMenuData() {
  return menuData.map((data, idx) => ({ ...data, image: `${data.menu}.png`, id: idx }));
}

function getPredictionByCategory(month = 7, time = 12, sex = 0, age = 20) {
  const allPrediction = getPrediction(month, time, sex, age);
  return allPrediction.sort((a,b) => a.category < b.category ? -1 : a.category > b.category ? 1 : 0 );
}

export { getMenuData, getPredictionByCategory }