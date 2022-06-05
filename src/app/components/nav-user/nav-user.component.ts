import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../common.service";
import {ToastrService} from "ngx-toastr";
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-user',
  templateUrl: './nav-user.component.html',
  styleUrls: ['./nav-user.component.css']
})
export class NavUserComponent implements OnInit {
  userArray: any;
  constructor(private services : CommonService, private toastr : ToastrService) {
    this.loadCurrentUser()
    console.log(this.userArray)
  }

  ngOnInit(): void {
    console.log(this.userArray)
  }

  // @ts-ignore
  loadCurrentUser(){

    const token = localStorage.getItem("token")
    if(token!=undefined) {
      this.services.getTokenUser(token).subscribe(resp=> {
        if (resp["status"]==true){
          console.log(resp['data'])
          this.userArray = resp['data']
        }else {
          this.toastr.error(resp['message'])
        }
      })
    }

  }

}
