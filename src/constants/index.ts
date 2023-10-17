import { ResponseData } from '../models';

export enum REQUEST_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum RESPONSE_STATUS {
  Ok = 200,
  Created = 201,
  Deleted = 204,
  InvalidField = 400,
  NotFound = 404,
  ServerError = 500,
}

export const SERVER_SIDE_ERR_RESP: ResponseData = {
  respStatusCode: RESPONSE_STATUS.ServerError,
  respData: 'Oops! Something went wrong. Try again',
};

export const HOSTNAME = '127.0.0.1';
