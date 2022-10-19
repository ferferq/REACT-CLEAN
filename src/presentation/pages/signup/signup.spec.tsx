import faker from 'faker';
import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Signup } from './signup';
import { Helper, ValidationStub } from '@/presentation/test';
import {
  populateField,
  testNthCalledWithValidateMocked,
} from '@/presentation/test/form-helper';
import { AddAccountSpy } from '@/presentation/test/mock-add-account';
import { EmailInUseError, InvalidCredentialsError } from '@/domain/errors';
import ApiContext from '@/presentation/contexts/api/api-context';
import { AddAccount } from '@/domain/usecases';

const history = createMemoryHistory({
  initialEntries: ['/login'],
});

type SutTypes = {
  validationStub: ValidationStub;
  addAccountSpy: AddAccountSpy;
  setCurrentAccountMock: (account: AddAccount.Params) => void;
};

type SutParams = {
  validationError?: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const addAccountSpy = new AddAccountSpy();
  validationStub.errorMessage = params?.validationError;
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router location={history.location} navigator={history}>
        <Signup validation={validationStub} addAccount={addAccountSpy} />
      </Router>
      ,
    </ApiContext.Provider>,
  );

  return {
    validationStub,
    addAccountSpy,
    setCurrentAccountMock,
  };
};

const nthCalled = 4;
const valuesFieldsClear = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

const simulateValidSubmit = ({
  name = faker.name.firstName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
  passwordConfirmation = faker.internet.password(),
}): void => {
  populateField({
    fieldName: 'name',
    value: name,
  });
  populateField({
    fieldName: 'email',
    value: email,
  });
  populateField({
    fieldName: 'password',
    value: password,
  });
  populateField({
    fieldName: 'passwordConfirmation',
    value: passwordConfirmation,
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
    Helper.testStatusForField('name', validationError);
    Helper.testStatusForField('email', validationError);
    Helper.testStatusForField('password', validationError);
    Helper.testStatusForField('passwordConfirmation', validationError);
  });

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populateField({
      fieldName: 'name',
    });
    Helper.testStatusForField('name', validationError);
  });

  test('Should call Validation with correct to name', () => {
    const validationError = faker.random.words();
    const { validationStub } = makeSut({ validationError });
    const name = faker.name.firstName();
    testNthCalledWithValidateMocked(
      validationStub,
      nthCalled,
      'name',
      name,
      1,
      [
        'name',
        {
          ...valuesFieldsClear,
          name,
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

  test('Should call Validation with correct to email', () => {
    const validationError = faker.random.words();
    const { validationStub } = makeSut({ validationError });
    const email = faker.internet.email();
    testNthCalledWithValidateMocked(
      validationStub,
      nthCalled,
      'email',
      email,
      2,
      [
        'email',
        {
          ...valuesFieldsClear,
          email,
        },
      ],
    );
  });

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populateField({
      fieldName: 'password',
    });
    Helper.testStatusForField('password', validationError);
  });

  test('Should call Validation with correct to password', () => {
    const validationError = faker.random.words();
    const { validationStub } = makeSut({ validationError });
    const password = faker.internet.password();
    testNthCalledWithValidateMocked(
      validationStub,
      nthCalled,
      'password',
      password,
      3,
      [
        'password',
        {
          ...valuesFieldsClear,
          password,
        },
      ],
    );
  });

  test('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populateField({
      fieldName: 'passwordConfirmation',
    });
    Helper.testStatusForField('passwordConfirmation', validationError);
  });

  test('Should call Validation with correct to passwordConfirmation', () => {
    const validationError = faker.random.words();
    const { validationStub } = makeSut({ validationError });
    const passwordConfirmation = faker.internet.password();
    testNthCalledWithValidateMocked(
      validationStub,
      nthCalled,
      'passwordConfirmation',
      passwordConfirmation,
      4,
      ['passwordConfirmation', { ...valuesFieldsClear, passwordConfirmation }],
    );
  });

  test('Should show valid status if validation name is succeeds', () => {
    makeSut({});
    populateField({
      fieldName: 'name',
    });
    Helper.testStatusForField('name');
  });

  test('Should show valid status if validation password is succeeds', () => {
    makeSut({});
    populateField({
      fieldName: 'password',
    });
    Helper.testStatusForField('password');
  });

  test('Should show valid status if validation passwordConfirmation is succeeds', () => {
    makeSut({});
    populateField({
      fieldName: 'passwordConfirmation',
    });
    Helper.testStatusForField('passwordConfirmation');
  });

  test('Should enable submit button if form is valid', () => {
    makeSut();
    populateField({
      fieldName: 'name',
    });
    populateField({
      fieldName: 'email',
    });
    populateField({
      fieldName: 'password',
    });
    populateField({
      fieldName: 'passwordConfirmation',
    });
    expect(screen.getByTestId('submit')).toBeEnabled();
  });

  test('Should show spinner on submit', () => {
    makeSut();
    simulateValidSubmit({});
    expect(screen.queryByTestId('spinner')).toBeInTheDocument();
  });

  test('Should call AddAccount with correct values', () => {
    const { addAccountSpy } = makeSut();
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    simulateValidSubmit({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
  });

  test('Should call Authentication only once', () => {
    const { addAccountSpy } = makeSut();
    simulateValidSubmit({});
    simulateValidSubmit({});
    expect(addAccountSpy.callsCount).toBe(1);
  });

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words();
    const { addAccountSpy } = makeSut({ validationError });
    simulateValidSubmit({});
    expect(addAccountSpy.callsCount).toBe(0);
  });

  test('Should present error if Authentication fails', async () => {
    const { addAccountSpy } = makeSut();
    const error = new EmailInUseError();
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);
    simulateValidSubmit({});
    await waitFor(() => {
      expect(screen.getByTestId('error-wrap').children).toHaveLength(1);
      expect(screen.getByTestId('main-error')).toHaveTextContent(error.message);
    });
  });

  test('Should call UpdateCurrentAccount success', async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSut();
    simulateValidSubmit({});
    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account);
      expect(history.location.pathname).toBe('/');
      expect(history.index).toBe(0);
    });
  });

  test('Should present error if UpdateCurrentAccount fails', async () => {
    const { addAccountSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);
    simulateValidSubmit({});
    await waitFor(() => {
      expect(screen.getByTestId('error-wrap').children).toHaveLength(1);
      expect(screen.getByTestId('main-error')).toHaveTextContent(error.message);
    });
  });

  test('Should go to login page', () => {
    makeSut();
    const loginLink = screen.getByTestId('login-link');
    fireEvent.click(loginLink);
    expect(history.location.pathname).toBe('/login');
    expect(history.index).toBe(0);
  });
});
