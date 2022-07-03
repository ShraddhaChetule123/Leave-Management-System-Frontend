import { CommonService } from './../../common.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ng-idle/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maincontent',
  templateUrl: './maincontent.component.html',
  styleUrls: ['./maincontent.component.css']
})
export class MaincontentComponent implements OnInit {
  token:any;
  no_ticket:any = null
  leaves_list :any = {
    avl : null,
    assigned : null
  }
  constructor(private services : CommonService) {
    this.token = localStorage.getItem("token")
   }

  ngOnInit(): void {
    this.services.get_univ( environment.url+"/employee/leave_counts",this.token,).subscribe(response=>{
      if(response['status'] && response['code']!==204){
        this.leaves_list.avl = response['data']['available']
        this.leaves_list.assigned = response['data']['assigned']
      }else{
        this.no_ticket = response['code']
      }
      
    })
  }

}
