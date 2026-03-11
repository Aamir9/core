import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SyncEconomicDataServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-economic-grants',
  templateUrl: './add-economic-grants.component.html',
  styleUrls: ['./add-economic-grants.component.css']
})
export class AddEconomicGrantsComponent implements OnInit {
  saving: boolean = false;
  appSecret = "";
  grantToken = "";

  @Output() onSave = new EventEmitter<any>();
  constructor(
    private syncEconomicDataService: SyncEconomicDataServiceProxy,
    public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }
  async save() {
    this.saving = true;
    console.log(this.appSecret);
    console.log(this.grantToken);
    await this.syncEconomicDataService.saveUserEconomicGrants(this.appSecret, this.grantToken).toPromise();
    this.onSave.emit();
    this.bsModalRef.hide();
  }
}
