import React from 'react';
import styles from './menu_card.module.css';
import { priceToString } from '../../../../common/price_func';

const MenuCard = ({ data, openModal }) => {
  const { menu, price, image } = data;
  const medal = data?.medal;

  const onClickMenuCard = () => {
    openModal(data);
  };

  return (
    <div className={`${styles.menuCard} menucard`} onClick={onClickMenuCard}>
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