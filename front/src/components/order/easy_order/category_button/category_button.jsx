import React from 'react';
import styles from './category_button.module.css';

const CategoryButton = ({ name, currCategory, onClickCategory }) => {
  const onClickButton = () => {
    onClickCategory(name);
  }

  return (
    <div className={isSelected(name, currCategory)} onClick={onClickButton}>
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