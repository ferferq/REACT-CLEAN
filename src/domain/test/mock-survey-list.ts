import faker from 'faker';
import { SurveyModel } from '../models';

export const mockSurvetListModel = (): SurveyModel[] => {
  return [
    {
      id: faker.datatype.uuid(),
      questiion: faker.random.words(10),
      answers: [
        {
          answer: faker.random.words(4),
        },
        {
          answer: faker.random.words(5),
        },
      ],
      didAnswer: faker.datatype.boolean(),
      data: faker.date.recent(),
    },
  ];
};
