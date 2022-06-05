import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../common.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public error: boolean = false;
  login_data = {
    username : undefined,
    password : undefined
  }
  constructor(private services : CommonService, private router : Router, private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  login() {
    console.log(this.login_data)
    if (this.login_data.username==undefined || this.login_data.password==undefined){
      this.error = true
      console.log(this.error)
    }else {
      console.log("Loging")
      this.services.login(this.login_data).subscribe(response=>{
        if (response['status']==true){
          localStorage.setItem("token",response['token'])
          localStorage.setItem("user_role_id",response['userid'])
          this.toastr.success("Login successfully!")
          this.router.navigate(['']);
        }
        console.log(response)
      })
    }
  }
}
