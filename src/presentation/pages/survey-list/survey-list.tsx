import { Footer, Header } from '@/presentation/components';
import React, { useEffect, useState } from 'react';
import {
  SurveyItem,
  SurveyItemEmpty,
} from '@/presentation/pages/survey-list/components';

import Styles from './survey-list-styles.scss';
import { LoadSurveyList } from '@/domain/usecases/load-survey-list';
import { SurveyModel } from '@/domain/models';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const [state, setState] = useState({
    surveys: [] as SurveyModel[],
  });
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadSurveyList.loadAll().then((surveys) => {
      setState({ surveys });
    });
  }, []);
  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <main className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul data-testid="survey-list">
          {state.surveys.length ? (
            state.surveys.map((survey: SurveyModel) => (
              <SurveyItem key={survey.id} survey={survey} />
            ))
          ) : (
            <SurveyItemEmpty />
          )}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export { SurveyList };
