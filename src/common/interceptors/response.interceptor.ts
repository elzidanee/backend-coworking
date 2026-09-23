import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        status: true,
        statusCode,
        message: data?.message ?? 'Berhasil memproses permintaan',
        data: data?.result !== undefined ? data.result : data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}