import { HttpStatus } from '@nestjs/common';

export interface IResponse<T> {
  code: HttpStatus;
  message: string;
  businessMessage: string;
  businessCode: string;
  payload: T;
}
