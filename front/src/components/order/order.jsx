import React, { useState } from 'react';
import { useHistory } from 'react-router';
import styles from './order.module.css';
import NormalOrder from './normal_order/normal_order';
import EasyOrder from './easy_order/easy_order';

const Order = ({ menuData, menuByCategory, top3, categoryList, userInfo }) => {
  const history = useHistory();
  const mode = history.location.state.mode;
  const [ currCategory, setCurrCategory ] = useState(categoryList[0]);
  const [ orderList, setOrderList ] = useState([]);

  const onAddMenu = (menuId, option) => {
    const { size, shot, whip } = option;

    const menu = menuData.find(data => data.id === menuId);
    const price = parseInt(menu.price) + (size*1000) + (shot*500);
    setOrderList(data => [ ...data, { id: menu.id, menu: menu.menu, price: price, option: { size: size, shot: shot, whip: whip } } ]);
  };

  const onDeleteMenu = (menuId, option) => {
    //const updated = orderList.filter(data => (data.id !== menuId) || (JSON.stringify(data.option) !== JSON.stringify(option))); // 메뉴, 옵션 모두 동일한 것만 삭제
    const updated = orderList.filter(data => (data.id !== menuId)); // 메뉴 동일한 것 모두 삭제
    setOrderList(updated);
  };

  return (
    <div className={styles.order}>
      { 
        mode === 'normal' ? 
        <NormalOrder 
          menuByCategory={menuByCategory}
          top3={top3}
          categoryList={categoryList}
          currCategory={currCategory}
          setCurrCategory={setCurrCategory}
          onAddMenu={onAddMenu}
          onDeleteMenu={onDeleteMenu}
          orderList={orderList}
          userInfo={userInfo}
        />
        : 
        <EasyOrder 
          menuByCategory={menuByCategory}
          top3={top3}
          categoryList={categoryList}
          currCategory={currCategory}
          setCurrCategory={setCurrCategory}
          onAddMenu={onAddMenu}
          onDeleteMenu={onDeleteMenu}
          orderList={orderList}
          userInfo={userInfo}
        />
      }
    </div>
  );
};

export default Order;