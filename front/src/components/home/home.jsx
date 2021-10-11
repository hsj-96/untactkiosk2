import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import styles from './home.module.css';
import { initRefList, addRef, setPageStatus } from '../../common/button_controller';

const Home = ({ detectFace, isLoading }) => {
  const history = useHistory();
  const hoverRef1= useRef(), hoverRef2= useRef(), hoverRef3= useRef(), startRef= useRef(); 
  
  useEffect(() => {
    initRefList();
    addRef(hoverRef1, 'home', 'hoverRef1', 'hover', 'scale1');
    addRef(hoverRef2, 'home', 'hoverRef2', 'hover', 'scale1');
    addRef(hoverRef3, 'home', 'hoverRef3', 'hover', 'scale1');
    addRef(startRef, 'home', 'startRef', 'click');
    setPageStatus('home');
  });

  const onClickStart = async () => {
    if(!isLoading) {
      await detectFace();
      history.push('/mode');
      setPageStatus('modeSelection');
    }
  };

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <h1>비접촉 키오스크 사용법</h1>
      </div>
      <div className={styles.stepWrapper}>
        <div ref={hoverRef1} className={styles.step}>
          <div className={styles.imgWrapper}>
            <img src="/images/home/step1.png" alt="step img" />
            <h1>손 인식</h1>
          </div>
          <div className={styles.textWrapper}>
            <p>위의 사진처럼</p>
            <p>카메라에 손을 인식해주세요</p>
          </div>
        </div>
        <div ref={hoverRef2} className={styles.step}>
          <div className={styles.imgWrapper}>
            <img src="/images/home/step2.png" alt="step img" />
            <h1>이동</h1>
          </div>
          <div className={styles.textWrapper}>
            <p>화면의 초록색 포인터를 보고</p>
            <p>손가락을 움직이세요</p>
          </div>
        </div>
        <div ref={hoverRef3} className={styles.step}>
          <div className={styles.imgWrapper}>
            <img src="/images/home/step3.png" alt="step img" />
            <h1>선택</h1>
          </div>
          <div className={styles.textWrapper}>
            <p>선택할 버튼 위로</p>
            <p>손가락을 멈추세요</p>
          </div>
        </div>
      </div>
      <div ref={startRef} className={styles.startButton} onClick={onClickStart}>
        <p className={styles.upperDescription}>키오스크 시작하기</p>
        <p className={styles.lowerDescription}>위의 방법처럼 초록색 포인터를 올려보세요</p> 
      </div>
    </div>
  );
};

export default Home;