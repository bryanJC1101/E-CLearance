import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";

@Injectable()
export class RequestorClearanceService {
  constructor(private http: HttpClient) {}

  getClearances() {
    return this.http.get<any>(`${environment.apiUrl}/clearance`);
  }
  postRequest(items) {
    return this.http.post<any>(`${environment.apiUrl}/request`, items);
  }
  getRequests() {
    return this.http.get<any>(`${environment.apiUrl}/request`);
  }
  getRequest(id) {
    return this.http.get<any>(`${environment.apiUrl}/request/` + id);
  }
}
