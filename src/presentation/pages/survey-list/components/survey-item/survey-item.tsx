import React from 'react';
import { Icon } from '@/presentation/components';
import Styles from './survey-item-styles.scss';

const SurveyItem: React.FC = () => {
  return (
    <li className={Styles.SurveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon className={Styles.iconWrap} iconName="thumbUp" />
        <time>
          <span className={Styles.day}>22</span>
          <span className={Styles.month}>03</span>
          <span className={Styles.year}>2022</span>
        </time>
        <p>Qual é seu framework web favorito?</p>
      </div>
      <footer>Ver Resultado</footer>
    </li>
  );
};

export { SurveyItem };
