import React, { useRef, useState } from 'react';
import styles from './easy_order.module.css';
import { useHistory } from 'react-router';
import { priceToString } from '../../../common/price_func';
import MenuCard from './menu_card/menu_card';
import CategoryButton from './category_button/category_button';
import OrderInfo from './order_info/order_info';
import Modal from './modal/modal';

const EasyOrder = ({ menuByCategory, top3, categoryList, currCategory, setCurrCategory, onAddMenu, onDeleteMenu, orderList, userInfo }) => {
  const history = useHistory();
  const menuSectionRef = useRef();
  const [ currCardIdx, setCurrCardIdx ] = useState(0);
  const [ currMenu, setCurrMenu ] = useState(null);
  const [ modalOpen, setModalOpen ] = useState(false);

  const setMenuList = () => {
    const arr = [];

    top3[currCategory].forEach((data, idx) => {
      arr.push({...data, medal: idx+1});
    });

    menuByCategory[currCategory].forEach(data => {
      if(!top3[currCategory].find(obj => obj.id === data.id)) {
        arr.push(data);
      }
    });

    return arr;
  }
  const menuList = setMenuList();

  // ========== Modal ========== //
  const openModal = (data) => {
    if(currCardIdx >= 0 && currCardIdx <= 2) {
      setCurrMenu({...data, medal: currCardIdx+1});
    }
    else {
      setCurrMenu(data);
    }
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const onAddOrderData = (data, option) => {
    onAddMenu(data.id, option);
  };
  const onDeleteOrderData = (data, option) => {
    onDeleteMenu(data.id, option);
  };

  // ========== Header ========== //
  const onClickHome = () => {
    history.push('/');
  }

  const onClickCategory = (name) => {
    setCurrCategory(name);
    setCurrCardIdx(0);
  };

  // ========== Section ========== //
  const onClickLeftButton = () => {
    if(currCardIdx === 0) return;

    const width = menuSectionRef.current.getBoundingClientRect().width;
    const moveDistance = width + width*0.05;

    const doms = document.querySelectorAll('.menucard');
    doms.forEach(dom => {
      dom.style.transform = dom.style.transform ? 
                            `translateX(${parseFloat(dom.style.transform.replace('translateX(', '').replace('px)', '')) + moveDistance}px)` : 
                            `translateX(${moveDistance}px)`;
    });
    setCurrCardIdx(currCardIdx-3);
  };

  const onClickRightButton = () => {
    if(currCardIdx + 3 >= menuByCategory[currCategory].length) return;

    const width = menuSectionRef.current.getBoundingClientRect().width;
    const moveDistance = width + width*0.05;

    const doms = document.querySelectorAll('.menucard');
    doms.forEach(dom => { 
      dom.style.transform = dom.style.transform ? 
                            `translateX(${parseFloat(dom.style.transform.replace('translateX(', '').replace('px)', '')) - moveDistance}px)` : 
                            `translateX(-${moveDistance}px)`;
    });

    setCurrCardIdx(currCardIdx+3);
  };

  return (
    <div className={styles.easyOrder}>
      <div className={styles.headerWrapper}>
      <div className={styles.homeIcon} onClick={onClickHome}><img src={`/images/icon/home.png`} alt="home icon" /></div>
        {
          categoryList.map((name, idx) => <CategoryButton key={idx} name={name} currCategory={currCategory} onClickCategory={onClickCategory} />)
        }
      </div>

      <div className={styles.sectionWrapper}>
        <Modal open={modalOpen} close={closeModal} data={currMenu} userInfo={userInfo} onAddOrderData={onAddOrderData} onDeleteOrderData={onDeleteOrderData} />
        <div className={styles.leftButton} onClick={onClickLeftButton}>◀︎</div>
        <div ref={menuSectionRef} className={styles.menuSection}>
          {
            menuList && menuList.map((data) => <MenuCard key={data.id} data={data} openModal={openModal} />)
          }
        </div>
        <div className={styles.rightButton} onClick={onClickRightButton}>▶︎</div>
      </div>
      <div className={styles.footerWrapper}>
          <div className={styles.orderListWrapper}>
            { orderList && getOrderResult(orderList).map((order, idx) =>
                <OrderInfo key={order.id} num={idx+1} data={order} /> 
              )
            }
          </div>
          <div className={styles.totalPriceWrapper}>
            <div className={styles.totalPriceText}>총 금액</div>
            <div className={styles.totalPrice}>{orderList && priceToString(getTotalPrice(orderList))} 원</div>
          </div>
          <div className={styles.payButton} onClick={() => {history.push('/payment')}}>결제하기</div>
      </div>
    </div>
  );
};

function getOrderResult(orderList) {
  if(!orderList) return null;

  const MAX_NUM = 5;
  const newOrderList = [];
  orderList.forEach(order => {
    const findIdx = newOrderList.findIndex(list => list.id === order.id);
    if(findIdx !== -1) {
      newOrderList[findIdx].price += order.price;
      newOrderList[findIdx].count += 1;
    }
    else {
      if(newOrderList.length + 1 < MAX_NUM) {
        newOrderList.push({ id : order.id, menu : order.menu, price : order.price, count : 1 });
      }
      else {
        if(newOrderList.findIndex(list => list.id === -1) !== -1) {
          newOrderList[MAX_NUM-1].price += order.price;
          newOrderList[MAX_NUM-1].count += 1;
        }
        else {
          newOrderList.push({ id : -1, menu : '그 외', price : order.price, count : 1 });
        }
      }
    }
  });
  
  return newOrderList;
}

function getTotalPrice(orderList) {
  return orderList.reduce((prev, curr) => prev + curr.price, 0);
}

export default EasyOrder;