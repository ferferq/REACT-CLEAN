import { AccountModel } from '@/domain/models';
import faker from 'faker';
import 'jest-localstorage-mock';
import { LocalStorageAdapter } from './local-storage-adapter';

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter();

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Should call localStorage.setItem with correct values', () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = faker.random.objectElement<Record<string, unknown>>();
    sut.set(key, value);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(value),
    );
  });

  test('Should call localStorage.getItem with correct values', () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = faker.random.objectElement<Record<string, unknown>>();
    const getItemSpy = jest
      .spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(JSON.stringify(value));
    const obj = sut.get(key);
    expect(getItemSpy).toHaveBeenCalledWith(key);
    expect(obj).toEqual(value);
  });
});
