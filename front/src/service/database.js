import { getMenuData, getPredictionByCategory } from './menu_method';

async function getMenu() {
  return getMenuData();
  /*const requestOptions = {
    method: 'POST',
    redirect: 'follow',
    headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  // test : http://localhost:8001/menudata | build : http://untactkiosk.cafe24app.com/menudata
  return await fetch('http://untactkiosk.cafe24app.com/menudata', requestOptions)
                .then(result => result.json())
                .catch(err => { console.log(err); return null; });
  */
};

async function getPredict(userInfo) {
  const { month, time, sex, age } = userInfo;

  return getPredictionByCategory(month, time, sex, age);
  /*const { month, time, sex, age } = userInfo;

  const requestOptions = {
    method: 'POST',
    redirect: 'follow',
    body: JSON.stringify({ month: month, time: time, sex: sex, age: age }),
    headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  // test : http://localhost:8001/prediction | build : http://untactkiosk.cafe24app.com/prediction
  return await fetch('http://untactkiosk.cafe24app.com/prediction', requestOptions)
                .then(result => result.json())
                .catch(err => { console.log(err); return null; });*/
};

// 카테고리별 메뉴 정보 반환
function getMenuInfoByCategory(menuData) {
  const retArr = {};
  menuData.forEach((data) => {
    if(data.category in retArr) {
      retArr[data.category].push(data);
    }
    else {
      retArr[data.category] = [];
      retArr[data.category].push(data);
    }
  });

  return retArr;
}

// 카테고리 리스트 반환
function getCategoryList(menuData) {
  const categoryArr = [];
  menuData.forEach(data => {
    if(categoryArr.indexOf(data.category) < 0) {
      categoryArr.push(data.category);
    }
  });
  return categoryArr;
}

// menu id별 메뉴 정보 반환
function getMenuInfo(menuData, menuName) {
  return menuData.find((data) => data.menu === menuName);
}

export { getMenu, getPredict, getMenuInfoByCategory, getCategoryList, getMenuInfo }

