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
  testNthCalledWithValidateMocked,
} from '@/presentation/test/form-helper';

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

type SutParams = {
  validationError?: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const sut = render(<Signup validation={validationStub} />);

  return {
    sut,
    validationStub,
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

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const element = sut.getByTestId(fieldName);
  expect(element).toBeTruthy();
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
});
