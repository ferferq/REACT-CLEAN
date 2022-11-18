import React from 'react';
import { SurveyList } from '@/presentation/pages/survey-list';
import { makeRemoteLoadSurveyList } from '@/main/factories/useCases/loadSurveyList/remote-load-survey-list';

export const makeSurveyList: React.FC = () => {
  return <SurveyList loadSurveyList={makeRemoteLoadSurveyList()} />;
};
