import faker from 'faker';

export const mockInvalidCredentialsError = (url: RegExp): void => {
  cy.intercept(
    {
      method: 'POST',
      url: url,
    },
    {
      statusCode: 401,
      body: {
        error: faker.random.words(),
      },
    },
  ).as('loginRequest');
};

export const mockUnexpectedError = (url: RegExp, method: string): void => {
  cy.intercept(
    {
      method: method,
      url: url,
    },
    {
      statusCode: faker.helpers.randomize([400, 404, 500]),
      body: {
        error: faker.random.words(),
      },
    },
  ).as('loginRequest');
};

export const mockOk = (url: RegExp, method: string, body: object): void => {
  cy.intercept(
    {
      method: method,
      url: url,
    },
    {
      statusCode: 200,
      body: body,
    },
  ).as('loginRequest');
};
