import faker from 'faker';
import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from '@testing-library/react';
import { Signup } from './signup';
import { Helper, ValidationStub } from '@/presentation/test';
import {
  populateField,
  testElementExists,
  testNthCalledWithValidateMocked,
} from '@/presentation/test/form-helper';
import { AddAccountSpy } from '@/presentation/test/mock-add-account';

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
  addAccountSpy: AddAccountSpy;
};

type SutParams = {
  validationError?: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const addAccountSpy = new AddAccountSpy();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Signup validation={validationStub} addAccount={addAccountSpy} />,
  );

  return {
    sut,
    validationStub,
    addAccountSpy,
  };
};

const nthCalled = 4;

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

  test('Should call Validation with correct to email', () => {
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

  test('Should call Validation with correct to email', () => {
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
});
