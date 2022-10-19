import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Login } from '@/presentation/pages/login';
import { ValidationStub, AuthenticationSpy, Helper } from '@/presentation/test';
import faker from 'faker';
import { InvalidCredentialsError } from '@/domain/errors';
import {
  populateField,
  testNthCalledWithValidateMocked,
} from '@/presentation/test/form-helper';
import ApiContext from '@/presentation/contexts/api/api-context';
import { Authentication } from '@/domain/usecases';

type SutTypes = {
  validationStub: ValidationStub;
  authenticationSpy: AuthenticationSpy;
  setCurrentAccountMock: (account: Authentication.Params) => void;
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
  validationStub.errorMessage = params?.validationError;
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router location={history.location} navigator={history}>
        <Login validation={validationStub} authentication={authenticationSpy} />
      </Router>
    </ApiContext.Provider>,
  );

  return {
    validationStub,
    authenticationSpy,
    setCurrentAccountMock,
  };
};

const simulateValidSubmit = ({
  password = faker.internet.password(),
  email = faker.internet.email(),
}): void => {
  populateField({
    fieldName: 'password',
    value: password,
  });
  populateField({
    fieldName: 'email',
    value: email,
  });
  const form = screen.getByTestId('form');
  fireEvent.submit(form);
};

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0);
    expect(screen.getByTestId('submit')).toBeDisabled();
    Helper.testStatusForField('email', validationError);
    Helper.testStatusForField('password', validationError);
  });

  test('Should call Validation with correct email', () => {
    const validationError = faker.random.words();
    const { validationStub } = makeSut({ validationError });
    const email = faker.internet.email();
    testNthCalledWithValidateMocked(validationStub, 2, 'email', email, 1, [
      'email',
      {
        email,
        password: '',
      },
    ]);
  });

  test('Should call Validation with correct password', () => {
    const validationError = faker.random.words();
    const { validationStub } = makeSut({ validationError });
    validationStub.errorMessage = faker.random.words();
    const password = faker.internet.password();
    testNthCalledWithValidateMocked(
      validationStub,
      2,
      'password',
      password,
      2,
      [
        'password',
        {
          email: '',
          password,
        },
      ],
    );
  });

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populateField({
      fieldName: 'email',
    });
    Helper.testStatusForField('email', validationError);
  });

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populateField({
      fieldName: 'password',
    });
    Helper.testStatusForField('password', validationError);
  });

  test('Should show valid email state if Validation succeeds', () => {
    makeSut();
    populateField({
      fieldName: 'email',
    });
    Helper.testStatusForField('email');
  });

  test('Should show valid password state if Validation succeeds', () => {
    makeSut();
    populateField({
      fieldName: 'password',
    });
    Helper.testStatusForField('password');
  });

  test('Should enable submit button if form is valid', () => {
    makeSut();
    populateField({
      fieldName: 'password',
    });
    populateField({
      fieldName: 'email',
    });
    expect(screen.getByTestId('submit')).toBeEnabled();
  });

  test('Should show spinner on submit', () => {
    makeSut();
    simulateValidSubmit({});
    expect(screen.queryByTestId('spinner')).toBeInTheDocument();
  });

  test('Should call Authentication with correct values', () => {
    const { authenticationSpy } = makeSut();
    const password = faker.internet.password();
    const email = faker.internet.email();
    simulateValidSubmit({
      password,
      email,
    });
    expect(authenticationSpy.params).toEqual({
      email,
      password,
    });
  });

  test('Should call Authentication only once', () => {
    const { authenticationSpy } = makeSut();
    simulateValidSubmit({});
    simulateValidSubmit({});
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words();
    const { authenticationSpy } = makeSut({ validationError });
    simulateValidSubmit({});
    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('Should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error);
    simulateValidSubmit({});
    await waitFor(() => {
      expect(screen.getByTestId('error-wrap').children).toHaveLength(1);
      expect(screen.getByTestId('main-error')).toHaveTextContent(error.message);
    });
  });

  test('Should call UpdateCurrentAccount success', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut();
    simulateValidSubmit({});
    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(
        authenticationSpy.account,
      );
      expect(history.location.pathname).toBe('/');
      expect(history.index).toBe(0);
    });
  });

  test('Should present error if UpdateCurrentAccount fails', async () => {
    const { authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error);
    simulateValidSubmit({});
    await waitFor(() => {
      expect(screen.getByTestId('error-wrap').children).toHaveLength(1);
      expect(screen.getByTestId('main-error')).toHaveTextContent(error.message);
    });
  });

  test('Should go to signup page', () => {
    makeSut();
    const signup = screen.getByTestId('signup');
    fireEvent.click(signup);
    expect(history.location.pathname).toBe('/signup');
    expect(history.index).toBe(0);
  });
});
