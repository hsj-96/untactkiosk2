import React, { useEffect, useRef } from 'react';
import styles from './menu_card.module.css';
import { priceToString } from '../../../../common/price_func';
import { addRef, setPageStatus } from '../../../../common/button_controller';

const MenuCard = ({ data, openModal, currShownMenuList }) => {
  const { menu, price, image } = data;
  const medal = data?.medal;
  const cardRef = useRef();

  useEffect(() => {
    if(currShownMenuList.includes(menu)) {
      addRef(cardRef, 'easyOrder', `cardRef_${menu}`, 'click');
    }
  });

  const onClickMenuCard = () => {
    setPageStatus('easyMenuSelect');
    openModal(data);
  };

  return (
    <div ref={cardRef} className={`${styles.menuCard} menucard`} onClick={onClickMenuCard}>
      { medal && <img className={styles.medal} src={`/images/icon/medal${medal}.png`} alt="medal" /> }
      <div className={styles.imgWrapper}>
        <img className={styles.image} src={`/images/menus/${image}`} alt={menu} />
      </div>
      <div className={styles.name}>{menu}</div>
      <div className={styles.price}>{priceToString(price)} 원</div>
    </div>
  );
};

export default MenuCard;