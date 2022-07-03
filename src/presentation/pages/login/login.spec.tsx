import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { Login } from '@/presentation/pages/login';
import {
  ValidationStub,
  AuthenticationSpy,
  SaveAccessTokenMock,
  Helper,
} from '@/presentation/test';
import faker from 'faker';
import { InvalidCredentialsError } from '@/domain/errors';

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
  authenticationSpy: AuthenticationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError?: string;
};

const history = createMemoryHistory({
  initialEntries: ['/login'],
});
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  const saveAccessTokenMock = new SaveAccessTokenMock();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Router location={history.location} navigator={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>,
  );

  return {
    sut,
    validationStub,
    authenticationSpy,
    saveAccessTokenMock,
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
  const form = sut.getByTestId('form');
  fireEvent.submit(form);
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

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const element = sut.getByTestId(fieldName);
  expect(element).toBeTruthy();
};

const testElementText = (
  sut: RenderResult,
  fieldName: string,
  text: string,
): void => {
  const element = sut.getByTestId(fieldName);
  expect(element.textContent).toBe(text);
};

const testNthCalledWithValidateMocked = (
  sut: RenderResult,
  validationStub: ValidationStub,
  nthCalled: number,
  fieldName: string,
  valueInput: string,
): void => {
  const element = sut.getByTestId(fieldName);
  const validateMocked = jest.spyOn(validationStub, 'validate');
  fireEvent.input(element, { target: { value: valueInput } });
  expect(validateMocked).toHaveBeenNthCalledWith(
    nthCalled,
    fieldName,
    valueInput,
  );
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    Helper.testChildCount(sut, 'error-wrap', 0);
    Helper.testButtonIsDisabled(sut, 'submit', true);
    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('Should call Validation with correct email', () => {
    const validationError = faker.random.words();
    const { sut, validationStub } = makeSut({ validationError });
    const email = faker.internet.email();
    testNthCalledWithValidateMocked(sut, validationStub, 1, 'email', email);
  });

  test('Should call Validation with correct password', () => {
    const validationError = faker.random.words();
    const { sut, validationStub } = makeSut({ validationError });
    validationStub.errorMessage = faker.random.words();
    const password = faker.internet.password();
    testNthCalledWithValidateMocked(
      sut,
      validationStub,
      2,
      'password',
      password,
    );
  });

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    populateEmailField({
      sut,
    });
    Helper.testStatusForField(sut, 'email', validationError);
  });

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    populatePasswordField({
      sut,
    });
    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();
    populateEmailField({
      sut,
    });
    Helper.testStatusForField(sut, 'email');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();
    populatePasswordField({
      sut,
    });
    Helper.testStatusForField(sut, 'password');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();
    populatePasswordField({
      sut,
    });
    populateEmailField({
      sut,
    });
    Helper.testButtonIsDisabled(sut, 'submit', false);
  });

  test('Should show spinner on submit', () => {
    const { sut } = makeSut();
    simulateValidSubmit({
      sut,
    });
    testElementExists(sut, 'spinner');
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

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });
    simulateValidSubmit({
      sut,
    });
    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error);
    simulateValidSubmit({
      sut,
    });
    await waitFor(() => {
      Helper.testChildCount(sut, 'error-wrap', 1);
      testElementText(sut, 'main-error', error.message);
    });
  });

  test('Should call SaveAccessToken success', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();
    simulateValidSubmit({
      sut,
    });
    await waitFor(() => {
      expect(saveAccessTokenMock.accessToken).toBe(
        authenticationSpy.account.accessToken,
      );
      expect(history.location.pathname).toBe('/');
      expect(history.index).toBe(0);
    });
  });

  test('Should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error);
    simulateValidSubmit({
      sut,
    });
    await waitFor(() => {
      Helper.testChildCount(sut, 'error-wrap', 1);
      testElementText(sut, 'main-error', error.message);
    });
  });

  test('Should go to signup page', () => {
    const { sut } = makeSut();
    const signup = sut.getByTestId('signup');
    fireEvent.click(signup);
    expect(history.location.pathname).toBe('/signup');
    expect(history.index).toBe(1);
  });
});
