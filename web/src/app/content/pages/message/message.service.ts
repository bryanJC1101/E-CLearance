import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { SignatoriesService } from "../admin/signatories/signatories.service";

@Injectable()
export class MessageService {
  unreadMsg: any;

  msgApi: any = `${environment.apiUrl}/`;

  constructor(private http: HttpClient) {}

  getSignatories() {
    return this.http.get<any>(this.msgApi + "signatories");
  }

  getRecieveMsg() {
    return this.http.get(this.msgApi + `message`);
  }

  postApprovedRquest(items) {
    return this.http.post<any>(this.msgApi + `approveRequest`, items);
  }

  getViewMessage(id) {
    return this.http.get<any>(this.msgApi + `message/` + id);
  }

  getCountMsg() {
    this.getRecieveMsg().subscribe(resp => {
      this.unreadMsg = resp;
    });
  }

  postMessage(items) {
    return this.http.post<any>(this.msgApi + `message`, items);

  }

  getSentMessages() {
    return this.http.get<any>(this.msgApi + "getsent");
  }

  postDeleteMessage(items) {
    return this.http.post<any>(this.msgApi + `deleteMsg`, items);
  }

  postDeleteMsg(id) {
    return this.http.delete<any>(this.msgApi + `message/` + id);
  }
}
