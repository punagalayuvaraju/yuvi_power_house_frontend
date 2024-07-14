import { Inject, Injectable } from '@angular/core';
export const BLOBPATHS = ['/print_shift_reports'];
export const FORMDATAPATHS = ['/purchase_orders/upload'];
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorService implements HttpInterceptorService {
  constructor(private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token') || '';
    //  let blobContentType  : boolean = false
    //  let formDataContentType  : boolean = false

    // BLOBPATHS.forEach(str=>{
    //      if(req.url.includes(str)){
    //        blobContentType = true;
    //      }
    //   }
    // )

    //     FORMDATAPATHS.forEach(str=>{
    //       if(req.url.includes(str)){
    //         formDataContentType = true;
    //       }
    //    }
    //  )

    const authReq = req.clone({
      // withCredentials: true,
      headers: new HttpHeaders().set('token', token),
      // headers: new HttpHeaders()
      //   .set('Content-Type', !!blobContentType ? 'blob': !!formDataContentType ?  temp :'application/json')
    });
    return next.handle(authReq).pipe(
      map((event: any) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let options = {
          autoClose: true,
          keepAfterRouteChange: false,
        };
        // this.alertService.error(error && error.error && error.error.detail ? error.error.detail : '', options);
        if (error?.status == 401) {
          sessionStorage.clear();
          this.router.navigate(['']);
          // this.alertService.error('Session Expired', options);
        } else {
          // this.alertService.error(error && error.error && error.error.detail ? error.error.detail : '', options);
        }
        return throwError(error);
      })
    );
  }
}
