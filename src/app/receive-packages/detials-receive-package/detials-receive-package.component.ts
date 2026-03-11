import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePackageDto, CreateSubPackageDto, PackageDto, PackageServiceProxy, PackageTypeDto, PackageTypeServiceProxy, SubPackageDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-detials-receive-package',
  templateUrl: './detials-receive-package.component.html',
  styleUrls: ['./detials-receive-package.component.css']
})
export class DetialsReceivePackageComponent implements OnInit {
  id: number;
 PackageDto= new PackageDto();
// subPackages:  SubPackageDto = new SubPackageDto ();
subPackages: CreateSubPackageDto[] = [];
 
constructor(
    private _packageSrvice: PackageServiceProxy,
    public bsModalRef: BsModalRef,
    public route: ActivatedRoute,
    private router: Router,
   
  ) {  }
  async ngOnInit(): Promise<void> {
  
    this.id = Number.parseInt(this.route.snapshot.queryParams["packageId"]);
  
    console.log(this.route.snapshot.queryParams);

    if (this.id > 0) {
      try {
        this.PackageDto = await this._packageSrvice.getById(this.id).toPromise();

        console.log("package dto",this.PackageDto);
       
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    } else {
      console.warn('Invalid package ID');
    }
  }
  back(){
    this.router.navigate(['/app/package-receive']);
  }

}
