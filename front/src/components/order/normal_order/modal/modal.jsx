import React, { useEffect, useState } from 'react';
import styles from './modal.module.css';
import { priceToString } from '../../../../common/price_func';

const Modal = ({ open, close, data, userInfo, onAddOrderData, onDeleteOrderData }) => {
  const medal = data?.medal;
  const optionInfo = [
    {
      name : null
    },
    {
      optionIdx : 0,
      name : '사이즈',
      optList : [ '기본(M)', '사이즈업(L)' ],
      optPrice : [ 0, 1000 ],
      imageSrc : [ '/images/option/size1.png', '/images/option/size2.png' ]
    },
    {
      optionIdx : 1,
      name : '샷 추가',
      optList : [ '기본', '샷 추가(x1)', '샷 추가(x2)' ],
      optPrice : [ 0, 500, 1000 ],
      imageSrc : [ '/images/option/선택안함.png', '/images/option/샷잔.png', '/images/option/샷잔.png' ]
    },
    {
      optionIdx : 2,
      name : '휘핑',
      optList : [ '기본(휘핑X)', '휘핑 추가' ],
      optPrice : [ 0, 0 ],
      imageSrc : [ '/images/option/선택안함.png', '/images/option/휘핑크림.png' ]
    }
  ];
  const options = data?.option.split(',') || null ;
  const [ optionState, setOptionState ] = useState([0, 0, 0]);

  useEffect(() => setOptionState([0, 0, 0]), [ open ]);

  const onClickAddButton = () => {
    const option = { size: optionState[0], shot: optionState[1], whip: optionState[2] };
    onAddOrderData(data, option);
    close();
  }

  const onClickDeleteButton = () => {
    const option = { size: optionState[0], shot: optionState[1], whip: optionState[2] };
    onDeleteOrderData(data, option);
    close();
  }

  const onClickCloseButton = () => {
    close();
  }

  const onClickOption = (e) => {
    const optionType = parseInt(e.currentTarget.id.split('-')[0]);
    const optionVal = parseInt(e.currentTarget.id.split('-')[1]);
    const updated = Object.assign({}, optionState);
    updated[optionType] = optionVal;
    setOptionState(updated);
  }

  return (
    <div className={ open ? `${styles.openModal} ${styles.modal}` : styles.modal }>
      { open ? (  
        <div className={styles.modalBox}>
          <div className={styles.close} onClick={onClickCloseButton}> &times; </div>
          
          <div className={styles.menuInfoWrapper}>
            <div className={styles.menuInfo}>
              { medal && (
                <div className={styles.userInfoSection}>
                  <img className={styles.medal} src={`/images/icon/medal${medal}.png`} alt="medal" />
                  <span className={styles.userInfo}><b>{userInfo.age}</b> 대 <b>{userInfo.gender}</b> 에게 추천드리는 메뉴입니다!</span>
                </div>
                ) 
              }
              <div className={styles.imgWrapper}>
                <img className={styles.image} src={`/images/menus/${data.image}`} alt={data.menu} />
              </div>
              <div className={styles.name}>{data.menu}</div>
              <div className={styles.price}>{priceToString(data.price)} 원</div>
              <div className={styles.description}>{data.description}</div>
            </div>
            <div className={styles.buttonSection}>
              <div className={styles.add} onClick={onClickAddButton}>메뉴 추가</div>
              <div className={styles.delete} onClick={onClickDeleteButton}>메뉴 삭제</div>
            </div>
          </div>

          <div className={styles.optionSection}>
            { options && options.map((option, idx) => (
                <div key={idx} className={styles.optionCard}>
                  <div className={styles.optionName}>{optionInfo[option].name}</div>
                  <div className={styles.optionButtonWrapper}>
                    { optionInfo[option].imageSrc.map((imgSrc, i) => (
                      <div key={i} className={styles.optionButton}>
                        <div 
                          id={`${optionInfo[option].optionIdx}-${i}`} 
                          className={ optionState[idx] === i ? `${styles.optionImgWrapper} ${styles.selected}` : styles.optionImgWrapper } 
                          onClick={onClickOption}
                        >
                          <img className={styles.optiomImg} src={imgSrc} alt="option" />
                        </div>
                        <div className={styles.optionTextWrapper}>
                          <div className={styles.optionDetailName}>{optionInfo[option].optList[i]}</div>
                          <div className={styles.optionPrice}>{priceToString(optionInfo[option].optPrice[i])} 원</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : null }
    </div>
  )
}

export default Modal;