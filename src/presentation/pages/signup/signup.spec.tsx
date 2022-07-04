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
import { populateField } from '@/presentation/test/form-helper';

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
    Helper.testStatusForField(sut, 'name', validationError);
    Helper.testStatusForField(sut, 'email', 'Campo obrigatório');
    Helper.testStatusForField(sut, 'password', 'Campo obrigatório');
    Helper.testStatusForField(sut, 'passwordConfirmation', 'Campo obrigatório');
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
    testNthCalledWithValidateMocked(sut, validationStub, 1, 'name', name);
  });
});
