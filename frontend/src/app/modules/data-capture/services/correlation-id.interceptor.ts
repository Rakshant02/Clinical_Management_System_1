
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorrelationIdInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cid = crypto.randomUUID();
    const cloned = req.clone({ setHeaders: { 'X-Correlation-ID': cid }});
    return next.handle(cloned);
  }
}
