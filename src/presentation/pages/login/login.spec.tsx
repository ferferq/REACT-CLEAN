import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from '@testing-library/react';
import { Login } from './login';
import { ValidationStub, AuthenticationSpy } from '@/presentation/test';
import faker from 'faker';

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Login validation={validationStub} authentication={authenticationSpy} />,
  );

  return {
    sut,
    validationStub,
    authenticationSpy,
  };
};

const simulateValidSubmit = ({
  sut,
  password = faker.internet.password(),
  email = faker.internet.email(),
}): void => {
  populatePasswordField({
    sut,
    password,
  });
  populateEmailField({
    sut,
    email,
  });
  const submitButton = sut.getByTestId('submit');
  fireEvent.click(submitButton);
};

const populateEmailField = ({ sut, email = faker.internet.email() }): void => {
  const emailInput = sut.getByTestId('email');
  fireEvent.input(emailInput, { target: { value: email } });
};

const populatePasswordField = ({
  sut,
  password = faker.internet.password(),
}): void => {
  const passwordInput = sut.getByTestId('password');
  fireEvent.input(passwordInput, {
    target: { value: password },
  });
};

const simulateStatusForField = (
  sut,
  fieldName: string,
  validationError?: string,
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!');
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    const formStatus = sut.getByTestId('error-wrap');
    expect(formStatus.childElementCount).toBe(0);
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    simulateStatusForField(sut, 'email', validationError);
    simulateStatusForField(sut, 'password', validationError);
  });

  test('Should call Validation with correct email', () => {
    const validationError = faker.random.words();
    const { sut, validationStub } = makeSut({ validationError });
    const emailInput = sut.getByTestId('email');
    const email = faker.internet.email();
    const validateMocked = jest.spyOn(validationStub, 'validate');
    fireEvent.input(emailInput, { target: { value: email } });
    expect(validateMocked).toHaveBeenNthCalledWith(1, 'email', email);
  });

  test('Should call Validation with correct password', () => {
    const validationError = faker.random.words();
    const { sut, validationStub } = makeSut({ validationError });
    validationStub.errorMessage = faker.random.words();
    const passwordInput = sut.getByTestId('password');
    const password = faker.internet.password();
    const validateMocked = jest.spyOn(validationStub, 'validate');
    fireEvent.input(passwordInput, { target: { value: password } });
    expect(validateMocked).toHaveBeenNthCalledWith(2, 'password', password);
  });

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    populateEmailField({
      sut,
    });
    simulateStatusForField(sut, 'email', validationError);
  });

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    populatePasswordField({
      sut,
    });
    simulateStatusForField(sut, 'password', validationError);
  });

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();
    populateEmailField({
      sut,
    });
    simulateStatusForField(sut, 'email');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();
    populatePasswordField({
      sut,
    });
    simulateStatusForField(sut, 'password');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();
    populatePasswordField({
      sut,
    });
    populateEmailField({
      sut,
    });
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  test('Should show spinner on submit', () => {
    const { sut } = makeSut();
    simulateValidSubmit({
      sut,
    });
    const spinner = sut.getByTestId('spinner');
    expect(spinner).toBeTruthy();
  });

  test('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut();
    const password = faker.internet.password();
    const email = faker.internet.email();
    simulateValidSubmit({
      sut,
      password,
      email,
    });
    expect(authenticationSpy.params).toEqual({
      email,
      password,
    });
  });

  test('Should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut();
    simulateValidSubmit({
      sut,
    });
    simulateValidSubmit({
      sut,
    });
    expect(authenticationSpy.callsCount).toBe(1);
  });
});
