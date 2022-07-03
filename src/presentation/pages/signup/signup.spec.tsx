import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import faker from 'faker';
import { Signup } from './signup';

const makeSut = (): RenderResult => {
  return render(<Signup />);
};

const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  count: number,
): void => {
  const element = sut.getByTestId(fieldName);
  expect(element.childElementCount).toBe(count);
};

const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean,
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

const testStatusForField = (
  sut,
  fieldName: string,
  validationError?: string,
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!');
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = 'Campo obrigatório';
    const sut = makeSut();
    testChildCount(sut, 'error-wrap', 0);
    testButtonIsDisabled(sut, 'submit', true);
    testStatusForField(sut, 'name', validationError);
    testStatusForField(sut, 'email', validationError);
    testStatusForField(sut, 'password', validationError);
    testStatusForField(sut, 'passwordConfirmation', validationError);
  });
});
