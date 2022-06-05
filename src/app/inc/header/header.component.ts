import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../common.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private services : CommonService, private toastr: ToastrService, private router : Router) { }

  ngOnInit(): void {
  }

  logout() {
    const token = localStorage.getItem("token")
    const user_id = localStorage.getItem("user_id")

    this.services.logout(token).subscribe(response=>{
      if(response['status']==true){
        this.toastr.success(response['message'])
        this.router.navigate(['/login'])
      }else{
        this.toastr.error(response['message'])
      }
    })
  }
}
