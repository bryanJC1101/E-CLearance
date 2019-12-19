import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable()
export class HeaderService {
  constructor(private http: HttpClient) {}

  get_user_access() {
    return this.http.get<any>(`${environment.apiUrl}/user/access`);
  }
}
