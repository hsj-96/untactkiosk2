import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import styles from './mode_selection.module.css';
import { initRefList, addRef, setPageStatus } from '../../common/button_controller';

const ModeSelection = ({ isLoading }) => {
  const history = useHistory();
  const easyRef= useRef(), normalRef= useRef(); 

  useEffect(() => {
    initRefList();
    addRef(easyRef, 'modeSelection', 'easyRef', 'click');
    addRef(normalRef, 'modeSelection', 'normalRef', 'click');
    setPageStatus('modeSelection');
  });

  const onClickNormalMode = () => {
    if(!isLoading) {
      history.push({
        pathname: '/order',
        state: { mode: 'normal' }
      });
      setPageStatus('normalOrder');
    }
  };

  const onClickEasylMode = () => {
    if(!isLoading) {
      history.push({
        pathname: '/order',
        state: { mode: 'easy' }
      });
      setPageStatus('easyOrder');
    }
  };

  return (
    <div className={styles.modeSelection}>
      <div className={styles.header}>
        <img src="/images/mode_selection/컵아이콘.png" alt="cup icon" />
        <span>안녕하세요 <b>KU커피</b> 입니다</span>
      </div>
      <div className={styles.modeWrapper}>
        <div ref={easyRef} className={styles.mode} onClick={onClickNormalMode}>
          <div className={styles.imgWrapper}>
            <div className={styles.modeImg}><img src="/images/mode_selection/일반모드.png" alt="normal mode img" /></div>
            <div className={styles.modeName}>일반 주문</div>
          </div>
        </div>
        <div ref={normalRef} className={styles.mode} onClick={onClickEasylMode}>
          <div className={styles.imgWrapper}>
            <div className={styles.modeImg}><img src="/images/mode_selection/쉬운모드.png" alt="easy mode img" /></div>
            <div className={styles.modeName}>쉬운 주문</div>
          </div>
        </div>
      </div>
      <div className={styles.descriptionWrapper}>
        둘 중 하나의 모드를 선택해주세요
      </div>
    </div>
  );
};

export default ModeSelection;