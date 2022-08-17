import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = exception.response?.message || exception.message || 'Internal Server Error';

        message = Array.isArray(message) ? message.join('. ') : message;

        return response.status(status).json({
            responseStatus: {
                success: false,
                errorCode: exception.code || status,
                errorMessage: message,
                error: {
                    name: exception.constructor.name,
                    message: message,
                    stacktrace: exception.stack,
                },
                timeStamp: Date.now(),
            },
            body: null,
        });
    }
}