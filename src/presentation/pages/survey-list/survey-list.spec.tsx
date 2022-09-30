import React from 'react';
import {
  getByRole,
  getByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { SurveyList } from './survey-list';
import { LoadSurveyList } from '@/domain/usecases/load-survey-list';
import { SurveyModel } from '@/domain/models';
import { mockSurvetListModel } from '@/domain/test';

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0;
  surveys = mockSurvetListModel();
  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++;
    return this.surveys;
  }
}

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyListSpy = new LoadSurveyListSpy();
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />);

  return {
    loadSurveyListSpy,
  };
};

describe('SurveyList page', () => {
  test('should present 4 empty items on start', async () => {
    makeSut();
    const surveyList = screen.getByTestId('survey-list');
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
    await waitFor(() => surveyList);
  });

  test('should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);
    await waitFor(() => screen.getByRole('heading'));
  });

  test('should render SurveyItems on success', async () => {
    makeSut();
    const surveyList = screen.getByTestId('survey-list');
    await waitFor(() => {
      expect(surveyList.querySelectorAll('li.SurveyItemWrap')).toHaveLength(3);
    });
  });
});
