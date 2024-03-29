import React from 'react';
import { Icon } from '@/presentation/components';
import Styles from './item-styles.scss';
import { LoadSurveyList } from '@/domain/usecases/load-survey-list';

type Props = {
  survey: LoadSurveyList.Model;
};

const Item: React.FC<Props> = ({ survey }) => {
  const iconName = survey.didAnswer ? 'thumbUp' : 'thumbDown';
  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon className={Styles.iconWrap} iconName={iconName} />
        <time>
          <span data-testid="day" className={Styles.day}>
            {survey.date.getDate().toString().padStart(2, '0')}
          </span>
          <span data-testid="month" className={Styles.month}>
            {survey.date
              .toLocaleString('pt-BR', { month: 'short' })
              .replace('.', '')}
          </span>
          <span data-testid="year" className={Styles.year}>
            {survey.date.getFullYear()}
          </span>
        </time>
        <p data-testid="question">{survey.question}</p>
      </div>
      <footer>Ver Resultado</footer>
    </li>
  );
};

export { Item };
