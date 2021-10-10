import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './normal_order.module.css';
import { useHistory } from 'react-router';
import { priceToString } from '../../../common/price_func';
import MenuCard from './menu_card/menu_card';
import CategoryButton from './category_button/category_button';
import OrderInfo from './order_info/order_info';
import Modal from './modal/modal';

const NormalOrder = ({ menuByCategory, top3, categoryList, currCategory, setCurrCategory, onAddMenu, onDeleteMenu, orderList, userInfo }) => {
  const history = useHistory();
  const leftButtonRef = useRef(), rightButtonRef = useRef(), sectionRef = useRef();
  const footerSectionRef = useRef(), resultHeaderRef = useRef();
  const [ currCardIdx, setCurrCardIdx ] = useState(3);
  const [ currMenu, setCurrMenu ] = useState(null);
  const [ modalOpen, setModalOpen ] = useState(false);

  const setMenuList = () => {
    const arr = [];
    
    for(let i = 0; i < 3; i++) {
      arr.push({ id: `blank${i}`, menu: null, price: null, description: null, image: null, blank: true });
    }

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
    if(currCardIdx >= 3 && currCardIdx <= 5) {
      setCurrMenu({...data, medal: currCardIdx-2});
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
    setCurrCardIdx(3);
  };

  // ========== Section ========== //
  const onClickLeftButton = () => {
    if(currCardIdx === 3) return;
  
    transformMenuCards(currCardIdx-1);
    setCurrCardIdx(currCardIdx-1);
  };
  const onClickRightButton = () => {
    if(currCardIdx-3+1 >= menuByCategory[currCategory].length) return;

    transformMenuCards(currCardIdx+1);
    setCurrCardIdx(currCardIdx+1);
  };

  const setMenuCardStyle = (dom, width, height, transX, zIndex) => {
    dom.style.display = 'flex';
    dom.style.width = `${width}px`;
    dom.style.height = `${height}px`;
    dom.style.transform = `translateX(${transX}px)`;
    dom.style.zIndex = zIndex;
  };
  
  const transformMenuCards = useCallback((currIdx) => {
    const doms = document.querySelectorAll('.menucard');
    const currDom = doms[currIdx];

    const idxWidth = sectionRef.current.getBoundingClientRect().width - (leftButtonRef.current.getBoundingClientRect().width + rightButtonRef.current.getBoundingClientRect().width);
    const idxHeight = leftButtonRef.current.getBoundingClientRect().height;
    const transX = leftButtonRef.current.getBoundingClientRect().right;

    currDom.style.width = idxWidth + 'px';
    currDom.style.height = idxHeight + 'px';
    currDom.style.transform = `translateX(${transX}px)`;
    currDom.style.zIndex = 0;

    for(let i = 0; i < doms.length; i++) {
      if(i < currIdx-3 || i > currIdx+3) {
        doms[i].style.display = 'none';
      }
    }

    setMenuCardStyle(doms[currIdx-3],                        idxWidth*(0.8**3), idxHeight*(0.8**3), transX-idxWidth*0.7 - idxWidth*0.8*0.7 - idxWidth*(0.8**2)*0.7, -3);
    setMenuCardStyle(doms[currIdx-2],                        idxWidth*(0.8**2), idxHeight*(0.8**2), transX-idxWidth*0.7 - idxWidth*0.8*0.7 , -2);
    setMenuCardStyle(doms[currIdx-1],                        idxWidth*0.8,      idxHeight*0.8,      transX-idxWidth*0.7, -1);
    doms[currIdx+1] && setMenuCardStyle(doms[currIdx+1], idxWidth*0.8,      idxHeight*0.8,      transX+idxWidth*0.9, -1);
    doms[currIdx+2] && setMenuCardStyle(doms[currIdx+2], idxWidth*(0.8**2), idxHeight*(0.8**2), transX+idxWidth*0.9 + idxWidth*0.8*0.9, -2);
    doms[currIdx+3] && setMenuCardStyle(doms[currIdx+3], idxWidth*(0.8**3), idxHeight*(0.8**3), transX+idxWidth*0.9 + idxWidth*0.8*0.9 + idxWidth*(0.8**2)*0.9, -3);
  }, []);

  useEffect(() => {
    transformMenuCards(currCardIdx);
  }, [ currCategory, transformMenuCards, currCardIdx ]);

  // ========== Footer ========== //
  const onClickFooter = () => {
    footerSectionRef.current.style.top = '20%';
  }
  const onClickCloseFooterButton = () => {
    footerSectionRef.current.style.top = '90%';
  }

  return (
    <div className={styles.normalOrder}>
      <div className={styles.headerWrapper}>
        <div className={styles.homeIcon} onClick={onClickHome}><img src={`/images/icon/home.png`} alt="home icon" /></div>
        {
          categoryList.map((name, idx) => <CategoryButton key={idx} name={name} currCategory={currCategory} onClickCategory={onClickCategory} />)
        }
      </div>
      
      <div ref={sectionRef} className={styles.sectionWrapper}>
        <Modal open={modalOpen} close={closeModal} data={currMenu} userInfo={userInfo} onAddOrderData={onAddOrderData} onDeleteOrderData={onDeleteOrderData} />
        <div ref={leftButtonRef} className={styles.leftButton} onClick={onClickLeftButton}>◀</div>
        <div className={styles.menuSection}>
          {
            menuList && menuList.map((data) => <MenuCard key={data.id} data={data} openModal={openModal} />)
          }
        </div>
        <div ref={rightButtonRef} className={styles.rightButton} onClick={onClickRightButton}>▶︎</div>
      </div>
      <div ref={footerSectionRef} className={styles.footerWrapper}>
          <div ref={resultHeaderRef} className={styles.footerName} onClick={onClickFooter}>합계</div>
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
          <div className={styles.footerButtonWrapper}>
            <div className={styles.backButton} onClick={onClickCloseFooterButton}>뒤로가기</div>
            <div className={styles.payButton} onClick={() => {history.push('/payment')}}>결제하기</div>
          </div> 
      </div>
    </div>
  );
};

function getOrderResult(orderList) {
  if(!orderList) return null;

  const MAX_NUM = 8;
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

export default NormalOrder;