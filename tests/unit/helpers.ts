import { mock, type Mock } from 'node:test';
import type { Request, Response } from 'express';

// A fake Express response that records calls to status() and json()
export interface MockResponse {
  headersSent: boolean;
  subscriber?: unknown;
  status: Mock<(code: number) => MockResponse>;
  json: Mock<(body: unknown) => MockResponse>;
}

export const mockResponse = (): MockResponse => {
  const res: MockResponse = {
    headersSent: false,
    status: mock.fn((_code: number) => res),
    json: mock.fn((_body: unknown) => res)
  };
  return res;
};

// Middleware expects full Express objects; the fakes only have what our code uses
export const asRequest = <P = Request['params']>(req: object) => req as Request<P>;
export const asResponse = (res: MockResponse) => res as unknown as Response;

// Arguments of the first call to a mock function
export const firstCallArgs = <F extends (...args: any[]) => unknown>(fn: Mock<F>) =>
  fn.mock.calls[0].arguments;
