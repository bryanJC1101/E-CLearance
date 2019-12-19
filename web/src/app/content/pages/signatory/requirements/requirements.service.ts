import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { ClearanceService } from "../../admin/clearance/clearance.service";

@Injectable()
export class RequirementsService {
  constructor(private http: HttpClient, private clrServ: ClearanceService) {}
  getclearances() {
    return this.http.get<any>(`${environment.apiUrl}/requirements`);
  }
  postRequirements(items) {
    return this.http.post<any>(`${environment.apiUrl}/requirements`, items);
  }
}
