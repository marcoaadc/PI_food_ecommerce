import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Erro interno do servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string | string[]) ?? exception.message;
      }
    } else {
      const err = exception instanceof Error ? exception : new Error(String(exception));
      this.logger.error(err.message, err.stack);
    }

    if (this.isPrismaError(exception)) {
      const result = this.handlePrismaError(exception as PrismaError);
      status = result.status;
      message = result.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private isPrismaError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as PrismaError).code === 'string' &&
      (exception as PrismaError).code.startsWith('P')
    );
  }

  private handlePrismaError(error: PrismaError) {
    switch (error.code) {
      case 'P2002':
        return { status: HttpStatus.CONFLICT, message: 'Registro já existe' };
      case 'P2025':
        return { status: HttpStatus.NOT_FOUND, message: 'Registro não encontrado' };
      default:
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Erro no banco de dados' };
    }
  }
}

interface PrismaError {
  code: string;
  meta?: Record<string, unknown>;
}
