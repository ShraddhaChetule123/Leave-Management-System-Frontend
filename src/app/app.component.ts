import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {CommonService} from "./common.service";
import {ToastrService} from "ngx-toastr";
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lms';
  isActive: boolean = true;
  constructor(private router : Router, private services : CommonService, private toastr : ToastrService, private idle:Idle) {
   const token = localStorage.getItem("token");
   const userid = localStorage.getItem("user_id")

   if (token == undefined ||token==''){
      this.router.navigate(['/login'])
   }else {
     idle.setIdle(10)
     idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

     idle.onIdleStart.subscribe(() => {
       this.isActive = false;
       this.services.validate_login({renew:this.isActive, token}).subscribe(resp=>{
         if(resp['status']){
           this.toastr.success(resp['message'])
         }else {
           this.toastr.success(resp['message'])
           localStorage.clear()
           this.router.navigate(['/login'])
         }
       })
     });
      this.services.get_session(token).subscribe(response=>{
        // @ts-ignore
        if(response['status']==false){
          this.services.logout(token).subscribe(response=>{
            if(response['status']==true){
              this.toastr.error("You have been logged out")
              this.router.navigate(['/login'])
            }else {
              this.services.validate_login({renew:!this.isActive, token:token})
            }
          })
        }
      });
   }
  }
}
