import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class GMailInterceptor implements HttpInterceptor{
    constructor(private route: ActivatedRoute){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem('token');
        //localStorage.removeItem('token');
        if(token){
            return next.handle(req.clone({setHeaders: {'Authorization': `Bearer ${token}`}}))
        }else return next.handle(req);
    }
}