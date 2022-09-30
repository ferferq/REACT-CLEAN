import { Footer, Header } from '@/presentation/components';
import React, { useEffect } from 'react';
import { SurveyItemEmpty } from '@/presentation/pages/survey-list/components';

import Styles from './survey-list-styles.scss';
import { LoadSurveyList } from '@/domain/usecases/load-survey-list';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await loadSurveyList.loadAll();
    })();
  }, []);
  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <main className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul data-testid="survey-list">
          <SurveyItemEmpty />
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export { SurveyList };
