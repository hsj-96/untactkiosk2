import React from 'react';
import styles from './modal.module.css';
import { priceToString } from '../../../../common/price_func';

const Modal = ({ open, close, data, userInfo, onAddOrderData, onDeleteOrderData }) => {
  const medal = data?.medal;

  const onClickAddButton = () => {
    const option = { size: 0, shot: 0, whip: 0 };
    onAddOrderData(data, option);
    close();
  }

  const onClickDeleteButton = () => {
    const option = { size: 0, shot: 0, whip: 0 };
    onDeleteOrderData(data, option);
    close();
  }

  const onClickCloseButton = () => {
    close();
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
        </div>
      ) : null }
    </div>
  )
}

export default Modal;