import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";

@Injectable()
export class AdminService {
  constructor(private http: HttpClient) {}

  // Clearances services
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

  // signatories services
  getSignatories() {
    return this.http.get<any>(`${environment.apiUrl}/signatories`);
  }
  postSignatory(items) {
    return this.http.post<any>(`${environment.apiUrl}/signatories`, items);
  }
  getSignatory(id) {
    return this.http.get<any>(`${environment.apiUrl}/signatories/` + id);
  }
  deleteSigna(id) {
    return this.http.delete<any>(`${environment.apiUrl}/signatories/` + id);
  }
  updateSignatory(items) {
    return this.http.post<any>(`${environment.apiUrl}/updateSignatory`, items);
  }

  // tracking services
  getRequests() {
    return this.http.get<any>(`${environment.apiUrl}/tracking`);
  }

  getRequestById(id) {
    return this.http.get<any>(`${environment.apiUrl}/tracking/` + id);
  }
}
