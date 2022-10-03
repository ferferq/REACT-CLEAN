import { Footer, Header } from '@/presentation/components';
import React, { useEffect, useState } from 'react';
import {
  Error,
  SurveyContext,
  SurveyListItem,
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
    error: '',
    reload: false,
  });
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadSurveyList
      .loadAll()
      .then((surveys) => {
        setState({ ...state, surveys });
      })
      .catch((error) => setState({ ...state, error: error.message }));
  }, [state.reload]);

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <main className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <SurveyContext.Provider value={{ state, setState }}>
          {state.error ? <Error /> : <SurveyListItem />}
        </SurveyContext.Provider>
      </main>
      <Footer />
    </div>
  );
};

export { SurveyList };
