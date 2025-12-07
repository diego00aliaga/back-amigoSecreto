import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { isEmpty, map } from 'lodash';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const Header = createParamDecorator(
  async (type: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const headers = plainToInstance(type, req.headers);
    const validationError: ValidationError[] = await validate(headers);
    if (!isEmpty(validationError)) {
      const errors = map(validationError, (e: ValidationError) =>
        Object.values(e.constraints ?? {}),
      );
      const response = {
        code: 400,
        message: 'Bad Request',
        businessMessage: 'Bad Request',
        businessCode: 'BAD_REQUEST',
        payload: {
          error: errors,
        },
      };
      throw new BadRequestException(response);
    }
    return headers;
  },
);
