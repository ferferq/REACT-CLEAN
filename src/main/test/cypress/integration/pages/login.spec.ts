import faker from 'faker';
import * as FormHelper from '../../support/form-helper';
import * as HttpHelper from '../../support/http-helper';
import * as Http from './login-mocks';

const populateFields = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email());
  cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5));
};

const simulateValidSubmit = (): void => {
  populateFields();
  cy.getByTestId('submit').click();
};

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });
  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('email', 'Campo obrigatório');
    cy.getByTestId('password').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('password', 'Campo obrigatório');
    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word());
    FormHelper.testInputStatus('email', 'Valor inválido');
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3));
    FormHelper.testInputStatus('password', 'Minimo 5 caracters');
    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    populateFields();
    FormHelper.testInputStatus('email');
    FormHelper.testInputStatus('password');
    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present InvalidCredentialsError on 401', () => {
    Http.mockInvalidCredentialsError();
    simulateValidSubmit();
    FormHelper.testMainError('Credentials inválidas');
    HttpHelper.testUrl('/login');
  });

  it('Should present UnexpectedError on 400', () => {
    Http.mockUnexpectedError();
    simulateValidSubmit();
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve.',
    );
    HttpHelper.testUrl('/login');
  });

  it('Should present save accessToken if valid credentials are provided', () => {
    Http.mockOk();
    simulateValidSubmit();
    cy.getByTestId('error-wrap').should('not.have.descendants');
    HttpHelper.testUrl('/');
    FormHelper.testLocalStorageItem('accessToken');
  });

  it('Should present UnexpectedError if invalid data is returnded', () => {
    Http.mockInvalidData();
    simulateValidSubmit();
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve.',
    );
    HttpHelper.testUrl('/login');
  });

  it('Should present multiple submits', () => {
    Http.mockOk();
    populateFields();
    cy.getByTestId('submit').dblclick();
    HttpHelper.testHttpCallsCount(1);
  });

  it('Should not call if form is invalid', () => {
    Http.mockOk();
    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .type('{enter}');
    HttpHelper.testHttpCallsCount(0);
  });
});
