import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomerServiceProxy, SyncEconomicDataServiceProxy, SyncHistoryDetailDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@node_modules/@angular/router';
import { DetailUserDialogComponent } from '@app/users/detail-user-dialog/detail-user-dialog.component';

@Component({
  selector: 'app-economic-detail-data',
  templateUrl: './economic-detail-data.component.html',
  styleUrls: ['./economic-detail-data.component.css']
})
export class EconomicDetailDataComponent implements OnInit {
  syncHistoryDetails: SyncHistoryDetailDto[] = [];
  id:number;
  isProcessing = false;

  constructor(
      private syncEconomicDataService: SyncEconomicDataServiceProxy,
      private route: ActivatedRoute,
      private router:Router,
      public _customerService: CustomerServiceProxy,
      public _userService: UserServiceProxy,
      private _modalService: BsModalService
     ) { }

  ngOnInit() {
    this.isProcessing = true;
    this.id = Number.parseInt(this.route.snapshot.params['id']);

    this.syncEconomicDataService.getSyncHistoryDetail(this.id).subscribe(result => {
      this.syncHistoryDetails = result;
      this.isProcessing = false;
    });
  }

  viewDetail(objId:string, objType:string){
    if(objType == "Customer")
    {
      this.showCustomerSupplierDialog(Number(objId));
      // this._customerService.get(Number(objId)).subscribe((result) => {
      //   this.router.navigate(["app/customer-details", objId], {
      //      queryParams: { userId: result.userId },
      //   });
      // });
      
    }
    else if(objType == "Invoice")
    {
      this.router.navigate(['app/sales', objId]);
    }
    else if(objType == "Product")
    {
      this.router.navigate(["/app/items"], { queryParams: { productId: objId } });
    }

  }

  showCustomerSupplierDialog(userId:any): void {
      let UserDetailDialog: BsModalRef;
      UserDetailDialog = this._modalService.show(
        DetailUserDialogComponent,
        {
          class: 'customer-modal-lg',
          initialState: {
            id: userId,
          },
        }
      );
    }


}
