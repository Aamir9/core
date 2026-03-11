import { UserServiceProxy, UserTypeDto } from './../../../shared/service-proxies/service-proxies';
import { UserTypes } from './../../../shared/AppConsts';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-customer-activities',
  templateUrl: './customer-activities.component.html',
  styleUrls: ['./customer-activities.component.css'],
  animations: [appModuleAnimation()]
})
export class CustomerActivitiesComponent implements OnInit {
  customerId: number;
  user = new UserDto();
  constructor(
    rout: ActivatedRoute,
    private _userService: UserServiceProxy
  ) {
    this.customerId = Number.parseInt(rout.snapshot.params['customerId']);
    
  }

  ngOnInit() {
    this._userService.get(this.customerId).subscribe(result => {
      this.user = result;
    });
  }

}
