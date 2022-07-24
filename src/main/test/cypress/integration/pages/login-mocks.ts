import faker from 'faker';
import * as Helper from '../../support/http-mocks';

const mockName = 'loginRequest';

export const mockInvalidCredentialsError = (): void =>
  Helper.mockInvalidCredentialsError(/login/, mockName);

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/login/, 'POST', mockName);

export const mockOk = (): void =>
  Helper.mockOk(
    /login/,
    'POST',
    { accessToken: faker.datatype.uuid() },
    mockName,
  );

export const mockInvalidData = (): void =>
  Helper.mockOk(
    /login/,
    'POST',
    {
      [faker.database.column()]: faker.datatype.uuid(),
    },
    mockName,
  );
