import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";

@Injectable()
export class SignatoriesService {
  constructor(private http: HttpClient) {}

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
}
