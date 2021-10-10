import React from 'react';
import styles from './order_info.module.css';

const OrderInfo = ({ num, data, last }) => {
  return (
    <div className={styles.order}>
      <div className={styles.orderNum}>{num}</div>
      <div className={styles.menu}>{data.menu}</div>
      <div className={styles.count}>{ last ? '' : `X ${data.count}` }</div>
      <div className={styles.price}>{priceToString(data.price * data.count)} 원</div>
    </div>
  );
};

function priceToString(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default OrderInfo;