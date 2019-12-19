import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { ClearanceService } from "../../admin/clearance/clearance.service";

@Injectable()
export class SignatoryService {
  // clrServ: any;
  constructor(private http: HttpClient) {}

  getclearances() {
    return this.http.get<any>(`${environment.apiUrl}/requirements`);
  }

  postRequirements(items) {
    return this.http.post<any>(`${environment.apiUrl}/requirements`, items);
  }

  getRequestors() {
    return this.http.get<any>(`${environment.apiUrl}/requestors`);
  }

  getRequest(reqdetid, requestId) {
    return this.http.get<any>(
      `${environment.apiUrl}/getRequest/` + reqdetid + "/" + requestId
    );
  }

  postHoldRequest(items) {
    return this.http.post<any>(`${environment.apiUrl}/postHoldRequest`, items);
  }

  postCleared(id) {
    return this.http.post<any>(`${environment.apiUrl}/postCleared`, id);
  }
  getParams(url) {}
}
