import faker from 'faker';
import * as Helper from '../../support/http-mocks';

const mockName = 'signupRequest';

export const mockEmailInUseError = (): void =>
  Helper.mockEmailInUseError(/signup/, mockName);

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/signup/, 'POST', mockName);

export const mockOk = (): void =>
  Helper.mockOk(
    /signup/,
    'POST',
    { accessToken: faker.datatype.uuid() },
    mockName,
  );

export const mockInvalidData = (): void =>
  Helper.mockOk(
    /signup/,
    'POST',
    {
      [faker.database.column()]: faker.datatype.uuid(),
    },
    mockName,
  );
