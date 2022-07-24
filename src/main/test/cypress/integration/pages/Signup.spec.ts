import faker from 'faker';
import * as FormHelper from '../../support/form-helper';
import * as HttpHelper from '../../support/http-helper';
import * as Http from './signup-mocks';

const simulateValidSubmit = (): void => {
  cy.getByTestId('name').focus().type(faker.datatype.string(6));
  cy.getByTestId('email').focus().type(faker.internet.email());
  const password = faker.internet.password();
  cy.getByTestId('password').focus().type(password);
  cy.getByTestId('passwordConfirmation').focus().type(password);
  cy.getByTestId('submit').click();
};

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });
  it('Should load with correct initial state', () => {
    cy.getByTestId('name').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('name', 'Campo obrigatório');
    cy.getByTestId('email').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('email', 'Campo obrigatório');
    cy.getByTestId('password').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('password', 'Campo obrigatório');
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('passwordConfirmation', 'Campo obrigatório');
    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.datatype.string(3));
    FormHelper.testInputStatus('name', 'Minimo 5 caracters');
    cy.getByTestId('email').focus().type(faker.random.word());
    FormHelper.testInputStatus('email', 'Valor inválido');
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3));
    FormHelper.testInputStatus('password', 'Minimo 5 caracters');
    cy.getByTestId('passwordConfirmation')
      .focus()
      .type(faker.random.alphaNumeric(3));
    FormHelper.testInputStatus('passwordConfirmation', 'Valor inválido');
    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('name').focus().type(faker.datatype.string(6));
    FormHelper.testInputStatus('name');
    cy.getByTestId('email').focus().type(faker.internet.email());
    FormHelper.testInputStatus('email');
    const password = faker.internet.password();
    cy.getByTestId('password').focus().type(password);
    FormHelper.testInputStatus('password');
    cy.getByTestId('passwordConfirmation').focus().type(password);
    FormHelper.testInputStatus('passwordConfirmation');
    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present EmailInUseError on 403', () => {
    Http.mockEmailInUseError();
    simulateValidSubmit();
    FormHelper.testMainError('Esse e-mail já está em uso');
    HttpHelper.testUrl('/signup');
  });

  it('Should present UnexpectedError on 400', () => {
    Http.mockUnexpectedError();
    simulateValidSubmit();
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve.',
    );
    HttpHelper.testUrl('/signup');
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
    HttpHelper.testUrl('/signup');
  });
});
