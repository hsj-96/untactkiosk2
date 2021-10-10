import React from 'react';
import styles from './order_info.module.css';
import { priceToString } from '../../../../common/price_func';

const OrderInfo = ({ num, data }) => {
  return (
    <div className={styles.order}>
      <div className={styles.orderNum}>{num}</div>
      <div className={styles.menu}>{data.menu}</div>
      <div className={styles.count}> X {data.count}</div>
      <div className={styles.price}>{priceToString(data.price)} 원</div>
    </div>
  );
};

export default OrderInfo;