import React, { useEffect, useRef } from 'react';
import styles from './category_button.module.css';
import { addRef } from '../../../../common/button_controller';

const CategoryButton = ({ name, currCategory, onClickCategory }) => {
  const categoryRef = useRef();

  useEffect(() => {
    addRef(categoryRef, 'easyOrder', `categoryRef_${name}`, 'click');
  });

  const onClickButton = () => {
    onClickCategory(name);
  }

  return (
    <div ref={categoryRef} className={isSelected(name, currCategory)} onClick={onClickButton}>
      {name}
    </div>
  );
};

function isSelected(name, currCategory) {
  if(name === currCategory) {
    return `${styles.category} ${styles.selected}`;
  }
  else {
    return styles.category;
  }
}

export default CategoryButton;