import React, { useEffect, useRef }  from 'react';
import styles from './option_img_wrapper.module.css';
import { addRef } from '../../../../common/button_controller';

const OptionImgWrapper = ({ domId, selected, onClickOption, imgSrc }) => {
  const optionRef = useRef();

  useEffect(() => {
    addRef(optionRef, 'normalMenuSelect', `optionRef-${domId}`, 'click');
  });

  const onHandleClick = (e) => {
    onClickOption(e);
  };

  return (
    <div 
      ref={optionRef}
      id={domId} 
      className={ selected ? `${styles.optionImgWrapper} ${styles.selected}` : styles.optionImgWrapper } 
      onClick={onHandleClick}
    >
      <img className={styles.optiomImg} src={imgSrc} alt="option" />
    </div>
  );
};

export default OptionImgWrapper;