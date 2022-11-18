import React, { useContext } from 'react';
import {
  Item,
  ItemEmpty,
  SurveyContext,
} from '@/presentation/pages/survey-list/components';
import Styles from './list-styles.scss';
import { LoadSurveyList } from '@/domain/usecases/load-survey-list';

const SurveyListItem: React.FC = () => {
  const { state } = useContext(SurveyContext);
  return (
    <ul className={Styles.listWrap} data-testid="survey-list">
      {state.surveys.length ? (
        state.surveys.map((survey: LoadSurveyList.Model) => (
          <Item key={survey.id} survey={survey} />
        ))
      ) : (
        <ItemEmpty />
      )}
    </ul>
  );
};

export { SurveyListItem };
