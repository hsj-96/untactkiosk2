import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './payment.module.css';

const Payment = () => {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => { 
      history.push('/');
    }, 3000);
  });

  return (
    <div className={styles.payment}>
      <div className={styles.wrapper}>
        <header className={styles.header}>신용카드 결제알림</header>
        <section className={styles.sectionWrapper}>
          <div className={styles.warning}>
            <h1 className={styles.warningText}>결제가 완료될 때 까지</h1>
            <h1 className={styles.warningText}>카드를 빼지 마세요!</h1>
          </div>
          <img className={styles.image} src="/images/payment/결제1.png" alt="payment img" />
          <div className={styles.text}>리더기에 IC카드를 넣어 주세요</div>
        </section>
      </div>
    </div>
  );
};

export default Payment;