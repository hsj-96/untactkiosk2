import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styles from './app.module.css'
import './custom.css';
import * as faceapi from 'face-api.js';

import HandDetection from './components/hand_detection/hand_detection';
import Home from './components/home/home';
import ModeSelection from './components/mode_selection/mode_selection';
import Order from './components/order/order'; 
import Payment from './components/payment/payment';
import Loading from './components/loading/loading';

import { getMenu, getMenuInfoByCategory, getCategoryList, getPredict, getMenuInfo } from './service/database';

const App = () => {
  const [ menuData, setMenuData ] = useState([]);
  const [ menuByCategory, setMenuByCategory ] = useState([]);
  const [ categoryList, setCategoryList ] = useState([]);
  const [ top3, setTop3 ] = useState([]);
  const [ userInfo, setUserInfo ] = useState({});
  const [ isLoading, setIsLoading ] = useState(false);

  const faceWebcamRef = useRef();

  useEffect(() => {
    setIsLoading(true);

    // 메뉴 데이터 불러오기
    async function fetchMenuData() {
      const result = await getMenu();
      setMenuData(result);
      setMenuByCategory(getMenuInfoByCategory(result));
      setCategoryList(getCategoryList(result));
      console.log('[App] menu data is loaded');
    }
    fetchMenuData();

    // 얼굴인식 model 불러오기
    async function loadFaceModel() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.ageGenderNet.loadFromUri('/models');
      console.log('[App] faceapi model is loaded');
    };
    loadFaceModel();

    // 얼굴 인식용 video
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          faceWebcamRef.current.srcObject = stream;
          faceWebcamRef.current.play();
        })
        .catch(err => { // video load 실패
          console.log(err);
          setIsLoading(false);
        });
    }
    faceWebcamRef.current.onloadedmetadata = function(e) { // video load 성공
      setIsLoading(false);
    };
  }, []);

  const detectFace = async () => {
    setIsLoading(true);

    let age = 30, gender = 'female';
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(async (stream) => {
        const detectionWithAgeAndGender = await faceapi.detectSingleFace(faceWebcamRef.current)
          .withFaceLandmarks()
          .withAgeAndGender();
        age = detectionWithAgeAndGender?.age || 30;
        gender = detectionWithAgeAndGender?.gender || 'female';
        console.log(`detect : age : ${age}, gender : ${gender}`);
      })
      .catch(err => { // video load 실패
        age = 30;
        gender = 'female';
        console.log('Video device not found. Set [ age=30, gender=female ] default value.');
      })
      .finally(async () => {
        const month = Math.floor(Math.random()*3 + 7);
        const hour = new Date().getHours();
        const time = (hour >= 8 && hour <= 22) ? hour : 8;
        const sex = gender === 'male' ? 0 : 1;
        const ageGroup = getAgeGroup(age+7);
        const info = {
          month: month,
          time: time,
          sex: sex,
          age: ageGroup
        };

        const predictMenu = await getPredict(info);
        console.log(`[ predict request ] month : ${month}, time: ${time}, sex: ${sex}, age: ${age} `);
        
        setTop3ByCategory(predictMenu);
        setUserInfo({ age : ageGroup, gender : sex === 0 ? '남성' : '여성' });
        setIsLoading(false);
      });
  };

  const setTop3ByCategory = (predictionData) => {
    const arr = {};
    predictionData.forEach(data => {
      if(data.category in arr) {
        if(arr[data.category].length < 3) {
          arr[data.category].push(getMenuInfo(menuData, data.menu));
        }
      }
      else {
        arr[data.category] = [];
        arr[data.category].push(getMenuInfo(menuData, data.menu));
      }
    });
    setTop3(arr);
  }

  return (
    <div className={styles.app}>
      { isLoading && <Loading /> }
      <div className={styles.faceapiSection}>
        <video ref={faceWebcamRef}></video>
      </div>
      <HandDetection />
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Home detectFace={detectFace} isLoading={isLoading} />
          </Route>
          <Route path="/mode">
            <ModeSelection isLoading={isLoading} />
          </Route>
          <Route path="/order">
            <Order 
              menuData={menuData}
              menuByCategory={menuByCategory}
              top3={top3}
              categoryList={categoryList}
              userInfo={userInfo}
            />
          </Route>
          <Route path="/payment">
            <Payment />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

function getAgeGroup(age) {
  if(age < 20) return 10;
  else if(age < 30) return 20;
  else if(age < 40) return 30;
  else if(age < 50) return 40;
  else return 50;
}

export default App;