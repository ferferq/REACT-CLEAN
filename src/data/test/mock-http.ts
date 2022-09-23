import faker from 'faker';
import {
  HttpPostParams,
  HttpResponse,
  HttpStatusCode,
  HttpPostClient,
  HttpGetClient,
  HttpGetParams,
} from '@/data/protocols/http';

export class HttpPostClientSpy<R> implements HttpPostClient<R> {
  url?: string;
  body?: any;
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok,
  };

  async post(params: HttpPostParams): Promise<HttpResponse<R>> {
    this.url = params.url;
    this.body = params.body;
    return this.response;
  }
}

export const mockPostRequest = (): HttpPostParams => {
  return {
    url: faker.internet.url(),
    body: faker.random.objectElement(),
  };
};

export const mockGetRequest = (): HttpPostParams => {
  return {
    url: faker.internet.url(),
  };
};

export class HttpGetClientSpy<R> implements HttpGetClient<R> {
  url: string;
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok,
  };

  async get(params: HttpGetParams): Promise<HttpResponse<R>> {
    this.url = params.url;
    return this.response;
  }
}
