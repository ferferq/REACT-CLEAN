import faker from 'faker';
import {
  HttpPostParams,
  HttpResponse,
  HttpStatusCode,
  HttpPostClient,
  HttpGetClient,
  HttpGetParams,
} from '@/data/protocols/http';

export class HttpPostClientSpy<R = any> implements HttpPostClient<R> {
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

export const mockGetRequest = (): HttpGetParams => {
  return {
    url: faker.internet.url(),
    headers: faker.random.objectElement(),
  };
};

export class HttpGetClientSpy<R = any> implements HttpGetClient<R> {
  url: string;
  headers?: any;
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok,
  };

  async get(params: HttpGetParams): Promise<HttpResponse<R>> {
    this.url = params.url;
    this.headers = params.headers;
    return this.response;
  }
}
