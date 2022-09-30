import faker from 'faker';
import { SurveyModel } from '../models';

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: faker.datatype.uuid(),
    question: faker.random.words(10),
    answers: [
      {
        answer: faker.random.words(4),
      },
      {
        answer: faker.random.words(5),
      },
    ],
    didAnswer: faker.datatype.boolean(),
    date: faker.date.recent(),
  };
};

export const mockSurvetListModel = (): SurveyModel[] => {
  return [mockSurveyModel(), mockSurveyModel(), mockSurveyModel()];
};
