import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

/**
 * To put the class validator error message
 * into bigger scope
 */

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      if (exception?.response?.message)
        exception.message = exception?.response?.message;
      throw exception;
    }
    super.catch(exception, host);
  }
}

// const ctx = host.switchToHttp();
