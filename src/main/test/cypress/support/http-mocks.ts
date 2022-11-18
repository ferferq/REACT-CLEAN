import faker from 'faker';

export const mockInvalidCredentialsError = (
  url: RegExp,
  mockName: string,
): void => {
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
  ).as(mockName);
};

export const mockEmailInUseError = (url: RegExp, mockName: string): void => {
  cy.intercept(
    {
      method: 'POST',
      url: url,
    },
    {
      statusCode: 403,
      body: {
        error: faker.random.words(),
      },
    },
  ).as(mockName);
};

export const mockUnexpectedError = (
  url: RegExp,
  method: string,
  mockName: string,
): void => {
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
  ).as(mockName);
};

export const mockOk = (
  url: RegExp,
  method: string,
  body: object,
  mockName: string,
): void => {
  cy.intercept(
    {
      method: method,
      url: url,
    },
    {
      statusCode: 200,
      body: body,
    },
  ).as(mockName);
};
