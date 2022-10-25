import { Footer, Header } from '@/presentation/components';
import React, { useContext, useEffect, useState } from 'react';
import {
  Error,
  SurveyContext,
  SurveyListItem,
} from '@/presentation/pages/survey-list/components';

import Styles from './survey-list-styles.scss';
import { LoadSurveyList } from '@/domain/usecases/load-survey-list';
import { AccessDeniedError } from '@/domain/errors';
import { useNavigate } from 'react-router-dom';
import apiContext from '@/presentation/contexts/api/api-context';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const navigate = useNavigate();
  const { setCurrentAccount } = useContext(apiContext);

  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
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
      .catch((error) => {
        if (error instanceof AccessDeniedError) {
          setCurrentAccount(undefined);
          navigate('/login');
        } else {
          setState({ ...state, error: error.message });
        }
      });
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
