import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {
  public extras:any;

  constructor(private router : Router) { }

  ngOnInit(): void {
    this.extras = this.router.getCurrentNavigation()?.extras.state

  }

}
