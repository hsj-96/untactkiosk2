import React from 'react';
import { useHistory } from 'react-router';
import styles from './mode_selection.module.css';

const ModeSelection = ({ isLoading }) => {
  const history = useHistory();

  const onClickNormalMode = () => {
    if(!isLoading) {
      history.push({
        pathname: '/order',
        state: { mode: 'normal' }
      });
    }
  };

  const onClickEasylMode = () => {
    if(!isLoading) {
      history.push({
        pathname: '/order',
        state: { mode: 'easy' }
      });
    }
  };

  return (
    <div className={styles.modeSelection}>
      <div className={styles.header}>
        <img src="/images/mode_selection/컵아이콘.png" alt="cup icon" />
        <span>안녕하세요 <b>KU커피</b> 입니다</span>
      </div>
      <div className={styles.modeWrapper}>
        <div className={styles.mode} onClick={onClickNormalMode}>
          <div className={styles.imgWrapper}>
            <div className={styles.modeImg}><img src="/images/mode_selection/일반모드.png" alt="normal mode img" /></div>
            <div className={styles.modeName}>일반 주문</div>
          </div>
        </div>
        <div className={styles.mode} onClick={onClickEasylMode}>
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