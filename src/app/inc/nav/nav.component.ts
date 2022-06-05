import { Component, OnInit } from '@angular/core';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import {CommonService} from "../../common.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public FaIcons = {
    bars : faBars,
    search : faSearch
  };
  public userrole = null;
  public fname = null;
  public lname = null;
  public userArray: any;

  constructor(private services : CommonService, private toastr : ToastrService) {

  }

  loadCurrentUser(){
    const token = localStorage.getItem("token")
    if(token!=undefined) {
      this.services.getTokenUser(token).subscribe(resp=> {
        if (resp["status"]==true){
          console.log(resp['data'])
          this.userArray = resp['data']
          this.userrole = this.userArray.user_role;
          this.fname = this.userArray.fname;
          this.lname = this.userArray.lname;
        }else {
          this.toastr.error(resp['message'])
        }
      })
    }

  }

  ngOnInit(): void {
    this.loadCurrentUser()
  }

  toggleSideNav() {

  }
}
