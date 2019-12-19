import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";

@Injectable()
export class ClearanceService {
  constructor(private http: HttpClient) {}

  getClearances() {
    return this.http.get<any>(`${environment.apiUrl}/clearance`);
  }
  postClearance(items) {
    return this.http.post(`${environment.apiUrl}/clearance`, items);
  }
  getClearance(id) {
    return this.http.get<any>(`${environment.apiUrl}/clearance/` + id);
  }
  deleteClearance(id) {
    return this.http.delete<any>(`${environment.apiUrl}/clearance/` + id);
  }
  updateClearance(items) {
    return this.http.post(`${environment.apiUrl}/updateClearance`, items);
  }
}
