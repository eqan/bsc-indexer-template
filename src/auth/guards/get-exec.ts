import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage, OutgoingMessage } from 'http';
import { GqlExecutionContext } from '@nestjs/graphql';

export function GetExecutionContext(headerName?: string): ParameterDecorator {
  return createParamDecorator((data: any, context: ExecutionContext) => {
    // const ctx = GqlExecutionContext.create(context);
    // const res = ctx.getContext().res as OutgoingMessage;
    return context;
  })();
}
