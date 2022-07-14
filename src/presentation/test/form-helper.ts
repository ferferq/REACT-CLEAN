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
  validationError?: string,
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!');
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢');
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
  nthCalledPosition = 1,
): void => {
  const element = sut.getByTestId(fieldName);
  const validateMocked = jest.spyOn(validationStub, 'validate');
  fireEvent.input(element, { target: { value: valueInput } });
  expect(validateMocked).toHaveBeenNthCalledWith(
    nthCalledPosition,
    fieldName,
    valueInput,
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
