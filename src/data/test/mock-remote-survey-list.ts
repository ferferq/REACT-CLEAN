import faker from 'faker';
import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/remote-load-survey-list';

export const mockRemoteSurveyModel = (): RemoteLoadSurveyList.Model => {
  return {
    id: faker.datatype.uuid(),
    question: faker.random.words(10),
    didAnswer: faker.datatype.boolean(),
    date: faker.date.recent().toISOString(),
  };
};

export const mockRemoteSurvetListModel = (): RemoteLoadSurveyList.Model[] => {
  return [
    mockRemoteSurveyModel(),
    mockRemoteSurveyModel(),
    mockRemoteSurveyModel(),
  ];
};
