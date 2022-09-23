import { fireEvent, screen } from '@testing-library/react';
import faker from 'faker';
import { ValidationStub } from './mock-validation';

export const testStatusForField = (
  fieldName: string,
  validationError = '',
): void => {
  const field = screen.getByTestId(fieldName);
  const wrap = screen.getByTestId(`${fieldName}-wrap`);
  const label = screen.getByTestId(`${fieldName}-label`);
  expect(wrap).toHaveAttribute(
    'data-status',
    validationError ? 'invalid' : 'valid',
  );
  expect(field).toHaveProperty('title', validationError);
  expect(label).toHaveProperty('title', validationError);
};

type populateFieldProps = {
  fieldName: string;
  value?: string;
};

export const populateField = ({
  fieldName,
  value = faker.internet.password(),
}: populateFieldProps): void => {
  const elementInput = screen.getByTestId(fieldName);
  fireEvent.input(elementInput, {
    target: { value: value },
  });
};

export const testNthCalledWithValidateMocked = (
  validationStub: ValidationStub,
  nthCalled: number,
  fieldName: string,
  valueInput: string,
  nthCalledPosition: number,
  valuesCalled?: any[],
): void => {
  const element = screen.getByTestId(fieldName);
  const validateMocked = jest.spyOn(validationStub, 'validate');
  fireEvent.input(element, { target: { value: valueInput } });
  expect(validateMocked).toHaveBeenNthCalledWith(
    nthCalledPosition,
    ...valuesCalled,
  );
  expect(validateMocked).toBeCalledTimes(nthCalled);
};
