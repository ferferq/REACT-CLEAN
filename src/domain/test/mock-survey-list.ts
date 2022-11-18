import faker from 'faker';
import { LoadSurveyList } from '../usecases/load-survey-list';

export const mockSurveyModel = (): LoadSurveyList.Model => {
  return {
    id: faker.datatype.uuid(),
    question: faker.random.words(10),
    didAnswer: faker.datatype.boolean(),
    date: faker.date.recent(),
  };
};

export const mockSurvetListModel = (): LoadSurveyList.Model[] => {
  return [mockSurveyModel(), mockSurveyModel(), mockSurveyModel()];
};
