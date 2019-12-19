import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { User } from "../interfaces/user.model";
import { Term } from "../interfaces/term.model";
import "rxjs/add/operator/do";
import "rxjs/add/operator/toPromise";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  check(): boolean {
    return localStorage.getItem("user") ? true : false;
  }
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, credentials)
      .do(data => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", btoa(JSON.stringify(data.user)));
        localStorage.setItem("requestor", btoa(JSON.stringify(data.requestor)));
      });
  }
  logout() {
    return this.http.get(`${environment.apiUrl}/auth/logout`);
  }
  getTerm(): Term {
    return localStorage.getItem("term")
      ? JSON.parse(atob(localStorage.getItem("term")))
      : null;
  }
  getUser(): User {
    return localStorage.getItem("user")
      ? JSON.parse(atob(localStorage.getItem("user")))
      : null;
  }
  getUserType() {
    const requestor = localStorage.getItem("requestor")
      ? JSON.parse(atob(localStorage.getItem("requestor")))
      : null;
    return requestor !== null ? requestor.reqUserRole : requestor;
  }
  setUser(): Promise<boolean> {
    return this.http
      .get<any>(`${environment.apiUrl}/auth/me`)
      .toPromise()
      .then(data => {
        if (data.user) {
          // localStorage.setItem('term', btoa(JSON.stringify(data.term)));
          localStorage.setItem("user", btoa(JSON.stringify(data.user)));
          return true;
        }
        return false;
      });
  }
}
