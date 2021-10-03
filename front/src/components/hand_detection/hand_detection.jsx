import React, { useEffect, useRef, useCallback } from 'react';
import styles from './hand_detection.module.css';
import { Hands } from '@mediapipe/hands';
import * as cam from "@mediapipe/camera_utils";
import Webcam from 'react-webcam';

const FINGER_INDEX = 8;
const NOISE_CORRECTION_VALUE = 1; // 손떨림 보정 값 (숫자 커질수록 더 안움직임)
const SCALE_X_START = 0.15, SCALE_X_END = 0.85;
const SCALE_Y_START = 0.05, SCALE_Y_END= 0.7;
const CIRCLE_RADIUS = 25;

// 가만히 있을 때 손떨림 방지용 변수
const prevPos = { x: 0.5, y: 0.5 };
const currPos = { x: 0.5, y: 0.5 };

const HandDetection = () => {
  const webcamRef = useRef();
  const targetRef = useRef();

  // 충돌 테스트용 마우스 이벤트
  /*window.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    if(targetRef.current) {
      targetRef.current.style.display = 'block';
      targetRef.current.style.left = `${x}px`;
      targetRef.current.style.top = `${y}px`;
    }
  });*/

  const onResults = useCallback((results) => {
    if(results.multiHandLandmarks && results.multiHandedness) {
      const landmarks = results.multiHandLandmarks[0][FINGER_INDEX];
      if(landmarks.x > SCALE_X_START && landmarks.x < SCALE_X_END && landmarks.y > SCALE_Y_START && landmarks.y < SCALE_Y_END) {
        // scale 조정 전 좌표
        //const x = landmarks.x * document.documentElement.clientWidth;
        //const y = landmarks.y * document.documentElement.clientHeight;
        // scale 조정 후 좌표 ((x - start) / (end - start))
        const x = (landmarks.x - SCALE_X_START) / (SCALE_X_END - SCALE_X_START) * document.documentElement.clientWidth - CIRCLE_RADIUS;
        const y = (landmarks.y - SCALE_Y_START) / (SCALE_Y_END - SCALE_Y_START) * document.documentElement.clientHeight - CIRCLE_RADIUS;
        
        currPos.x = landmarks.x;
        currPos.y = landmarks.y;
        if(getDistance(prevPos, currPos) * 100000 > NOISE_CORRECTION_VALUE) {
          targetRef.current.style.display = 'block';
          //targetRef.current.style.left = `${x}px`;
          //targetRef.current.style.top = `${y}px`;
          targetRef.current.style.transform = `translate(${x}px, ${y}px)`;

          prevPos.x = currPos.x;
          prevPos.y = currPos.y;
        }
      }
      else {
        targetRef.current.style.display = `none`;
      }
    }
    else {
      targetRef.current.style.display = `none`;
    }
  }, []);
  
  useEffect(() => {
    console.log('[ HandDetection ] hands model is loaded');

    const hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
    }});
    hands.setOptions({
      selfieMode: true,
      maxNumHands: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    hands.onResults(onResults);

    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      });
      camera.start();
    }

  }, [ onResults ]);

  return (
    <>
      <Webcam ref={webcamRef} className={styles.webcam}></Webcam>
      <div ref={targetRef} className={styles.target}></div>
    </>
  );
};

function getDistance(pos1, pos2) {
  return ((pos1.x - pos2.x) ** 2) + ((pos1.y - pos2.y) ** 2);
}

export default HandDetection;