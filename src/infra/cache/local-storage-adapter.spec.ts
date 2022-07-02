import { cleanup } from '@testing-library/react';
import faker from 'faker';
import 'jest-localstorage-mock';
import { LocalStorageAdapter } from './local-storage-adapter';

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter();

describe('LocalStorageAdapter', () => {
  afterEach(cleanup);

  beforeEach(() => {
    localStorage.clear();
  });

  test('Should call localStorage with correct values', async () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = faker.random.words();
    await sut.set(key, value);
    expect(localStorage.setItem).toHaveBeenCalledWith(key, value);
  });
});
