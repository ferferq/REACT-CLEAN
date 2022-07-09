import faker from 'faker';
import React from 'react';
import { cleanup, render, RenderResult } from '@testing-library/react';
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

  test('Should show valid status if validation email is succeeds', () => {
    const { sut } = makeSut({});
    populateField({
      sut,
      fieldName: 'email',
    });
    Helper.testStatusForField(sut, 'email');
  });
});
