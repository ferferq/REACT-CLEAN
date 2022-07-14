import faker from 'faker';
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
import { Signup } from './signup';
import {
  Helper,
  SaveAccessTokenMock,
  ValidationStub,
} from '@/presentation/test';
import {
  populateField,
  testElementExists,
  testNthCalledWithValidateMocked,
} from '@/presentation/test/form-helper';
import { AddAccountSpy } from '@/presentation/test/mock-add-account';
import { EmailInUseError, InvalidCredentialsError } from '@/domain/errors';

const history = createMemoryHistory({
  initialEntries: ['/login'],
});

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
  addAccountSpy: AddAccountSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError?: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const addAccountSpy = new AddAccountSpy();
  validationStub.errorMessage = params?.validationError;
  const saveAccessTokenMock = new SaveAccessTokenMock();
  const sut = render(
    <Router location={history.location} navigator={history}>
      <Signup
        validation={validationStub}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>,
  );

  return {
    sut,
    validationStub,
    addAccountSpy,
    saveAccessTokenMock,
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
  sut,
  name = faker.name.firstName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
  passwordConfirmation = faker.internet.password(),
}): void => {
  populateField({
    sut,
    fieldName: 'name',
    value: name,
  });
  populateField({
    sut,
    fieldName: 'email',
    value: email,
  });
  populateField({
    sut,
    fieldName: 'password',
    value: password,
  });
  populateField({
    sut,
    fieldName: 'passwordConfirmation',
    value: passwordConfirmation,
  });
  const form = sut.getByTestId('form');
  fireEvent.submit(form);
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    Helper.testChildCount(sut, 'error-wrap', 0);
    Helper.testButtonIsDisabled(sut, 'submit', true);
    Helper.testStatusForField(sut, 'name', validationError);
    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
  });

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    populateField({
      sut,
      fieldName: 'name',
    });
    Helper.testStatusForField(sut, 'name', validationError);
  });

  test('Should call Validation with correct to name', () => {
    const validationError = faker.random.words();
    const { sut, validationStub } = makeSut({ validationError });
    const name = faker.name.firstName();
    testNthCalledWithValidateMocked(
      sut,
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
    const { sut } = makeSut({ validationError });
    populateField({
      sut,
      fieldName: 'email',
    });
    Helper.testStatusForField(sut, 'email', validationError);
  });

  test('Should call Validation with correct to email', () => {
    const validationError = faker.random.words();
    const { sut, validationStub } = makeSut({ validationError });
    const email = faker.internet.email();
    testNthCalledWithValidateMocked(
      sut,
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
    const { sut } = makeSut({ validationError });
    populateField({
      sut,
      fieldName: 'password',
    });
    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('Should call Validation with correct to password', () => {
    const validationError = faker.random.words();
    const { sut, validationStub } = makeSut({ validationError });
    const password = faker.internet.password();
    testNthCalledWithValidateMocked(
      sut,
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
    const { sut } = makeSut({ validationError });
    populateField({
      sut,
      fieldName: 'passwordConfirmation',
    });
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
  });

  test('Should call Validation with correct to passwordConfirmation', () => {
    const validationError = faker.random.words();
    const { sut, validationStub } = makeSut({ validationError });
    const passwordConfirmation = faker.internet.password();
    testNthCalledWithValidateMocked(
      sut,
      validationStub,
      nthCalled,
      'passwordConfirmation',
      passwordConfirmation,
      4,
      ['passwordConfirmation', { ...valuesFieldsClear, passwordConfirmation }],
    );
  });

  test('Should show valid status if validation name is succeeds', () => {
    const { sut } = makeSut({});
    populateField({
      sut,
      fieldName: 'name',
    });
    Helper.testStatusForField(sut, 'name');
  });

  test('Should show valid status if validation password is succeeds', () => {
    const { sut } = makeSut({});
    populateField({
      sut,
      fieldName: 'password',
    });
    Helper.testStatusForField(sut, 'password');
  });

  test('Should show valid status if validation passwordConfirmation is succeeds', () => {
    const { sut } = makeSut({});
    populateField({
      sut,
      fieldName: 'passwordConfirmation',
    });
    Helper.testStatusForField(sut, 'passwordConfirmation');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();
    populateField({
      sut,
      fieldName: 'name',
    });
    populateField({
      sut,
      fieldName: 'email',
    });
    populateField({
      sut,
      fieldName: 'password',
    });
    populateField({
      sut,
      fieldName: 'passwordConfirmation',
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

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountSpy } = makeSut();
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    simulateValidSubmit({
      sut,
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
    const { sut, addAccountSpy } = makeSut();
    simulateValidSubmit({
      sut,
    });
    simulateValidSubmit({
      sut,
    });
    expect(addAccountSpy.callsCount).toBe(1);
  });

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words();
    const { sut, addAccountSpy } = makeSut({ validationError });
    simulateValidSubmit({
      sut,
    });
    expect(addAccountSpy.callsCount).toBe(0);
  });

  test('Should present error if Authentication fails', async () => {
    const { sut, addAccountSpy } = makeSut();
    const error = new EmailInUseError();
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);
    simulateValidSubmit({
      sut,
    });
    await waitFor(() => {
      Helper.testChildCount(sut, 'error-wrap', 1);
      Helper.testElementText(sut, 'main-error', error.message);
    });
  });

  test('Should call SaveAccessToken success', async () => {
    const { sut, addAccountSpy, saveAccessTokenMock } = makeSut();
    simulateValidSubmit({
      sut,
    });
    await waitFor(() => {
      expect(saveAccessTokenMock.accessToken).toBe(
        addAccountSpy.account.accessToken,
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
      Helper.testElementText(sut, 'main-error', error.message);
    });
  });

  test('Should go to login page', () => {
    const { sut } = makeSut();
    const loginLink = sut.getByTestId('login-link');
    fireEvent.click(loginLink);
    expect(history.location.pathname).toBe('/login');
    expect(history.index).toBe(0);
  });
});
