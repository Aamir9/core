import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProductDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-serial-dialog',
  templateUrl: './product-serial-dialog.component.html',
  styleUrls: ['./product-serial-dialog.component.css']
})
export class ProductSerialDialogComponent extends AppComponentBase implements OnInit {
product:ProductDto;
serials:Serial[]=[];
@Output() onSave = new EventEmitter<any>();
  constructor(
    public injector: Injector,

    public bsModalRef: BsModalRef,
  ) { 
    super(injector);
  }
  saving = false;
  ngOnInit() {
    console.log('product in dialog',this.product);
    //for loop from 1 to 10
    this.product.productSerials=[];
    for(let i = 0; i < this.product.inStock; i++) {
      this.serials.push(new Serial(''));
        }
  }

  save(){
    this.product.productSerials=[];
   this.serials.forEach(serial=>{
    this.product.productSerials.push(serial.name);
   });
   this.bsModalRef.hide();
   this.onSave.emit(this.product);
  }

  onCancelClick(){

  }
}

export class Serial{
  name:string;
  constructor(name:string){
    this.name = name;
  }
}