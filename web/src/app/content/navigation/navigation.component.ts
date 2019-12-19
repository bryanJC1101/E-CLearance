import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthService } from "../../auth/services/auth.service";
import { environment } from "../../../environments/environment.prod";
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"]
})
export class NavigationComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  userAccessiblity: any;
  userInformation: any;

  ngOnInit() {
    // this.addActive(this.getModuleParams(this.router.url));
    // console.log(this.getModuleParams(this.router.url));
    // // this.getUserAccessiblity();
  }

  // getUserAccessiblity() {
  //   this.http.get<any>(`${environment.apiUrl}/auth/accessibilty`).subscribe(
  //     data=>{
  //       this.userAccessiblity = data.items;
  //     }
  //   );
  // }

  // getUserInformation(){
  //   // this.http.get<any>(`${environment.apiUrl}/auth/information`).subscribe(
  //   //   data=>{
  //   //     this.userInformation = data.items;
  //   //   }
  //   // );
  // }

  // getModuleParams(url){
  //   return 'li'+url.split('/')[2];
  // }

  // addActive(attr){
  //   $('#'+attr).siblings('li').removeClass('active');
  //   $('#'+attr).siblings('li').find('.active').removeClass('active');
  //   $('#'+attr).addClass('active');
  // }
}
