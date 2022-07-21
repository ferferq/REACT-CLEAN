import { fireEvent, RenderResult } from '@testing-library/react';
import faker from 'faker';
import { ValidationStub } from './mock-validation';

export const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  count: number,
): void => {
  const element = sut.getByTestId(fieldName);
  expect(element.childElementCount).toBe(count);
};

export const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean,
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const testStatusForField = (
  sut,
  fieldName: string,
  validationError = '',
): void => {
  const field = sut.getByTestId(fieldName);
  const wrap = sut.getByTestId(`${fieldName}-wrap`);
  const label = sut.getByTestId(`${fieldName}-label`);
  expect(wrap.getAttribute('data-status')).toBe(
    validationError ? 'invalid' : 'valid',
  );
  expect(field.title).toBe(validationError);
  expect(label.title).toBe(validationError);
};

type populateFieldProps = {
  sut: RenderResult;
  fieldName: string;
  value?: string;
};

export const populateField = ({
  sut,
  fieldName,
  value = faker.internet.password(),
}: populateFieldProps): void => {
  const elementInput = sut.getByTestId(fieldName);
  fireEvent.input(elementInput, {
    target: { value: value },
  });
};

export const testNthCalledWithValidateMocked = (
  sut: RenderResult,
  validationStub: ValidationStub,
  nthCalled: number,
  fieldName: string,
  valueInput: string,
  nthCalledPosition: number,
  valuesCalled?: any[],
): void => {
  const element = sut.getByTestId(fieldName);
  const validateMocked = jest.spyOn(validationStub, 'validate');
  fireEvent.input(element, { target: { value: valueInput } });
  expect(validateMocked).toHaveBeenNthCalledWith(
    nthCalledPosition,
    ...valuesCalled,
  );
  expect(validateMocked).toBeCalledTimes(nthCalled);
};

export const testElementExists = (
  sut: RenderResult,
  fieldName: string,
): void => {
  const element = sut.getByTestId(fieldName);
  expect(element).toBeTruthy();
};

export const testElementText = (
  sut: RenderResult,
  fieldName: string,
  text: string,
): void => {
  const element = sut.getByTestId(fieldName);
  expect(element.textContent).toBe(text);
};
