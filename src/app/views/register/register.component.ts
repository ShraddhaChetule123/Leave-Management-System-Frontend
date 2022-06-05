import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../common.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  register_data = {
    fname : undefined,
    lname: undefined,
    username : undefined,
    password : undefined,
    password2 : undefined
  }
  constructor(private service: CommonService, private toastr : ToastrService, private router : Router) { }

  ngOnInit(): void {
  }

  register() {
    this.service.create_account(this.register_data).subscribe(response=>{
      if(response['status']==true){
        this.toastr.success("Account created successfully ! You can login now.")
        this.router.navigate(['/login'])
      }
    })
  }
}
