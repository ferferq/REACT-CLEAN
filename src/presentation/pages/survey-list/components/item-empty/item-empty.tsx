import React from 'react';
import Styles from './item-empty-styles.scss';

const ItemEmpty: React.FC = () => {
  return (
    <>
      <li className={Styles.SurveyItemEmpty}></li>
      <li className={Styles.SurveyItemEmpty}></li>
      <li className={Styles.SurveyItemEmpty}></li>
      <li className={Styles.SurveyItemEmpty}></li>
    </>
  );
};

export { ItemEmpty };
