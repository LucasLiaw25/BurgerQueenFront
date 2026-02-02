import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivateRequest, LoginRequest, LoginResponse, UserRequest } from '../models/user.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    constructor(private http:HttpClient){}

    private apiUrl = "http://localhost:8080/api";

    createUser(request:UserRequest):Observable<UserRequest>{
      return this.http.post<UserRequest>(`${this.apiUrl}/users/register`, request);
    }

    login(request:LoginRequest):Observable<LoginResponse>{
      return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, request);
    }

    activateUser(request:ActivateRequest):Observable<any>{
      return this.http.post(`${this.apiUrl}/users/activate`, request);
    }

    validateToken():Observable<boolean>{
      const token = this.getToken();
      console.log("Token resgatado: ", token);

      if(!token){
        console.log("Erro ao resgatar o token");
        return of(false);
      }

      const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

      return this.http.head(`${this.apiUrl}/users/validate`, {
        headers: headers,
        observe: 'response',
        responseType: 'text'
      })
      .pipe(
        map(response => response.status===200),
        catchError((error)=>{
          console.log("Erro ao validar o token", error);
          localStorage.removeItem('token');
          return of(false);
        })
      );
    }

    getToken():string|null{
      return localStorage.getItem('token');
    }

    isAuthenticate():boolean{
      return !!this.getToken();
    }

    logOut():void{
      localStorage.removeItem('token');
    }

}
